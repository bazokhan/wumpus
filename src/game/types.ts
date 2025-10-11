export type Direction = "N" | "E" | "S" | "W";

export type Action = "TurnLeft" | "TurnRight" | "Forward" | "Grab" | "Shoot" | "Start";

export type Percept = "breeze" | "stench" | "glitter" | "bump" | "scream";

export type Percepts = {
  breeze: boolean;
  stench: boolean;
  glitter: boolean;
  bump: boolean;
  scream: boolean;
};

export type Cell = { 
  pit?: boolean; 
  wumpus?: boolean; 
  gold?: boolean;
  userColor?: "green" | "yellow" | "red"; // User's color marking
  persistentPercepts?: Percepts; // Percepts that persist when leaving the cell
};

export type Grid = Cell[][]; // [y][x]

export type AgentState = {
  x: number;
  y: number;
  dir: Direction;
  hasGold: boolean;
  arrow: 0 | 1;
  alive: boolean;
};

export type Step = {
  index: number;
  action: Action;
  resultState: AgentState;
  percepts: Percepts;
  rewardDelta: number;
  timestamp: number;
};

export type GameState = {
  gameId: string;
  gridSize: number;
  grid: Grid; // hide wumpus/pits on client if you want “fog”
  agent: AgentState;
  terminal: boolean;
  totalReward: number;
  history: Step[]; // can be omitted from “getState” for lighter payloads
};
