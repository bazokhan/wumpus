"use client";
import React, { useMemo, useState } from "react";
import { trpc } from "@/client/trpc";

type Props = {
  onEpisodeCreated?: (episodeId: string) => void;
};

export default function AgentControls({ onEpisodeCreated }: Props) {
  const utils = trpc.useUtils();
  const agents = trpc.agents.list.useQuery();
  const runOne = trpc.episodes.runOne.useMutation();
  const runBatch = trpc.episodes.runBatch.useMutation();

  const [agentId, setAgentId] = useState<string>("");
  const [gridSize, setGridSize] = useState<number>(4);
  const [maxSteps, setMaxSteps] = useState<number>(200);
  const [seed, setSeed] = useState<string>("");
  const [runs, setRuns] = useState<number>(20);
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "running"; text: string }
    | { kind: "success"; text: string }
    | { kind: "error"; text: string }
  >({ kind: "idle" });

  const agentOptions = useMemo(() => agents.data ?? [], [agents.data]);

  const selected = agentOptions.find((a) => a.id === agentId) ?? agentOptions[0];

  const disabled = runOne.isPending || runBatch.isPending;

  return (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
      <div className="text-white font-bold mb-3 flex items-center gap-2">
        🤖 Agent Runner
      </div>

      {/* Agent selection */}
      <div className="mb-3">
        <label className="text-xs text-gray-300">Agent</label>
        <select
          className="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          value={agentId || selected?.id || ""}
          onChange={(e) => setAgentId(e.target.value)}
        >
          {agentOptions.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.version})
            </option>
          ))}
        </select>
        {selected?.description && (
          <div className="text-xs text-gray-400 mt-1">{selected.description}</div>
        )}
      </div>

      {/* Params */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-xs text-gray-300">Grid Size</label>
          <input
            type="number"
            min={2}
            max={10}
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value || "4", 10))}
            className="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          />
        </div>
        <div>
          <label className="text-xs text-gray-300">Max Steps</label>
          <input
            type="number"
            min={1}
            max={10000}
            value={maxSteps}
            onChange={(e) => setMaxSteps(parseInt(e.target.value || "200", 10))}
            className="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          />
        </div>
        <div>
          <label className="text-xs text-gray-300">Seed (optional)</label>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          />
        </div>
        <div>
          <label className="text-xs text-gray-300">Runs (batch)</label>
          <input
            type="number"
            min={1}
            max={10000}
            value={runs}
            onChange={(e) => setRuns(parseInt(e.target.value || "20", 10))}
            className="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          disabled={disabled || !selected}
          onClick={async () => {
            if (!selected) return;
            try {
              setStatus({ kind: "running", text: `Running episode with ${selected.name}...` });
              const ep = await runOne.mutateAsync({
                agentId: selected.id,
                gridSize,
                maxSteps,
                seed: seed ? parseInt(seed, 10) : undefined,
              });
              // invalidate lists and stats so other panels refresh
              await Promise.all([
                utils.episodes.list.invalidate(),
                utils.episodes.stats.invalidate(),
              ]);
              const epId = ep.id ?? "";
              onEpisodeCreated?.(epId);
              setStatus({ kind: "success", text: `Episode completed (id: ${String(epId).slice(0,8)}).` });
            } catch (e: unknown) {
              setStatus({ kind: "error", text: e instanceof Error ? e.message : "Failed to run episode" });
            }
          }}
          className={`flex-1 p-2 rounded font-bold ${
            disabled ? "bg-gray-700 text-gray-500" : "bg-green-600 text-white hover:bg-green-500"
          }`}
        >
          ▶ Run One
        </button>
        <button
          disabled={disabled || !selected}
          onClick={async () => {
            if (!selected) return;
            try {
              setStatus({ kind: "running", text: `Running batch of ${runs} with ${selected.name}...` });
              const res = await runBatch.mutateAsync({
                agentId: selected.id,
                gridSize,
                runs,
                maxSteps,
              });
              await Promise.all([
                utils.episodes.list.invalidate(),
                utils.episodes.stats.invalidate(),
              ]);
              setStatus({ kind: "success", text: `Batch done: ${res.summary.wins} wins, ${res.summary.deaths} deaths, ${res.summary.timeouts} timeouts.` });
            } catch (e: unknown) {
              setStatus({ kind: "error", text: e instanceof Error ? e.message : "Failed to run batch" });
            }
          }}
          className={`flex-1 p-2 rounded font-bold ${
            disabled ? "bg-gray-700 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          📊 Run Batch
        </button>
      </div>

      {/* Status banners */}
      {status.kind === "running" && (
        <div className="mt-2 p-2 text-xs rounded bg-yellow-900/40 border border-yellow-700 text-yellow-300">
          {status.text}
        </div>
      )}
      {status.kind === "success" && (
        <div className="mt-2 p-2 text-xs rounded bg-green-900/40 border border-green-700 text-green-300">
          {status.text}
        </div>
      )}
      {status.kind === "error" && (
        <div className="mt-2 p-2 text-xs rounded bg-red-900/40 border border-red-700 text-red-300">
          {status.text}
        </div>
      )}

      {runBatch.data?.summary && (
        <div className="mt-3 text-xs text-gray-300">
          <div className="font-bold mb-1">Batch Summary</div>
          <div className="grid grid-cols-3 gap-2">
            <div>Wins: {runBatch.data.summary.wins}</div>
            <div>Deaths: {runBatch.data.summary.deaths}</div>
            <div>Timeouts: {runBatch.data.summary.timeouts}</div>
            <div>Avg Reward: {runBatch.data.summary.avgReward.toFixed(1)}</div>
            <div>Avg Steps: {runBatch.data.summary.avgSteps.toFixed(1)}</div>
            <div>Total Runs: {runBatch.data.summary.runs}</div>
          </div>
        </div>
      )}
    </div>
  );
}
