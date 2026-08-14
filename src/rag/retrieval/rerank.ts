import { scorePassages } from "@/rag/loaders/loadCrossEncoder";
import { getChunkById } from "@/rag/loaders/loadChunks";
import type { Chunk } from "@/rag/loaders/loadChunks";
import type { HybridResult } from "./hybrid";

const TOP_K = 10;

export interface RerankedChunk {
  chunk: Chunk;
  hybridScore: number;
  rerankScore: number;
}

export async function rerankCandidates(
  query: string,
  candidates: HybridResult[]
): Promise<RerankedChunk[]> {
  const entries = candidates
    .map((candidate) => ({ candidate, chunk: getChunkById(candidate.id) }))
    .filter((entry): entry is { candidate: HybridResult; chunk: Chunk } => !!entry.chunk);

  if (entries.length === 0) return [];

  const scores = await scorePassages(
    query,
    entries.map((entry) => entry.chunk.text)
  );

  const reranked: RerankedChunk[] = entries.map((entry, index) => ({
    chunk: entry.chunk,
    hybridScore: entry.candidate.score,
    rerankScore: scores[index],
  }));

  reranked.sort((a, b) => b.rerankScore - a.rerankScore);
  return reranked.slice(0, TOP_K);
}
