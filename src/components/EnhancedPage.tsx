"use client";
import { trpc } from "@/client/trpc";
import { Action } from "@/game/types";
import { useState, useEffect, useCallback } from "react";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import GameHistory from "./GameHistory";

export default function EnhancedPage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
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

  const doStep = useCallback(
    async (action: Action) => {
      if (!gameId || state.data?.state.terminal) return;
      await step.mutateAsync({ gameId, action });
      await state.refetch();
      await history.refetch();
    },
    [gameId, step, state, history]
  );

  // Keyboard event handler
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!gameId || state.data?.state.terminal) return;

      const key = event.key.toUpperCase();
      switch (key) {
        case "W":
          doStep("Forward");
          break;
        case "A":
          doStep("TurnLeft");
          break;
        case "S":
          doStep("Shoot");
          break;
        case "D":
          doStep("TurnRight");
          break;
        case "G":
          doStep("Grab");
          break;
        default:
          break;
      }
    },
    [doStep, gameId, state.data?.state.terminal]
  );

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const gameState = state.data?.state;
  const gameHistory = history.data?.history || [];

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "2px solid #333",
        }}
      >
        <div>
          <h1
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            🗺️ Wumpus World - Enhanced Mode
          </h1>
          <p style={{ color: "#888", margin: "4px 0 0 0", fontSize: "14px" }}>
            Navigate the cave, find gold, and escape alive!
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {gameState && (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#ccc",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
                style={{ accentColor: "#4CAF50" }}
              />
              Show Hidden Elements
            </label>
          )}
        </div>
      </div>

      {!gameId && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            border: "2px solid #333",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎮</div>
          <h2 style={{ color: "#fff", marginBottom: "8px" }}>
            Ready to Explore?
          </h2>
          <p style={{ color: "#888", marginBottom: "20px" }}>
            Enter the mysterious cave and try to find the gold while avoiding
            the Wumpus and pits!
          </p>
          <button
            onClick={() => start.mutate({ gridSize: 4 })}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#45a049";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4CAF50";
            }}
          >
            🚀 Start Adventure
          </button>
        </div>
      )}

      {gameState && (
        <>
          {/* Game Status Bar */}
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #333",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ color: "#fff" }}>
                📍 Position:{" "}
                <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                  ({gameState.agent.x}, {gameState.agent.y})
                </span>
              </div>
              <div style={{ color: "#fff" }}>
                🧭 Direction:{" "}
                <span style={{ color: "#2196F3", fontWeight: "bold" }}>
                  {gameState.agent.dir}
                </span>
              </div>
              <div
                style={{ color: gameState.agent.alive ? "#4CAF50" : "#F44336" }}
              >
                ❤️ Status:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {gameState.agent.alive ? "Alive" : "Dead"}
                </span>
              </div>
              <div
                style={{ color: gameState.agent.hasGold ? "#FFD700" : "#888" }}
              >
                💎 Gold:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {gameState.agent.hasGold ? "Found" : "Not Found"}
                </span>
              </div>
              <div
                style={{
                  color: gameState.totalReward >= 0 ? "#4CAF50" : "#F44336",
                }}
              >
                🏆 Score:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {gameState.totalReward}
                </span>
              </div>
            </div>

            {gameState.terminal && (
              <div
                style={{
                  backgroundColor:
                    gameState.totalReward >= 1000 ? "#4CAF50" : "#F44336",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {gameState.totalReward >= 1000
                  ? "🎉 Victory!"
                  : "💀 Game Over!"}
              </div>
            )}
          </div>

          {/* Main Game Area */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {/* Game Board */}
            <div>
              <GameBoard gameState={gameState} showHidden={showHidden} />
            </div>

            {/* Controls */}
            <div style={{ minWidth: "300px" }}>
              <GameControls
                onAction={doStep}
                disabled={gameState.terminal}
                agentAlive={gameState.agent.alive}
                hasGold={gameState.agent.hasGold}
                hasArrow={gameState.agent.arrow > 0}
              />
            </div>
          </div>

          {/* Game History */}
          <div style={{ marginTop: "20px" }}>
            <GameHistory history={gameHistory} />
          </div>

          {/* Restart Button */}
          {gameState.terminal && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => {
                  setGameId(null);
                  setShowHidden(false);
                }}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1976D2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2196F3";
                }}
              >
                🔄 Play Again
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
