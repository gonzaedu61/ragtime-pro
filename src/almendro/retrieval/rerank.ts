import { getChunkById } from "@/almendro/loaders/loadChunks";
import type { AlmendroChunk } from "@/almendro/loaders/loadChunks";
import type { HybridResult } from "./hybrid";

const TOP_K = 20;

export interface RerankedChunk {
  chunk: AlmendroChunk;
  hybridScore: number;
  rerankScore: number;
}

// The cross-encoder used on the main site (Xenova/ms-marco-MiniLM-L-6-v2) is
// English-trained and was measured to have no useful signal on this
// German-only corpus: on a controlled test query, it produced uniformly
// deeply negative, barely-differentiated scores (-9.9 to -10.5) across the
// entire candidate pool, and in doing so it DISCARDED the one genuinely
// relevant chunk (auf-pos.pdf, ranked #19 of 164 by hybrid score) in favor
// of thematically unrelated noise (inventory reports, cost-center planning)
// that happened to score marginally less negative. The hybrid score alone
// - already tuned dense+BM25 combination - ranked that same chunk far more
// sensibly. Rather than risk an unreliable model actively removing good
// candidates, trust the hybrid ranking directly for this corpus and widen
// TOP_K accordingly to still surface enough of the pool.
export async function rerankCandidates(
  _query: string,
  candidates: HybridResult[]
): Promise<RerankedChunk[]> {
  const entries = candidates
    .map((candidate) => ({ candidate, chunk: getChunkById(candidate.id) }))
    .filter((entry): entry is { candidate: HybridResult; chunk: AlmendroChunk } => !!entry.chunk);

  return entries.slice(0, TOP_K).map((entry) => ({
    chunk: entry.chunk,
    hybridScore: entry.candidate.score,
    rerankScore: entry.candidate.score,
  }));
}
