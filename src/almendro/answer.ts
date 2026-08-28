import client from "@/rag/azureClient";
import { hybridSearch } from "@/almendro/retrieval/hybrid";
import { rerankCandidates, type RerankedChunk } from "@/almendro/retrieval/rerank";
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
  followUpQuestions: string[];
}

interface ParsedReply {
  answer: string;
  followUpQuestions: string[];
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
      followUpQuestions: Array.isArray(parsed.followUpQuestions)
        ? parsed.followUpQuestions.filter((q: unknown): q is string => typeof q === "string" && q.trim().length > 0)
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

export async function generateAlmendroAnswer(
  query: string,
  history: AlmendroMessage[]
): Promise<AlmendroAnswerResult> {
  const candidates = await hybridSearch(query);
  const reranked = await rerankCandidates(query, candidates);

  const messages = buildAlmendroMessages(query, reranked, history);

  const response = await client.chat.completions.create({
    model: "o4-mini",
    messages,
  });

  const raw = response.choices[0]?.message?.content;
  const parsed = raw ? parseReply(raw) : null;

  if (!parsed) {
    throw new Error("ALMENDRO answer generation returned an unusable response.");
  }

  return {
    answer: parsed.answer,
    sources: buildSources(reranked),
    followUpQuestions: parsed.followUpQuestions.slice(0, 3),
  };
}
