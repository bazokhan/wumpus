import { Agent } from "./types";
import { Percepts, AgentState, Direction, Action } from "@/game/types";

enum State {
  NO = "NO",
  YES = "YES",
  MAYBE = "MAYBE",
  UNKNOWN = "UNKNOWN",
}

type TileState = {
  x: number;
  y: number;
  hasPit: State;
  hasWumpus: State;
};

type TileMemoryState = Percepts & TileState;

const defaultTileMemoryState: TileMemoryState = {
  hasPit: State.UNKNOWN,
  hasWumpus: State.UNKNOWN,
  breeze: false,
  stench: false,
  glitter: false,
  bump: false,
  scream: false,
  x: 0,
  y: 0,
};

export class BazAlpha implements Agent {
  id = "BazAlpha";
  meta = {
    name: "Baz Alpha",
    version: "1.0.0",
    description: "An agent that uses memory to make decisions.",
  };
  memory = {
    tiles: new Map<string, TileMemoryState>(),
  };
  gridSize: number = 4;
  hasGold: boolean = false;
  hasArrow: boolean = true;
  actionsAvailable: Action[] = [];
  visitedTiles: Set<string> = new Set();
  walls: Set<string> = new Set(); // "x,y,dir" format
  currentPosition: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };
  currentDirection: Direction = "N";

  get currentTileMemoryState() {
    return this.memory.tiles.get(
      `${this.currentPosition.x},${this.currentPosition.y}`
    );
  }

  get adjacentTiles() {
    const tiles = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // same tile
        if (
          this.currentPosition.x + dx < 0 ||
          this.currentPosition.x + dx >= this.gridSize ||
          this.currentPosition.y + dy < 0 ||
          this.currentPosition.y + dy >= this.gridSize
        )
          continue; // out of bounds
        if (Math.abs(dx) + Math.abs(dy) > 1) continue; // diagonal
        tiles.push({
          x: this.currentPosition.x + dx,
          y: this.currentPosition.y + dy,
        });
      }
    }
    if (tiles.length === 0) {
      throw new Error("No adjacent tiles found");
    }
    return tiles;
  }

  get adjacentTileMemoryStates() {
    return this.adjacentTiles.map((tile) => ({
      ...(this.memory.tiles.get(`${tile.x},${tile.y}`) ??
        defaultTileMemoryState),
      ...tile,
    }));
  }

  private inferHasPit() {
    if (!this.currentTileMemoryState) {
      throw new Error("Current tile memory state is not set");
    }
    if (this.currentTileMemoryState?.breeze) {
      for (const tile of this.adjacentTileMemoryStates) {
        // if we already have a YES or a NO for hasPit, then we don't need to infer anything
        if (tile.hasPit === State.YES || tile.hasPit === State.NO) {
          continue;
        }
        // if all other adjacent tiles has NO for hasPit, then current tile has YES for hasPit
        if (
          this.adjacentTileMemoryStates
            .filter(({ x, y }) => x !== tile.x || y !== tile.y)
            .every((t) => t.hasPit === State.NO)
        ) {
          tile.hasPit = State.YES;
        } else {
          // in all other cases, we need to infer MAYBE for hasPit
          tile.hasPit = State.MAYBE;
        }
      }
    } else {
      // if there is no breeze, then we need to infer NO for hasPit for all adjacent tiles
      for (const tile of this.adjacentTileMemoryStates) {
        tile.hasPit = State.NO;
      }
    }
  }

  private inferHasWumpus() {
    if (!this.currentTileMemoryState) {
      throw new Error("Current tile memory state is not set");
    }
    if (this.currentTileMemoryState?.stench) {
      for (const tile of this.adjacentTileMemoryStates) {
        // if we already have a YES or a NO for hasWumpus, then we don't need to infer anything
        if (tile.hasWumpus === State.YES || tile.hasWumpus === State.NO) {
          continue;
        }
        // if all other adjacent tiles has NO for hasWumpus, then current tile has YES for hasWumpus
        if (
          this.adjacentTileMemoryStates
            .filter(({ x, y }) => x !== tile.x || y !== tile.y)
            .every((t) => t.hasWumpus === State.NO)
        ) {
          tile.hasWumpus = State.YES;
        } else {
          // in all other cases, we need to infer MAYBE for hasWumpus
          tile.hasWumpus = State.MAYBE;
        }
      }
    } else {
      // if there is no stench, then we need to infer NO for hasWumpus for all adjacent tiles
      for (const tile of this.adjacentTileMemoryStates) {
        tile.hasWumpus = State.NO;
      }
    }
  }

  private tellPercepts(percepts: Percepts, state: AgentState) {
    const { x, y, dir, hasGold, arrow } = state;
    this.currentPosition = { x, y };
    this.currentDirection = dir;
    this.hasGold = hasGold;
    this.hasArrow = arrow > 0;
    
    // If we bumped, remember there's a wall in this direction from this position
    if (percepts.bump) {
      this.walls.add(`${x},${y},${dir}`);
    }
    
    // If we hear a scream, the wumpus is dead - mark all tiles as NO wumpus
    if (percepts.scream) {
      for (const [key, tile] of this.memory.tiles) {
        if (tile.hasWumpus !== State.NO) {
          this.memory.tiles.set(key, { ...tile, hasWumpus: State.NO });
        }
      }
    }
    
    const key = `${x},${y}`;
    this.memory.tiles.set(key, {
      ...(this.memory.tiles.get(key) ?? defaultTileMemoryState),
      // if the agent is alive, then we need to infer NO for hasPit and hasWumpus
      hasPit: state.alive ? State.NO : State.YES,
      hasWumpus: state.alive ? State.NO : State.YES,
      ...percepts,
      x,
      y,
    });
  }

  private inferPercepts() {
    this.inferHasPit();
    this.inferHasWumpus();
  }

  private tellInferredPercepts() {
    this.adjacentTileMemoryStates.forEach((tile) => {
      this.memory.tiles.set(`${tile.x},${tile.y}`, tile);
    });
  }

  private getDirectionToTile(targetX: number, targetY: number): Direction | null {
    const dx = targetX - this.currentPosition.x;
    const dy = targetY - this.currentPosition.y;
    if (dx === 1) return "E";
    if (dx === -1) return "W";
    if (dy === 1) return "N";
    if (dy === -1) return "S";
    return null;
  }

  private getActionToFaceDirection(targetDir: Direction): Action | null {
    if (this.currentDirection === targetDir) return "Forward";
    const dirs: Direction[] = ["N", "E", "S", "W"];
    const currentIdx = dirs.indexOf(this.currentDirection);
    const targetIdx = dirs.indexOf(targetDir);
    const diff = (targetIdx - currentIdx + 4) % 4;
    if (diff === 1) return "TurnRight";
    if (diff === 3) return "TurnLeft";
    if (diff === 2) return "TurnRight"; // arbitrary choice
    return null;
  }

  private canMoveForward(): boolean {
    // Don't move forward if we know there's a wall in this direction
    const wallKey = `${this.currentPosition.x},${this.currentPosition.y},${this.currentDirection}`;
    if (this.walls.has(wallKey)) {
      return false;
    }
    return this.actionsAvailable.includes("Forward");
  }

  private makeDecision(): Action {
    // Pick up gold if present
    if (this.currentTileMemoryState?.glitter && this.actionsAvailable.includes("Grab")) {
      return "Grab";
    }

    // Shoot wumpus if we know its location, have arrow, and can shoot
    if (this.hasArrow && this.actionsAvailable.includes("Shoot")) {
      for (const tile of this.adjacentTileMemoryStates) {
        if (tile.hasWumpus === State.YES) {
          const dirToWumpus = this.getDirectionToTile(tile.x, tile.y);
          if (dirToWumpus && this.currentDirection === dirToWumpus) {
            return "Shoot";
          }
        }
      }
    }

    // If we have gold, return to (0,0)
    if (this.hasGold && (this.currentPosition.x !== 0 || this.currentPosition.y !== 0)) {
      const targetDir = this.currentPosition.x !== 0 
        ? (this.currentPosition.x > 0 ? "W" : "E")
        : (this.currentPosition.y > 0 ? "S" : "N");
      
      if (this.currentDirection === targetDir && this.canMoveForward()) {
        return "Forward";
      }
      const action = this.getActionToFaceDirection(targetDir);
      if (action && this.actionsAvailable.includes(action)) return action;
    }

    // Helper: Try to move to a tile
    const tryMoveTo = (tiles: Array<{ x: number; y: number }>) => {
      for (const tile of tiles) {
        const dir = this.getDirectionToTile(tile.x, tile.y);
        if (!dir) continue;
        
        // Check if there's a wall blocking this direction
        const wallKey = `${this.currentPosition.x},${this.currentPosition.y},${dir}`;
        if (this.walls.has(wallKey)) continue; // Skip this tile, there's a wall
        
        // If facing the right direction and can move, do it
        if (this.currentDirection === dir && this.canMoveForward()) {
          return "Forward";
        }
        
        // Otherwise, turn towards it (but not if already facing it - that means we can't move)
        if (this.currentDirection !== dir) {
          const action = this.getActionToFaceDirection(dir);
          if (action && this.actionsAvailable.includes(action)) {
            return action;
          }
        }
      }
      return null;
    };

    // Find safe tiles
    const safeTiles = this.adjacentTileMemoryStates.filter(
      (tile) => tile.hasPit === State.NO && tile.hasWumpus === State.NO
    );

    // Prefer unvisited safe tiles
    const unvisitedSafe = safeTiles.filter(
      (tile) => !this.visitedTiles.has(`${tile.x},${tile.y}`)
    );
    const action1 = tryMoveTo(unvisitedSafe);
    if (action1) return action1;

    // Revisit safe tiles
    const action2 = tryMoveTo(safeTiles);
    if (action2) return action2;

    // Try UNKNOWN or MAYBE dangerous (but not YES)
    const explorable = this.adjacentTileMemoryStates.filter(
      (tile) => tile.hasPit !== State.YES && tile.hasWumpus !== State.YES
    );
    const action3 = tryMoveTo(explorable);
    if (action3) return action3;

    // Stuck: just turn or take any action
    if (this.actionsAvailable.includes("TurnRight")) return "TurnRight";
    return this.actionsAvailable[0] ?? "TurnRight";
  }

  reset() {
    this.memory = {
      tiles: new Map<string, TileMemoryState>(),
    };
    this.hasGold = false;
    this.hasArrow = true;
    this.visitedTiles.clear();
    this.walls.clear();
    this.currentPosition = { x: 0, y: 0 };
    this.currentDirection = "N";
  }

  async act(input: {
    step: number;
    percepts: Percepts;
    state: AgentState;
    actionsAvailable: Action[];
  }): Promise<Action> {
    const { percepts, state, actionsAvailable } = input;

    // TELL percepts
    this.actionsAvailable = actionsAvailable;
    this.visitedTiles.add(`${state.x},${state.y}`);
    this.tellPercepts(percepts, state);
    this.inferPercepts();
    // TELL inferred percepts
    this.tellInferredPercepts();

    // ASK
    const decision = this.makeDecision();
    
    // Debug logging for first few steps
    if (input.step < 20) {
      console.log(`\n=== Step ${input.step} ===`);
      console.log(`Pos: (${state.x},${state.y}) Dir: ${state.dir}`);
      console.log(`Percepts:`, percepts);
      console.log(`Available:`, actionsAvailable);
      console.log(`Decision: ${decision}`);
      console.log(`Adjacent tiles:`, this.adjacentTileMemoryStates.map(t => 
        `(${t.x},${t.y}): pit=${t.hasPit} wump=${t.hasWumpus}`
      ));
      console.log(`Walls:`, Array.from(this.walls));
    }
    
    return decision;
  }
}

export const bazAlpha: Agent = new BazAlpha();
