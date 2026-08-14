import { AzureOpenAI } from "openai/azure";
import { hybridSearch } from "@/rag/retrieval/hybrid";
import { rerankCandidates } from "@/rag/retrieval/rerank";
import { buildAnswerMessages } from "@/rag/prompts/answerPrompt";
import type { SessionData } from "@/r2/types";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_AI_PROJECT_API_KEY,
  apiVersion: "2024-12-01-preview",
  deployment: "o4-mini",
  timeout: 25000,
});

export interface AnswerSource {
  id: string;
  doc_id: string;
  section: string;
}

export interface AnswerResult {
  answer: string;
  sources: AnswerSource[];
}

export async function generateAnswer(query: string, session: SessionData): Promise<AnswerResult> {
  const candidates = await hybridSearch(query);
  const reranked = await rerankCandidates(query, candidates);

  // history is stored as user/assistant pairs; this is the Nth user question
  // in the session, counting the one being answered right now.
  const turnNumber = session.history.length / 2 + 1;
  const forceCta = turnNumber % 3 === 0;

  const messages = buildAnswerMessages({
    query,
    chunks: reranked,
    summary: session.summary,
    history: session.history,
    forceCta,
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
  };
}
