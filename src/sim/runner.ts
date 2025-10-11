import { startGame, step as stepGame } from "@/game/engine";
import type { Action, GameState } from "@/game/types";
import type { Agent } from "@/agents";
import { ACTIONS } from "@/agents/types";
import type { BatchSummary, Episode } from "./types";
import { randomUUID } from "crypto";

function deepCloneGrid(grid: GameState["grid"]): GameState["grid"] {
  return JSON.parse(JSON.stringify(grid));
}

export async function simulateEpisode(params: {
  agent: Agent;
  gridSize: number;
  seed?: number;
  maxSteps?: number;
}): Promise<Episode> {
  const maxSteps = params.maxSteps ?? 200;
  const gs = startGame(params.gridSize, params.seed);
  const initialGrid = deepCloneGrid(gs.grid);

  await params.agent.reset?.({ gridSize: params.gridSize });

  let stepsTaken = 0;
  while (!gs.terminal && stepsTaken < maxSteps) {
    const lastStep = gs.history[gs.history.length - 1];
    const action = await params.agent.act({
      step: stepsTaken,
      percepts: lastStep.percepts,
      state: gs.agent,
      actionsAvailable: ACTIONS,
    });
    // safety: ensure only allowed actions
    const chosen: Action = ACTIONS.includes(action) ? action : "Forward";
    stepGame(gs, chosen);
    stepsTaken++;
  }

  const result: Episode["result"] = gs.terminal
    ? gs.agent.alive
      ? "win"
      : "death"
    : "timeout";

  return {
    id: randomUUID(),
    agentId: params.agent.id,
    gridSize: gs.gridSize,
    seed: gs.seed,
    engineVersion: gs.engineVersion,
    startedAt: gs.history[0]?.timestamp ?? Date.now(),
    finishedAt: gs.history[gs.history.length - 1]?.timestamp ?? Date.now(),
    result,
    totalReward: gs.totalReward,
    steps: gs.history.slice(),
    initialGrid,
    config: { maxSteps },
  };
}

export async function simulateBatch(params: {
  agent: Agent;
  gridSize: number;
  runs: number;
  seeds?: number[];
  maxSteps?: number;
}): Promise<{ episodes: Episode[]; summary: BatchSummary }> {
  const episodes: Episode[] = [];
  let wins = 0,
    deaths = 0,
    timeouts = 0,
    totalReward = 0,
    totalSteps = 0;

  for (let i = 0; i < params.runs; i++) {
    const seed = params.seeds?.[i] ?? Math.floor(Math.random() * 1_000_000);
    const ep = await simulateEpisode({
      agent: params.agent,
      gridSize: params.gridSize,
      seed,
      maxSteps: params.maxSteps,
    });
    episodes.push(ep);
    totalReward += ep.totalReward;
    totalSteps += Math.max(0, ep.steps.length - 1); // exclude Start step
    if (ep.result === "win") wins++;
    else if (ep.result === "death") deaths++;
    else timeouts++;
  }

  const summary: BatchSummary = {
    agentId: params.agent.id,
    runs: params.runs,
    wins,
    deaths,
    timeouts,
    avgReward: episodes.length ? totalReward / episodes.length : 0,
    avgSteps: episodes.length ? totalSteps / episodes.length : 0,
  };

  return { episodes, summary };
}
