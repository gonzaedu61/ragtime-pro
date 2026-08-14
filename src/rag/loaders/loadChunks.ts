import chunksData from "@rag_data/chunks.json";

export interface Chunk {
  id: string;
  doc_id: string;
  section: string;
  text: string;
  tokens: number;
}

export const CHUNKS: Chunk[] = chunksData as Chunk[];

const CHUNK_BY_ID = new Map(CHUNKS.map((chunk) => [chunk.id, chunk]));

export function getChunkById(id: string): Chunk | undefined {
  return CHUNK_BY_ID.get(id);
}
