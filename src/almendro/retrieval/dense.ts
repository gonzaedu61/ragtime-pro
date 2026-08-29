import { embedQuery } from "@/almendro/loaders/loadEmbeddingModel";
import { EMBEDDING_IDS, EMBEDDING_MATRIX } from "@/almendro/loaders/loadEmbeddings";

export interface ScoredResult {
  id: string;
  score: number;
}

function dot(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

// Both corpus and query embeddings are L2-normalized (normalize: true), so
// cosine similarity reduces to a plain dot product. Uses ALMENDRO's own
// multilingual embedding model (src/almendro/loaders/loadEmbeddingModel.ts),
// not the main site's English-only one - see that file for why.
export async function denseSearch(query: string): Promise<ScoredResult[]> {
  const queryEmbedding = Float32Array.from(await embedQuery(query));

  return EMBEDDING_IDS.map((id, index) => ({
    id,
    score: dot(queryEmbedding, EMBEDDING_MATRIX[index]),
  }));
}
