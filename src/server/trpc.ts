import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { startGame, step as stepGame, toggleCellColor } from "@/game/engine";
import { GameStore } from "@/game/store";

const t = initTRPC.create();

const startGameInputSchema = z
  .object({ gridSize: z.number().min(2).max(10).default(4) })
  .optional();

const stepGameInputSchema = z.object({
  gameId: z.string(),
  action: z.enum(["TurnLeft", "TurnRight", "Forward", "Grab", "Shoot", "Start"]),
});

const getStateInputSchema = z.object({ gameId: z.string() });
const getHistoryInputSchema = z.object({ gameId: z.string() });

const toggleCellColorInputSchema = z.object({
  gameId: z.string(),
  x: z.number().min(0),
  y: z.number().min(0),
});

export const appRouter = t.router({
  startGame: t.procedure.input(startGameInputSchema).mutation(({ input }) => {
    const gs = startGame(input?.gridSize ?? 4);
    GameStore.create(gs);
    // return state without hidden hazards if you want “fog of war”
    return { gameId: gs.gameId, state: gs };
  }),

  step: t.procedure.input(stepGameInputSchema).mutation(({ input }) => {
    const gs = GameStore.get(input.gameId);
    if (!gs) throw new Error("Game not found");
    const updated = stepGame(gs, input.action);
    GameStore.update(input.gameId, updated);
    return { state: updated };
  }),

  getState: t.procedure.input(getStateInputSchema).query(({ input }) => {
    const gs = GameStore.get(input.gameId);
    if (!gs) throw new Error("Game not found");
    return { state: gs };
  }),

  getHistory: t.procedure.input(getHistoryInputSchema).query(({ input }) => {
    const gs = GameStore.get(input.gameId);
    if (!gs) throw new Error("Game not found");
    return { history: gs.history };
  }),

  toggleCellColor: t.procedure.input(toggleCellColorInputSchema).mutation(({ input }) => {
    const gs = GameStore.get(input.gameId);
    if (!gs) throw new Error("Game not found");
    const updated = toggleCellColor(gs, input.x, input.y);
    GameStore.update(input.gameId, updated);
    return { state: updated };
  }),
});

export type AppRouter = typeof appRouter;
