import chunksData from "@rag_data_almendro/chunks.json";

export interface AlmendroChunk {
  id: string;
  doc_id: string;
  doc_title: string;
  pages: number[];
  heading_path: string[];
  section: string;
  text: string;
  tokens: number;
}

export const CHUNKS: AlmendroChunk[] = chunksData as AlmendroChunk[];

const CHUNK_BY_ID = new Map(CHUNKS.map((chunk) => [chunk.id, chunk]));

export function getChunkById(id: string): AlmendroChunk | undefined {
  return CHUNK_BY_ID.get(id);
}
