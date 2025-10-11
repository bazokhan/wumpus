import type { Agent } from "./types";
import { ACTIONS } from "./types";

export const randomAgent: Agent = {
  id: "random",
  meta: {
    name: "Random Walker",
    version: "1.0.0",
    description: "Chooses a random valid action each step.",
  },
  async act({ actionsAvailable }) {
    const idx = Math.floor(Math.random() * actionsAvailable.length);
    return actionsAvailable[idx] ?? ACTIONS[0];
  },
};

