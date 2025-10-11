import type { Agent } from "./types";
import { randomAgent } from "./randomAgent";
import { greedyAgent } from "./greedyAgent";

export const agents: Record<string, Agent> = {
  [randomAgent.id]: randomAgent,
  [greedyAgent.id]: greedyAgent,
};

export type { Agent } from "./types";

