import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { startGame, step as stepGame, toggleCellColor } from "@/game/engine";
import { GameStore } from "@/game/store";
import { agents } from "@/agents";
import { Episodes } from "@/server/episodes";
import { simulateBatch, simulateEpisode } from "@/sim/runner";

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
  // --- Agent / Episode APIs ---
  agents: t.router({
    list: t.procedure.query(() => {
      return Object.values(agents).map((a) => ({
        id: a.id,
        name: a.meta.name,
        version: a.meta.version,
        description: a.meta.description ?? "",
      }));
    }),
  }),

  episodes: t.router({
    list: t.procedure
      .input(z.object({ limit: z.number().min(1).max(500).optional(), agentId: z.string().optional() }).optional())
      .query(({ input }) => {
        return Episodes.list({ limit: input?.limit, agentId: input?.agentId });
      }),
    get: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => {
      const ep = Episodes.get(input.id);
      if (!ep) throw new Error("Episode not found");
      return ep;
    }),
    runOne: t.procedure
      .input(
        z.object({
          agentId: z.string(),
          gridSize: z.number().min(2).max(10).default(4),
          seed: z.number().int().nonnegative().optional(),
          maxSteps: z.number().min(1).max(10000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const agent = agents[input.agentId];
        if (!agent) throw new Error("Agent not found");
        const ep = await simulateEpisode({
          agent,
          gridSize: input.gridSize,
          seed: input.seed,
          maxSteps: input.maxSteps,
        });
        Episodes.create(ep);
        return ep;
      }),
    runBatch: t.procedure
      .input(
        z.object({
          agentId: z.string(),
          gridSize: z.number().min(2).max(10).default(4),
          runs: z.number().min(1).max(10000),
          seeds: z.array(z.number().int().nonnegative()).optional(),
          maxSteps: z.number().min(1).max(10000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const agent = agents[input.agentId];
        if (!agent) throw new Error("Agent not found");
        const { episodes, summary } = await simulateBatch({
          agent,
          gridSize: input.gridSize,
          runs: input.runs,
          seeds: input.seeds,
          maxSteps: input.maxSteps,
        });
        Episodes.createMany(episodes);
        return { episodes: episodes.map((e) => ({
          id: e.id,
          agentId: e.agentId,
          gridSize: e.gridSize,
          seed: e.seed,
          engineVersion: e.engineVersion,
          startedAt: e.startedAt,
          finishedAt: e.finishedAt,
          result: e.result,
          totalReward: e.totalReward,
          config: e.config,
        })), summary };
      }),
    stats: t.procedure
      .input(z.object({ agentId: z.string().optional() }).optional())
      .query(({ input }) => {
        return Episodes.stats(input?.agentId ?? undefined);
      }),
  }),

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
