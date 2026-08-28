import embeddingsData from "@rag_data_almendro/embeddings.json";

interface EmbeddingRecord {
  id: string;
  embedding: number[];
}

const records = embeddingsData as EmbeddingRecord[];

export const EMBEDDING_IDS: string[] = records.map((record) => record.id);
export const EMBEDDING_MATRIX: Float32Array[] = records.map((record) => Float32Array.from(record.embedding));
