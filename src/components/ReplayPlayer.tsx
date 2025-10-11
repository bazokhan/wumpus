"use client";
import React, { useEffect, useMemo, useState } from "react";
import { trpc } from "@/client/trpc";
import GameBoard from "./GameBoard";
import GameHistory from "./GameHistory";
import type { Episode, EpisodeMeta } from "@/sim/types";
import type { GameState, Step } from "@/game/types";

function buildReplayState(ep: Episode, uptoIndex: number): GameState {
  const idx = Math.max(0, Math.min(uptoIndex, ep.steps.length - 1));
  const step = ep.steps[idx];
  const grid = JSON.parse(JSON.stringify(ep.initialGrid));
  // reconstruct persistent percepts from all steps so far
  for (let i = 0; i <= idx; i++) {
    const s = ep.steps[i];
    const { x, y } = s.resultState;
    grid[y][x].persistentPercepts = { ...s.percepts };
  }
  const history: Step[] = ep.steps.slice(0, idx + 1);
  const totalReward = history.reduce((acc, s) => acc + s.rewardDelta, 0);
  const state: GameState = {
    gameId: ep.id,
    gridSize: ep.gridSize,
    grid,
    agent: { ...step.resultState },
    terminal: idx === ep.steps.length - 1,
    totalReward,
    history,
    seed: ep.seed,
    engineVersion: ep.engineVersion,
  };
  return state;
}

export default function ReplayPlayer() {
  const episodes = trpc.episodes.list.useQuery({ limit: 50 }, { refetchOnWindowFocus: true });
  const [selected, setSelected] = useState<string>("");
  const episode = trpc.episodes.get.useQuery({ id: selected }, { enabled: !!selected });

  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step

  const ep = episode.data as unknown as Episode | undefined;

  useEffect(() => {
    if (!playing || !ep) return;
    if (cursor >= (ep?.steps.length ?? 1) - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setCursor((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [playing, cursor, speed, ep]);

  useEffect(() => {
    if (!ep) return;
    setCursor(0);
  }, [ep]);

  const state: GameState | null = useMemo(() => {
    if (!ep) return null;
    return buildReplayState(ep, cursor);
  }, [ep, cursor]);

  const list = (episodes.data ?? []) as EpisodeMeta[];

  return (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
      <div className="text-white font-bold mb-3 flex items-center gap-2">
        🎞️ Replays
        <button
          className="ml-auto px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
          onClick={() => episodes.refetch()}
          disabled={episodes.isFetching}
        >
          {episodes.isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Episode list */}
      <div className="mb-3">
        <label className="text-xs text-gray-300">Recent Episodes</label>
        <select
          className="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="" disabled>
            Select an episode...
          </option>
          {list.map((e) => (
            <option key={e.id} value={e.id}>
              {e.id.slice(0, 8)} • {e.agentId} • {e.result} • R={e.totalReward}
            </option>
          ))}
        </select>
      </div>

      {state && ep && (
        <>
          {/* Transport controls */}
          <div className="flex items-center gap-2 mb-3">
            <button
              className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
              onClick={() => setCursor(0)}
            >
              ⏮
            </button>
            <button
              className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
              onClick={() => setCursor((c) => Math.max(0, c - 1))}
            >
              ⏪
            </button>
            <button
              className={`px-2 py-1 rounded border font-bold ${
                playing ? "bg-red-600 text-white border-red-500" : "bg-green-600 text-white border-green-500"
              }`}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
              onClick={() => setCursor((c) => Math.min(ep.steps.length - 1, c + 1))}
            >
              ⏩
            </button>
            <button
              className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
              onClick={() => setCursor(ep.steps.length - 1)}
            >
              ⏭
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-300">
              <span>Speed</span>
              <input
                type="range"
                min={100}
                max={1500}
                step={50}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              />
              <span>{speed} ms</span>
            </div>
          </div>

          {/* Board + History */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex justify-center">
              <GameBoard gameState={state} showHidden={false} />
            </div>
            <div className="lg:w-96 lg:min-w-96">
              <GameHistory history={state.history} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
