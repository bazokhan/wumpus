"use client";
import React, { useMemo, useState } from "react";
import { trpc } from "@/client/trpc";

export default function ReportsPanel() {
  const agents = trpc.agents.list.useQuery();
  const [agentId, setAgentId] = useState<string>("");
  const stats = trpc.episodes.stats.useQuery(
    { agentId: agentId || undefined },
    { refetchOnWindowFocus: true }
  );
  const utils = trpc.useUtils();

  const options = useMemo(() => [{ id: "", name: "(All Agents)", version: "" }, ...(agents.data ?? [])], [agents.data]);

  return (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
      <div className="text-white font-bold mb-3 flex items-center gap-2">
        📈 Reports
        <button
          className="ml-auto px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
          onClick={() => utils.episodes.stats.invalidate()}
          disabled={stats.isFetching}
        >
          {stats.isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mb-3">
        <label className="text-xs text-gray-300">Agent</label>
        <select
          className="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
        >
          {options.map((a) => (
            <option key={a.id} value={a.id}>{a.name}{a.version ? ` (${a.version})` : ""}</option>
          ))}
        </select>
      </div>

      {stats.data ? (
        <div className="text-xs text-gray-300 grid grid-cols-2 gap-2">
          <div><span className="text-gray-400">Runs:</span> {stats.data.runs}</div>
          <div><span className="text-gray-400">Wins:</span> {stats.data.wins}</div>
          <div><span className="text-gray-400">Deaths:</span> {stats.data.deaths}</div>
          <div><span className="text-gray-400">Timeouts:</span> {stats.data.timeouts}</div>
          <div><span className="text-gray-400">Avg Reward:</span> {stats.data.avgReward.toFixed(1)}</div>
          <div><span className="text-gray-400">Avg Steps:</span> {stats.data.avgSteps.toFixed(1)}</div>
        </div>
      ) : (
        <div className="text-xs text-gray-400">No data yet. Run some episodes.</div>
      )}
    </div>
  );
}

