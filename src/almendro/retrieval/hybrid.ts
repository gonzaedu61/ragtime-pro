import { denseSearch } from "./dense";
import { sparseSearch } from "./sparse";
import { getChunkById } from "@/almendro/loaders/loadChunks";
import type { ScoredResult } from "./dense";

const ALPHA = 0.5;

// ws_info.pdf is itself a one-line-per-manual directory ("Dateiname X.pdf
// Beschreibung Y") - see buildManualDirectory.ts, which parses these same
// lines into manualDirectory.json for query expansion. As retrieval
// candidates they're actively harmful: a 9-token chunk that triple-repeats
// a manual's short description (in doc heading, section heading, and body)
// scores higher than genuine, longer procedural content for any query that
// closely matches that description - measured directly, this chunk was
// landing at rank #1 ahead of the manuals that actually document the
// visitor's question, crowding out the one real answer. They carry zero
// procedural information the visitor could act on, so they're filtered out
// here rather than indexed away (only 49 of 3406 chunks, GDPR-fine to leave
// in the corpus, just excluded from ever candidating for context).
const DIRECTORY_ENTRY_PATTERN = /^Dateiname\s+\S+\.pdf\s+Beschreibung\s+/;

function isDirectoryListingChunk(id: string): boolean {
  const chunk = getChunkById(id);
  return !!chunk && chunk.doc_id === "ws-info" && DIRECTORY_ENTRY_PATTERN.test(chunk.text);
}
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

  const combined: HybridResult[] = denseResults
    .filter(({ id }) => !isDirectoryListingChunk(id))
    .map(({ id }) => ({
      id,
      score: ALPHA * (denseNorm.get(id) ?? 0) + (1 - ALPHA) * (sparseNorm.get(id) ?? 0),
      denseScore: denseRaw.get(id) ?? 0,
      sparseScore: sparseRaw.get(id) ?? 0,
    }));

  combined.sort((a, b) => b.score - a.score);
  return combined.slice(0, TOP_N);
}
