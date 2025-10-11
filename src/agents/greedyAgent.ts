import type { Agent } from "./types";
import { ACTIONS } from "./types";

export const greedyAgent: Agent = {
  id: "greedy",
  meta: {
    name: "Greedy Percepts",
    version: "1.0.0",
    description: "Grabs on glitter; otherwise prefer forward, else turn right.",
  },
  async act({ percepts, state }) {
    if (percepts.glitter) return "Grab";
    // very naive policy: try to move forward; if at boundary (bump perceived last step), turn right
    // Note: bump is immediate; if last step bumped, engine sets bump in percepts
    // We don't store previous percepts, so if scream is heard we ignore it here.
    // Try Forward most of the time to make progress; fallback to TurnRight.
    // If the agent is at (0,0) with gold -> engine will win when moving Start->... we still move forward.
    const prefer: typeof ACTIONS = ["Forward", "TurnRight", "TurnLeft", "Shoot", "Grab"];
    return prefer.find((a) => (a === "Shoot" ? state.arrow > 0 : true)) ?? "Forward";
  },
};

