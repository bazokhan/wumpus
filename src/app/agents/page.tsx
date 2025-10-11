"use client";
import PageLayout from "@/components/PageLayout";

export default function AgentsGuidePage() {
  return (
    <PageLayout>
      <main className="p-4 max-w-4xl mx-auto text-gray-200">
        <h1 className="text-3xl font-bold mb-3">🤖 Wumpus Agents & Episodes Guide</h1>
        <p className="text-gray-300 mb-6">
          Train and test AI agents in the Wumpus World. This guide covers browser usage, server APIs, terminal CLI, replays, persistence, and how to implement your own agents.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Quick Start (Browser)</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Open the home page and choose <span className="font-bold text-white">Enhanced</span> mode.</li>
            <li>Click <span className="font-bold text-white">Start Adventure</span> to create a human-playable game if desired.</li>
            <li>On the right panel, under <span className="font-bold text-white">Agent Runner</span>, pick an agent, grid size, and max steps.</li>
            <li>Click <span className="font-bold text-white">Run One</span> to run a single episode, or <span className="font-bold text-white">Run Batch</span> for many.</li>
            <li>Scroll down to <span className="font-bold text-white">Replays</span>, select an episode, and use Play/Step controls to view it.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Key Concepts</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><span className="text-white font-bold">Agent</span>: Implements a policy via <code>act(...)</code> returning an action.</li>
            <li><span className="text-white font-bold">Episode</span>: A full game from start until win/death/timeout. Episodes are reproducible.</li>
            <li><span className="text-white font-bold">Replays</span>: View any stored episode, step-by-step, independent of current engine code.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Running From Terminal (CLI)</h2>
          <p className="text-gray-300 mb-2">Start the dev server in another terminal:</p>
          <pre className="bg-gray-900 p-3 rounded border border-gray-700 overflow-auto"><code>npm run dev</code></pre>
          <p className="text-gray-300 mt-3 mb-2">Then, list agents, run single or batches:</p>
          <pre className="bg-gray-900 p-3 rounded border border-gray-700 overflow-auto"><code>{`npm run agents:list
npm run agents:stats -- --agent random
npm run agents:run -- --agent greedy --grid-size 4 --max-steps 200 --seed 123
npm run agents:run -- --agent random --grid-size 4 --runs 50 --max-steps 200`}</code></pre>
          <p className="text-gray-400 text-sm mt-2">CLI talks to the running server via tRPC fetch endpoints.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Server API (tRPC)</h2>
          <p className="text-gray-300 mb-2">Endpoints (namespaced under <code>/api/trpc</code>):</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li><code>agents.list</code> → list available agents</li>
            <li><code>episodes.runOne</code> → run one episode</li>
            <li><code>episodes.runBatch</code> → run multiple episodes</li>
            <li><code>episodes.list</code> → list episodes</li>
            <li><code>episodes.get</code> → fetch an episode by id</li>
            <li><code>episodes.stats</code> → aggregate statistics</li>
          </ul>
          <p className="text-gray-400 text-sm mt-2">Raw fetch uses <code>?input=</code> with JSON-encoded input; responses are tRPC-wrapped JSON.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Replays & Persistence</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Replays store <span className="font-bold text-white">initialGrid</span>, <span className="font-bold text-white">seed</span>, <span className="font-bold text-white">engineVersion</span>, and the full history.</li>
            <li>Persist episodes to disk by starting the server with <code>EPISODES_DIR</code>:
              <pre className="bg-gray-900 p-3 rounded border border-gray-700 overflow-auto mt-2"><code>EPISODES_DIR=./data/episodes npm run dev</code></pre>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Add Your Own Agent</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>Create a new file at <code>src/agents/MyAgent.ts</code>:
              <pre className="bg-gray-900 p-3 rounded border border-gray-700 overflow-auto mt-2"><code>{`import type { Agent } from "@/agents";

export const myAgent: Agent = {
  id: "my-agent",
  meta: { name: "My Agent", version: "1.0.0", description: "Example." },
  async act({ percepts, state, actionsAvailable }) {
    // Simple policy: grab if glitter, else move forward.
    if (percepts.glitter) return "Grab";
    return actionsAvailable.includes("Forward") ? "Forward" : actionsAvailable[0];
  },
};`}</code></pre>
            </li>
            <li>Register it in <code>src/agents/index.ts</code> by adding it to the <code>agents</code> map.</li>
            <li>Reload the app; the agent will appear in the runner.</li>
          </ol>

          <p className="text-gray-300 mt-3">Agent API reference:</p>
          <pre className="bg-gray-900 p-3 rounded border border-gray-700 overflow-auto"><code>{`interface Agent {
  id: string;
  meta: { name: string; version: string; description?: string };
  reset?: (ctx: { gridSize: number }) => void | Promise<void>;
  act: (input: {
    step: number;             // 0-based step index (excludes initial Start)
    percepts: Percepts;       // current percepts at agent position
    state: AgentState;        // current agent state (x, y, dir, hasGold, arrow, alive)
    actionsAvailable: Action[]; // ["TurnLeft","TurnRight","Forward","Grab","Shoot"]
  }) => Action | Promise<Action>;
}`}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Technical Reference</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><span className="text-white font-bold">State</span>: see <code>src/game/types.ts</code>. A <code>GameState</code> includes <code>seed</code> and <code>engineVersion</code>.</li>
            <li><span className="text-white font-bold">Runner</span>: <code>src/sim/runner.ts</code> provides <code>simulateEpisode</code> and <code>simulateBatch</code>.</li>
            <li><span className="text-white font-bold">TRPC</span>: procedures in <code>src/server/trpc.ts</code> under <code>agents</code> and <code>episodes</code>.</li>
            <li><span className="text-white font-bold">UI</span>: AgentControls and ReplayPlayer integrated in Enhanced mode.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Use seeds to reproduce environments when comparing agents.</li>
            <li>Batch runs are great for aggregate performance statistics.</li>
            <li>Replays let you visually inspect policy behavior and errors.</li>
          </ul>
        </section>
      </main>
    </PageLayout>
  );
}

