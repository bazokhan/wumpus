import type { Agent } from "./types";
import { randomAgent } from "./randomAgent";
import { greedyAgent } from "./greedyAgent";
import { bazAlpha } from "./bazAlpha";

export const agents: Record<string, Agent> = {
  [randomAgent.id]: randomAgent,
  [greedyAgent.id]: greedyAgent,
  [bazAlpha.id]: bazAlpha,
};

export type { Agent } from "./types";
