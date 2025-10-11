import type { GameState } from "./types";

const games = new Map<string, GameState>();

export const GameStore = {
  create(gs: GameState) {
    games.set(gs.gameId, gs);
    return gs;
  },
  get(id: string) {
    return games.get(id) ?? null;
  },
  update(id: string, gs: GameState) {
    games.set(id, gs);
    return gs;
  },
};
