import { tokenize } from "@/rag/utils/tokenize";
import { BM25_INDEX, DOC_TERM_FREQUENCIES, DOC_LENGTHS } from "@/rag/loaders/loadBM25";
import type { ScoredResult } from "./dense";

// Okapi BM25 defaults, matching Python rank_bm25's BM25Okapi.
const K1 = 1.5;
const B = 0.75;

export function sparseSearch(query: string): ScoredResult[] {
  const queryTerms = tokenize(query);
  const { doc_ids: docIds, idf, avgdl } = BM25_INDEX;

  return docIds.map((id, index) => {
    const termFreq = DOC_TERM_FREQUENCIES[index];
    const docLength = DOC_LENGTHS[index];

    let score = 0;
    for (const term of queryTerms) {
      const freq = termFreq.get(term);
      if (!freq) continue;
      const termIdf = idf[term] ?? 0;
      score += (termIdf * (freq * (K1 + 1))) / (freq + K1 * (1 - B + (B * docLength) / avgdl));
    }

    return { id, score };
  });
}
