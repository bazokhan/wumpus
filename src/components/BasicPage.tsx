"use client";
import { trpc } from "@/client/trpc";
import { Action } from "@/game/types";
import { useState } from "react";

export default function BasicPage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const start = trpc.startGame.useMutation({
    onSuccess: (r) => setGameId(r.gameId),
  });
  const step = trpc.step.useMutation();
  const state = trpc.getState.useQuery(
    { gameId: gameId! },
    { enabled: !!gameId, refetchOnWindowFocus: false }
  );
  const history = trpc.getHistory.useQuery(
    { gameId: gameId! },
    { enabled: !!gameId }
  );

  const doStep = async (action: Action) => {
    if (!gameId) return;
    await step.mutateAsync({ gameId, action });
    await state.refetch();
    await history.refetch();
  };

  return (
    <main style={{ padding: 16 }}>
      <h1>Wumpus World - Basic Mode</h1>

      {!gameId && (
        <button onClick={() => start.mutate({ gridSize: 4 })}>
          Start Game
        </button>
      )}

      {state.data && (
        <>
          <p>
            Pos: ({state.data.state.agent.x},{state.data.state.agent.y}) • Dir:{" "}
            {state.data.state.agent.dir} • Alive:{" "}
            {String(state.data.state.agent.alive)} • Gold:{" "}
            {String(state.data.state.agent.hasGold)} • Reward:{" "}
            {state.data.state.totalReward}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${state.data.state.gridSize}, 40px)`,
              gap: 4,
            }}
          >
            {state.data.state.grid.flatMap((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  style={{
                    border: "1px solid #ccc",
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {state.data.state.agent.x === x &&
                  state.data.state.agent.y === y
                    ? "A"
                    : ""}
                </div>
              ))
            )}
          </div>

          <div
            style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <button onClick={() => doStep("TurnLeft")}>⟲ Left</button>
            <button onClick={() => doStep("TurnRight")}>⟳ Right</button>
            <button onClick={() => doStep("Forward")}>↑ Forward</button>
            <button onClick={() => doStep("Grab")}>🧭 Grab</button>
            <button onClick={() => doStep("Shoot")}>🏹 Shoot</button>
          </div>

          <h3 style={{ marginTop: 16 }}>History</h3>
          <ol>
            {history.data?.history.map((s) => (
              <li key={s.index}>
                #{s.index} {s.action} → ({s.resultState.x},{s.resultState.y})
                dir {s.resultState.dir} | ΔR {s.rewardDelta} | breeze:
                {String(s.percepts.breeze)} stench:{String(s.percepts.stench)}{" "}
                glitter:{String(s.percepts.glitter)} bump:
                {String(s.percepts.bump)} scream:{String(s.percepts.scream)}
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
