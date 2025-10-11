import type { Action, AgentState, GameState, Grid, Percepts } from "./types";
import { randomUUID } from "crypto";

export const ENGINE_VERSION = "1.0.0";

// Simple seeded random number generator (LCG algorithm)
function seededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % 2**32;
    return state / 2**32;
  };
}

export function newGrid(n: number, seed = 42): Grid {
  const random = seededRandom(seed);
  const g: Grid = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({}))
  );

  // Helper to get random cell that's not (0,0) and not already occupied
  const getRandomEmptyCell = (exclude: Set<string> = new Set()): [number, number] => {
    let attempts = 0;
    while (attempts < 100) {
      const x = Math.floor(random() * n);
      const y = Math.floor(random() * n);
      const key = `${x},${y}`;
      
      // Skip starting position (0,0) and already occupied cells
      if ((x === 0 && y === 0) || exclude.has(key)) {
        attempts++;
        continue;
      }
      
      return [x, y];
    }
    // Fallback if we can't find a spot
    return [n - 1, n - 1];
  };

  const occupied = new Set<string>();

  // Place exactly one Wumpus
  const [wumpusX, wumpusY] = getRandomEmptyCell(occupied);
  g[wumpusY][wumpusX].wumpus = true;
  occupied.add(`${wumpusX},${wumpusY}`);

  // Place exactly one Gold
  const [goldX, goldY] = getRandomEmptyCell(occupied);
  g[goldY][goldX].gold = true;
  occupied.add(`${goldX},${goldY}`);

  // Place 2-4 pits (scaled by grid size)
  const numPits = Math.max(2, Math.min(Math.floor(n * 0.8), Math.floor(random() * 3) + 2));
  for (let i = 0; i < numPits; i++) {
    const [pitX, pitY] = getRandomEmptyCell(occupied);
    g[pitY][pitX].pit = true;
    occupied.add(`${pitX},${pitY}`);
  }

  return g;
}

export function startGame(gridSize = 4, providedSeed?: number): GameState {
  const agent: AgentState = {
    x: 0,
    y: 0,
    dir: "E",
    hasGold: false,
    arrow: 1,
    alive: true,
  };
  // Generate or use provided seed for reproducible grids
  const seed = providedSeed ?? Math.floor(Math.random() * 1000000);
  const grid = newGrid(gridSize, seed);
  
  // Calculate initial percepts for the starting position
  const initialPercepts = percepts(grid, agent);
  
  // Store persistent percepts in the starting cell
  const startingCell = grid[agent.y][agent.x];
  startingCell.persistentPercepts = { ...initialPercepts };
  
  return {
    gameId: globalThis.crypto?.randomUUID?.() ?? randomUUID(),
    gridSize,
    grid,
    agent,
    terminal: false,
    totalReward: 0,
    seed,
    engineVersion: ENGINE_VERSION,
    history: [{
      index: 0,
      action: "Start" as Action, // Special action for initial state
      resultState: agent,
      percepts: initialPercepts,
      rewardDelta: 0,
      timestamp: Date.now(),
    }],
  };
}

function left(d: AgentState["dir"]): AgentState["dir"] {
  return ({ N: "W", W: "S", S: "E", E: "N" } as const)[d];
}

function right(d: AgentState["dir"]): AgentState["dir"] {
  return ({ N: "E", E: "S", S: "W", W: "N" } as const)[d];
}

function forwardPos(a: AgentState & { gridSize: number }): { x: number; y: number; bump: boolean } {
  const delta = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] } as const;
  const [dx, dy] = delta[a.dir];
  const nx = a.x + dx,
    ny = a.y + dy;
  const bump = nx < 0 || ny < 0 || nx >= a.gridSize || ny >= a.gridSize;
  return { x: bump ? a.x : nx, y: bump ? a.y : ny, bump };
}

function percepts(g: Grid, a: AgentState): Percepts {
  const adj = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const inb = (x: number, y: number) =>
    y >= 0 && x >= 0 && y < g.length && x < g[0].length;
  const neigh = adj
    .map(([dx, dy]) => [a.x + dx, a.y + dy] as const)
    .filter(([x, y]) => inb(x, y));
  const breeze = neigh.some(([x, y]) => g[y][x].pit);
  const stench = neigh.some(([x, y]) => g[y][x].wumpus);
  const glitter = !!g[a.y][a.x].gold;
  return { breeze, stench, glitter, bump: false, scream: false };
}

export function toggleCellColor(state: GameState, x: number, y: number): GameState {
  if (x < 0 || y < 0 || x >= state.gridSize || y >= state.gridSize) return state;
  
  const cell = state.grid[y][x];
  const currentColor = cell.userColor;
  
  // Cycle through: undefined -> green -> yellow -> red -> undefined
  if (!currentColor) {
    cell.userColor = "green";
  } else if (currentColor === "green") {
    cell.userColor = "yellow";
  } else if (currentColor === "yellow") {
    cell.userColor = "red";
  } else {
    delete cell.userColor;
  }
  
  return { ...state };
}

export function step(state: GameState, action: Action): GameState {
  if (state.terminal) return state;

  let reward = -1; // time penalty
  let scream = false;
  let bump = false;
  const a = { ...state.agent };

  switch (action) {
    case "Start":
      // Start action doesn't change anything, just returns current state
      break;
    case "TurnLeft":
      a.dir = left(a.dir);
      break;
    case "TurnRight":
      a.dir = right(a.dir);
      break;
    case "Forward": {
      const f = forwardPos({ ...a, gridSize: state.gridSize });
      bump = f.bump;
      a.x = f.x;
      a.y = f.y;
      break;
    }
    case "Grab":
      if (state.grid[a.y][a.x].gold && !a.hasGold) {
        a.hasGold = true;
        state.grid[a.y][a.x].gold = false;
        reward += 1000;
      }
      break;
    case "Shoot":
      if (a.arrow === 1) {
        a.arrow = 0;
        // Minimal: if wumpus is in straight line with no wall between → kill
        const lineHit = (() => {
          for (let i = 0; i < state.gridSize; i++) {
            const x =
              a.dir === "E" ? i : a.dir === "W" ? state.gridSize - 1 - i : a.x;
            const y =
              a.dir === "S" ? i : a.dir === "N" ? state.gridSize - 1 - i : a.y;
            if (a.dir === "E" || a.dir === "W") {
              if (y !== a.y) continue;
            }
            if (a.dir === "N" || a.dir === "S") {
              if (x !== a.x) continue;
            }
            if (x === a.x && y === a.y) continue;
            if (state.grid[y][x].wumpus) {
              state.grid[y][x].wumpus = false;
              scream = true;
              return true;
            }
          }
          return false;
        })();
        reward += lineHit ? 0 : 0; // no extra shaping
      } else {
        reward -= 10; // shooting without arrow
      }
      break;
  }

  // hazards
  const cell = state.grid[a.y][a.x];
  if (cell.pit || cell.wumpus) {
    a.alive = false;
    reward -= 1000;
    state.terminal = true;
  }

  // win condition: agent has gold and is back to start
  if (a.hasGold && a.x === 0 && a.y === 0) {
    state.terminal = true;
    reward += 1000;
  }

  const p = percepts(state.grid, a);
  p.bump = bump;
  p.scream = scream;

  // Store persistent percepts in the cell
  const currentCell = state.grid[a.y][a.x];
  currentCell.persistentPercepts = { ...p };

  state.agent = a;
  state.totalReward += reward;
  state.history.push({
    index: state.history.length,
    action,
    resultState: a,
    percepts: p,
    rewardDelta: reward,
    timestamp: Date.now(),
  });
  return state;
}
