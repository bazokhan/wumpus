import type { Episode, EpisodeMeta, BatchSummary } from "@/sim/types";
import fs from "fs";
import path from "path";

export interface EpisodeStore {
  list(opts?: { limit?: number; agentId?: string }): EpisodeMeta[];
  get(id: string): Episode | null;
  create(ep: Episode): Episode;
  createMany(eps: Episode[]): Episode[];
  stats(agentId?: string): BatchSummary | null;
}

class InMemoryEpisodeStore implements EpisodeStore {
  private episodes = new Map<string, Episode>();

  list(opts?: { limit?: number; agentId?: string }): EpisodeMeta[] {
    const all = Array.from(this.episodes.values())
      .filter((e) => (opts?.agentId ? e.agentId === opts.agentId : true))
      .sort((a, b) => b.startedAt - a.startedAt)
      .map((e) => ({
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
      }));
    return typeof opts?.limit === "number" ? all.slice(0, opts.limit) : all;
  }

  get(id: string): Episode | null {
    return this.episodes.get(id) ?? null;
  }

  create(ep: Episode): Episode {
    this.episodes.set(ep.id, ep);
    return ep;
  }

  createMany(eps: Episode[]): Episode[] {
    for (const ep of eps) this.episodes.set(ep.id, ep);
    return eps;
  }

  stats(agentId?: string): BatchSummary | null {
    const eps = Array.from(this.episodes.values()).filter((e) =>
      agentId ? e.agentId === agentId : true
    );
    if (eps.length === 0) return null;
    let wins = 0,
      deaths = 0,
      timeouts = 0,
      totalReward = 0,
      totalSteps = 0;
    for (const e of eps) {
      if (e.result === "win") wins++;
      else if (e.result === "death") deaths++;
      else timeouts++;
      totalReward += e.totalReward;
      totalSteps += Math.max(0, e.steps.length - 1);
    }
    return {
      agentId: agentId ?? "(all)",
      runs: eps.length,
      wins,
      deaths,
      timeouts,
      avgReward: totalReward / eps.length,
      avgSteps: totalSteps / eps.length,
    };
  }
}

// Optional: file-backed store if EPISODES_DIR is provided
const episodesDir = process.env.EPISODES_DIR;
class FileEpisodeStore implements EpisodeStore {
    private dir: string;

    constructor(dir: string) {
      this.dir = dir;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    private filePath(id: string) {
      return path.join(this.dir, `${id}.json`);
    }

    list(opts?: { limit?: number; agentId?: string }): EpisodeMeta[] {
      const files = fs.readdirSync(this.dir).filter((f) => f.endsWith(".json"));
      const metas: EpisodeMeta[] = files
        .map((f) => {
          try {
            const raw = fs.readFileSync(path.join(this.dir, f), "utf8");
            const ep = JSON.parse(raw) as Episode;
            return {
              id: ep.id,
              agentId: ep.agentId,
              gridSize: ep.gridSize,
              seed: ep.seed,
              engineVersion: ep.engineVersion,
              startedAt: ep.startedAt,
              finishedAt: ep.finishedAt,
              result: ep.result,
              totalReward: ep.totalReward,
              config: ep.config,
            } as EpisodeMeta;
          } catch {
            return null;
          }
        })
        .filter((x): x is EpisodeMeta => !!x)
        .filter((e) => (opts?.agentId ? e.agentId === opts.agentId : true))
        .sort((a, b) => b.startedAt - a.startedAt);
      return typeof opts?.limit === "number" ? metas.slice(0, opts.limit) : metas;
    }

    get(id: string): Episode | null {
      const fp = this.filePath(id);
      if (!fs.existsSync(fp)) return null;
      try {
        const raw = fs.readFileSync(fp, "utf8");
        return JSON.parse(raw) as Episode;
      } catch {
        return null;
      }
    }

    create(ep: Episode): Episode {
      fs.writeFileSync(this.filePath(ep.id), JSON.stringify(ep, null, 2), "utf8");
      return ep;
    }

    createMany(eps: Episode[]): Episode[] {
      for (const ep of eps) this.create(ep);
      return eps;
    }

    stats(agentId?: string): BatchSummary | null {
      const metas = this.list({ agentId });
      if (metas.length === 0) return null;
      let wins = 0,
        deaths = 0,
        timeouts = 0,
        totalReward = 0,
        totalSteps = 0;
      for (const m of metas) {
        const ep = this.get(m.id);
        if (!ep) continue;
        if (ep.result === "win") wins++;
        else if (ep.result === "death") deaths++;
        else timeouts++;
        totalReward += ep.totalReward;
        totalSteps += Math.max(0, ep.steps.length - 1);
      }
      return {
        agentId: agentId ?? "(all)",
        runs: metas.length,
        wins,
        deaths,
        timeouts,
        avgReward: totalReward / metas.length,
        avgSteps: totalSteps / metas.length,
      };
    }
}

function createStore(): EpisodeStore {
  if (episodesDir) {
    return new FileEpisodeStore(episodesDir);
  }
  return new InMemoryEpisodeStore();
}

export const Episodes: EpisodeStore = createStore();
