import { embedQuery } from "@/rag/loaders/loadEmbeddingModel";
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
// cosine similarity reduces to a plain dot product. Reuses the site's own
// local embedding model (src/rag/loaders/loadEmbeddingModel.ts) - same
// model, same weights, just applied to this separate ALMENDRO index.
export async function denseSearch(query: string): Promise<ScoredResult[]> {
  const queryEmbedding = Float32Array.from(await embedQuery(query));

  return EMBEDDING_IDS.map((id, index) => ({
    id,
    score: dot(queryEmbedding, EMBEDDING_MATRIX[index]),
  }));
}
