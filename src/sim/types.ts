import type { Step, Grid } from "@/game/types";

export type EpisodeResult = "win" | "death" | "timeout";

export type EpisodeConfig = {
  maxSteps: number;
};

export type Episode = {
  id: string;
  agentId: string;
  gridSize: number;
  seed: number;
  engineVersion: string;
  startedAt: number;
  finishedAt: number;
  result: EpisodeResult;
  totalReward: number;
  steps: Step[]; // includes initial Start step at index 0
  initialGrid: Grid; // snapshot for replay
  config: EpisodeConfig;
};

export type EpisodeMeta = Pick<
  Episode,
  | "id"
  | "agentId"
  | "gridSize"
  | "seed"
  | "engineVersion"
  | "startedAt"
  | "finishedAt"
  | "result"
  | "totalReward"
  | "config"
>;

export type BatchSummary = {
  agentId: string;
  runs: number;
  wins: number;
  deaths: number;
  timeouts: number;
  avgReward: number;
  avgSteps: number;
};

