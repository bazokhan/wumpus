# Wumpus Agents & Episodes

This guide explains how to use the Wumpus World agent-training environment: browser UI, server APIs, terminal CLI, replays, persistence, and how to add custom agents.

## Quick Start (Browser)

1. Start the app: `npm run dev` and open http://localhost:3000
2. Choose Enhanced mode.
3. Under "Agent Runner", pick an agent, grid size, and max steps.
4. Click "Run One" or "Run Batch".
5. Use the "Replays" panel to select and play back any episode.

## Running From Terminal (CLI)

The CLI requires the server to be running locally.

```
npm run dev
# in another terminal:
npm run agents:list
npm run agents:stats -- --agent random
npm run agents:run -- --agent greedy --grid-size 4 --max-steps 200 --seed 123
npm run agents:run -- --agent random --grid-size 4 --runs 50 --max-steps 200
```

Flags: `--agent`, `--grid-size`, `--runs`, `--max-steps`, `--seed`, `--base-url`.

## Server API (tRPC)

Endpoints are exposed under `/api/trpc`. Each procedure expects an `input` query param (for GET/POST) with JSON-encoded input and returns a tRPC-wrapped JSON result.

- `agents.list` → list agents
- `episodes.runOne` → run one episode
- `episodes.runBatch` → run multiple episodes
- `episodes.list` → list episodes
- `episodes.get` → get an episode
- `episodes.stats` → aggregated stats

Examples (using curl):

```
curl "http://localhost:3000/api/trpc/agents.list"

curl -X POST "http://localhost:3000/api/trpc/episodes.runOne?input={\"agentId\":\"random\",\"gridSize\":4,\"maxSteps\":200,\"seed\":123}"

curl -X POST "http://localhost:3000/api/trpc/episodes.runBatch?input={\"agentId\":\"random\",\"gridSize\":4,\"runs\":20}"

curl "http://localhost:3000/api/trpc/episodes.list?input={\"limit\":50}"

curl "http://localhost:3000/api/trpc/episodes.get?input={\"id\":\"<EPISODE_ID>\"}"

curl "http://localhost:3000/api/trpc/episodes.stats"
```

## Replays & Persistence

- Episodes store `initialGrid`, `seed`, `engineVersion`, and full history, ensuring stable replays.
- Persist episodes by setting `EPISODES_DIR` when starting the server:

```
EPISODES_DIR=./data/episodes npm run dev
```

## Add Your Own Agent

1. Create `src/agents/MyAgent.ts`:

```ts
import type { Agent } from "@/agents";

export const myAgent: Agent = {
  id: "my-agent",
  meta: { name: "My Agent", version: "1.0.0", description: "Example." },
  async act({ percepts, state, actionsAvailable }) {
    if (percepts.glitter) return "Grab";
    return actionsAvailable.includes("Forward") ? "Forward" : actionsAvailable[0];
  },
};
```

2. Register in `src/agents/index.ts` by adding it to the `agents` map.
3. Reload the app; it will appear in the runner.

### Agent API (Type Reference)

```ts
export interface Agent {
  id: string;
  meta: { name: string; version: string; description?: string };
  reset?: (ctx: { gridSize: number }) => void | Promise<void>;
  act: (input: {
    step: number;
    percepts: Percepts;
    state: AgentState;
    actionsAvailable: Action[]; // ["TurnLeft","TurnRight","Forward","Grab","Shoot"]
  }) => Action | Promise<Action>;
}
```

## Technical Reference

- State types: `src/game/types.ts` — `GameState` includes `seed` and `engineVersion`.
- Engine: `src/game/engine.ts` — `startGame(gridSize, seed?)` and `step`.
- Runner: `src/sim/runner.ts` — `simulateEpisode`, `simulateBatch`.
- Store: `src/server/episodes.ts` — in-memory or file-backed (via `EPISODES_DIR`).
- API: `src/server/trpc.ts` — under `agents` and `episodes` routers.
- UI: `src/components/AgentControls.tsx`, `src/components/ReplayPlayer.tsx`.

## Tips

- Use fixed seeds to compare agents fairly.
- Batch runs provide meaningful aggregate metrics.
- Inspect replays to debug policy decisions.

