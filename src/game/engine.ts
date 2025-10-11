import type { Action, AgentState, GameState, Grid, Percepts } from "./types";

export function newGrid(n: number, seed = 42): Grid {
  // Minimal: place one wumpus, one gold, a few pits (not at 0,0). Replace with seeded RNG as needed.
  const g: Grid = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({}))
  );
  g[n - 1][n - 1].wumpus = true;
  g[1][2].pit = true;
  g[2][1].pit = true;
  g[2][2].gold = true;
  return g;
}

export function startGame(gridSize = 4): GameState {
  const agent: AgentState = {
    x: 0,
    y: 0,
    dir: "E",
    hasGold: false,
    arrow: 1,
    alive: true,
  };
  return {
    gameId: crypto.randomUUID(),
    gridSize,
    grid: newGrid(gridSize),
    agent,
    terminal: false,
    totalReward: 0,
    history: [],
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
    y >= 0 && x >= 0 && y < g.length && x < g.length;
  const neigh = adj
    .map(([dx, dy]) => [a.x + dx, a.y + dy] as const)
    .filter(([x, y]) => inb(x, y));
  const breeze = neigh.some(([x, y]) => g[y][x].pit);
  const stench = neigh.some(([x, y]) => g[y][x].wumpus);
  const glitter = !!g[a.y][a.x].gold;
  return { breeze, stench, glitter, bump: false, scream: false };
}

export function step(state: GameState, action: Action): GameState {
  if (state.terminal) return state;

  let reward = -1; // time penalty
  let scream = false;
  let bump = false;
  const a = { ...state.agent };

  switch (action) {
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
