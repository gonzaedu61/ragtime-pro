import bm25Data from "@rag_data_almendro/bm25.json";

export interface Bm25Index {
  doc_ids: string[];
  tokenized_docs: string[][];
  idf: Record<string, number>;
  avgdl: number;
}

export const BM25_INDEX: Bm25Index = bm25Data as Bm25Index;

export const DOC_TERM_FREQUENCIES: Map<string, number>[] = BM25_INDEX.tokenized_docs.map((tokens) => {
  const freq = new Map<string, number>();
  for (const term of tokens) {
    freq.set(term, (freq.get(term) ?? 0) + 1);
  }
  return freq;
});

export const DOC_LENGTHS: number[] = BM25_INDEX.tokenized_docs.map((tokens) => tokens.length);
