import { denseSearch } from "./dense";
import { sparseSearch } from "./sparse";
import type { ScoredResult } from "./dense";

const ALPHA = 0.5;
// Wider than the main site's equivalent (20) - this corpus is much larger
// (3406 vs. ~200 chunks) and queries are frequently ambiguous/cross-lingual
// relative to it (see rewriteQuery.ts), so the right chunk is more often
// buried outside a narrow top-N before reranking gets a chance at it.
const TOP_N = 40;

// Dense (cosine, ~0-1) and sparse (BM25, unbounded) scores live on very
// different scales. Min-max normalizing each list per-query before combining
// is necessary for ALPHA to mean anything - without it the combination is
// effectively dominated by whichever score has the larger raw magnitude.
function normalize(results: ScoredResult[]): Map<string, number> {
  const scores = results.map((r) => r.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;

  const normalized = new Map<string, number>();
  for (const { id, score } of results) {
    normalized.set(id, range > 0 ? (score - min) / range : 0);
  }
  return normalized;
}

export interface HybridResult extends ScoredResult {
  denseScore: number;
  sparseScore: number;
}

export async function hybridSearch(query: string): Promise<HybridResult[]> {
  const [denseResults, sparseResults] = await Promise.all([
    denseSearch(query),
    Promise.resolve(sparseSearch(query)),
  ]);

  const denseNorm = normalize(denseResults);
  const sparseNorm = normalize(sparseResults);
  const denseRaw = new Map(denseResults.map((r) => [r.id, r.score]));
  const sparseRaw = new Map(sparseResults.map((r) => [r.id, r.score]));

  const combined: HybridResult[] = denseResults.map(({ id }) => ({
    id,
    score: ALPHA * (denseNorm.get(id) ?? 0) + (1 - ALPHA) * (sparseNorm.get(id) ?? 0),
    denseScore: denseRaw.get(id) ?? 0,
    sparseScore: sparseRaw.get(id) ?? 0,
  }));

  combined.sort((a, b) => b.score - a.score);
  return combined.slice(0, TOP_N);
}
