import type { Action, AgentState, Percepts } from "@/game/types";

export type AgentContext = {
  gridSize: number;
};

export interface AgentMeta {
  name: string;
  version: string;
  description?: string;
}

export interface Agent {
  id: string;
  meta: AgentMeta;
  reset?: (ctx: AgentContext) => void | Promise<void>;
  act: (input: {
    step: number; // 0-based action step (excluding initial Start)
    percepts: Percepts;
    state: AgentState;
    actionsAvailable: Action[];
  }) => Action | Promise<Action>;
}

export const ACTIONS: Action[] = [
  "TurnLeft",
  "TurnRight",
  "Forward",
  "Grab",
  "Shoot",
];

