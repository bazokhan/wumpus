#!/usr/bin/env node

// Simple CLI to run agents via the running Next.js server's tRPC endpoints.
// Requires: `npm run dev` or `npm start` running locally.

const DEFAULT_BASE = process.env.BASE_URL || "http://localhost:3000";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

async function trpcGet(base, proc, input) {
  const url = new URL(`/api/trpc/${proc}`, base);
  if (input !== undefined) {
    url.searchParams.set("input", JSON.stringify(input));
  }
  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error(`${proc} failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function trpcPost(base, proc, input) {
  const url = new URL(`/api/trpc/${proc}`, base);
  url.searchParams.set("input", JSON.stringify(input ?? {}));
  const res = await fetch(url.toString(), { method: "POST" });
  if (!res.ok) throw new Error(`${proc} failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function main() {
  const args = parseArgs(process.argv);
  const base = args["base-url"] || DEFAULT_BASE;

  if (args.list) {
    const agents = await trpcGet(base, "agents.list");
    console.log(JSON.stringify(agents, null, 2));
    return;
  }

  if (args.stats) {
    const agentId = args.agent || undefined;
    const stats = await trpcGet(base, "episodes.stats", { agentId });
    console.log(JSON.stringify(stats, null, 2));
    return;
  }

  // defaults
  const agentId = args.agent || "random";
  const gridSize = parseInt(args["grid-size"] || "4", 10);
  const maxSteps = parseInt(args["max-steps"] || "200", 10);
  const runs = args.runs ? parseInt(args.runs, 10) : undefined;
  const seed = args.seed ? parseInt(args.seed, 10) : undefined;

  if (runs && runs > 1) {
    const out = await trpcPost(base, "episodes.runBatch", {
      agentId,
      gridSize,
      runs,
      maxSteps,
    });
    console.log(JSON.stringify(out, null, 2));
    return;
  } else {
    const out = await trpcPost(base, "episodes.runOne", {
      agentId,
      gridSize,
      maxSteps,
      seed,
    });
    console.log(JSON.stringify(out, null, 2));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
