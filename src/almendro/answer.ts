import client from "@/rag/azureClient";
import { hybridSearch, type HybridResult } from "@/almendro/retrieval/hybrid";
import { rerankCandidates, type RerankedChunk } from "@/almendro/retrieval/rerank";
import { expandQueryForRetrieval } from "@/almendro/retrieval/rewriteQuery";
import { buildAlmendroMessages, type AlmendroMessage } from "@/almendro/prompts/answerPrompt";

const MAX_SOURCES = 3;

export interface AlmendroSource {
  doc_id: string;
  doc_title: string;
  pages: number[];
  heading_path: string[];
  href: string;
}

export interface AlmendroAnswerResult {
  answer: string;
  sources: AlmendroSource[];
  followUpTopics: string[];
}

interface ParsedReply {
  answer: string;
  followUpTopics: string[];
}

function parseReply(raw: string): ParsedReply | null {
  try {
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    if (typeof parsed.answer !== "string" || !parsed.answer.trim()) return null;

    return {
      answer: parsed.answer,
      followUpTopics: Array.isArray(parsed.followUpTopics)
        ? parsed.followUpTopics.filter((q: unknown): q is string => typeof q === "string" && q.trim().length > 0)
        : [],
    };
  } catch {
    return null;
  }
}

// Built directly from the reranked chunks rather than asking the model to
// cite its sources - the model can't be trusted to accurately report which
// excerpts it actually used, but the reranked list already IS that answer.
// Takes the top-ranked chunk per distinct document, in rank order.
function buildSources(chunks: RerankedChunk[]): AlmendroSource[] {
  const seenDocs = new Set<string>();
  const sources: AlmendroSource[] = [];

  for (const { chunk } of chunks) {
    if (seenDocs.has(chunk.doc_id)) continue;
    seenDocs.add(chunk.doc_id);

    sources.push({
      doc_id: chunk.doc_id,
      doc_title: chunk.doc_title,
      pages: chunk.pages,
      heading_path: chunk.heading_path,
      href: `/almendro-manuals/${chunk.doc_id}.pdf#page=${chunk.pages[0] ?? 1}`,
    });

    if (sources.length >= MAX_SOURCES) break;
  }

  return sources;
}

// Keeps the best score seen for each chunk id across every query variant's
// search, rather than concatenating - the same chunk can plausibly surface
// under more than one variant, and de-duplicating (instead of reranking it
// twice) keeps the candidate set focused.
function mergeCandidates(resultSets: HybridResult[][]): HybridResult[] {
  const byId = new Map<string, HybridResult>();
  for (const results of resultSets) {
    for (const result of results) {
      const existing = byId.get(result.id);
      if (!existing || result.score > existing.score) byId.set(result.id, result);
    }
  }
  return [...byId.values()].sort((a, b) => b.score - a.score);
}

export async function generateAlmendroAnswer(
  query: string,
  history: AlmendroMessage[]
): Promise<AlmendroAnswerResult> {
  // The corpus is entirely German with its own narrow terminology (see
  // rewriteQuery.ts) - retrieving on the visitor's literal wording alone
  // misses badly whenever it doesn't happen to match that vocabulary,
  // regardless of language, and a single "best guess" reformulation isn't
  // reliable enough either (measured directly: one rewrite confidently
  // picked a term that's essentially absent from the corpus). Several
  // different guesses are generated instead and all searched - only one of
  // them needs to land on the right vocabulary. Expansion runs concurrently
  // with the original-query search since it doesn't depend on it.
  const [originalCandidates, queryVariants] = await Promise.all([hybridSearch(query), expandQueryForRetrieval(query)]);
  const variantResultSets = await Promise.all(
    queryVariants.filter((variant) => variant !== query).map((variant) => hybridSearch(variant))
  );
  const candidates = mergeCandidates([originalCandidates, ...variantResultSets]);

  // Reranks against the original query - it's the most faithful statement of
  // what the visitor actually wants, and the cross-encoder only needs to
  // judge relevance among the now much-improved-recall candidate pool above,
  // not guess the right vocabulary itself.
  const reranked = await rerankCandidates(query, candidates);

  const messages = buildAlmendroMessages(query, reranked, history);

  // o4-mini occasionally dropped the JSON envelope entirely and wrote plain
  // prose instead - reproduced directly, and more likely on "decline and ask
  // a clarifying question" replies. response_format enforces valid JSON at
  // the API level (verified: 3/3 on the exact failing case), so the
  // remaining retry is just a safety net for other transient failures, not
  // the primary fix.
  let parsed: ParsedReply | null = null;
  for (let attempt = 0; attempt < 2 && !parsed; attempt++) {
    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages,
      response_format: { type: "json_object" },
    });
    const raw = response.choices[0]?.message?.content;
    parsed = raw ? parseReply(raw) : null;
  }

  if (!parsed) {
    throw new Error("ALMENDRO answer generation returned an unusable response.");
  }

  return {
    answer: parsed.answer,
    sources: buildSources(reranked),
    followUpTopics: parsed.followUpTopics.slice(0, 3),
  };
}
