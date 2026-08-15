import client from "@/rag/azureClient";
import { hybridSearch } from "@/rag/retrieval/hybrid";
import { rerankCandidates } from "@/rag/retrieval/rerank";
import { buildAnswerMessages } from "@/rag/prompts/answerPrompt";
import { shouldSummarize, summarizeSession } from "@/rag/summarize";
import { getPageContext } from "@/lib/pageDirectory";
import type { SessionData, SessionMessage } from "@/r2/types";

export interface AnswerSource {
  id: string;
  doc_id: string;
  section: string;
}

export interface AnswerResult {
  answer: string;
  sources: AnswerSource[];
  summary: string;
  history: SessionMessage[];
}

export async function generateAnswer(
  query: string,
  session: SessionData,
  pagePath?: string | null
): Promise<AnswerResult> {
  // Turn number is derived from the session as loaded, before any
  // in-request summarization trims it - so the request that triggers
  // summarization still counts correctly for the CTA cadence rule. After
  // that, the stored history is shorter, so cadence effectively restarts
  // per summarization cycle rather than staying exact for the whole
  // session lifetime. A precise version would need a persistent turn
  // counter on SessionData; not worth the schema change for this.
  const turnNumber = session.history.length / 2 + 1;
  const forceCta = turnNumber % 3 === 0;

  let summary = session.summary;
  let history = session.history;

  if (shouldSummarize(session)) {
    const summarized = await summarizeSession(session);
    summary = summarized.summary;
    history = summarized.history;
  }

  const pageContext = getPageContext(pagePath);
  // Bias retrieval toward the current page's topic (e.g. "what's on this
  // page?" has no lexical overlap with the right chunks on its own) without
  // changing the literal query shown to the LLM as the user's turn.
  const retrievalQuery = pageContext
    ? `${query} (current page: ${pageContext.title} - ${pageContext.description})`
    : query;

  const candidates = await hybridSearch(retrievalQuery);
  const reranked = await rerankCandidates(retrievalQuery, candidates);

  const messages = buildAnswerMessages({
    query,
    chunks: reranked,
    summary,
    history,
    forceCta,
    pageContext,
  });

  const response = await client.chat.completions.create({
    model: "o4-mini",
    messages,
  });

  const answer = response.choices[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error("Azure OpenAI returned an empty answer.");
  }

  return {
    answer,
    sources: reranked.map((result) => ({
      id: result.chunk.id,
      doc_id: result.chunk.doc_id,
      section: result.chunk.section,
    })),
    summary,
    history,
  };
}
