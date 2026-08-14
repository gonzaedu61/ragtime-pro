import { encode } from "gpt-tokenizer";
import client from "@/rag/azureClient";
import { buildSummaryMessages } from "@/rag/prompts/summaryPrompt";
import type { SessionData, SessionMessage } from "@/r2/types";

const MAX_HISTORY_LENGTH = 20;
const MAX_HISTORY_TOKENS = 1500;
const RETAINED_MESSAGES = 4;

function countHistoryTokens(history: SessionMessage[]): number {
  return history.reduce((sum, message) => sum + encode(message.content).length, 0);
}

export function shouldSummarize(session: SessionData): boolean {
  return session.history.length > MAX_HISTORY_LENGTH || countHistoryTokens(session.history) > MAX_HISTORY_TOKENS;
}

export interface SummarizeResult {
  summary: string;
  history: SessionMessage[];
}

export async function summarizeSession(session: SessionData): Promise<SummarizeResult> {
  try {
    const messages = buildSummaryMessages({
      existingSummary: session.summary,
      history: session.history,
    });

    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages,
    });

    const summary = response.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error("Azure OpenAI returned an empty summary.");
    }

    return {
      summary,
      history: session.history.slice(-RETAINED_MESSAGES),
    };
  } catch (error) {
    // Per spec §6.8: keep the existing summary, just truncate history, and
    // don't let a summarization failure block the actual answer generation.
    console.error("Summarization error:", error);
    return {
      summary: session.summary,
      history: session.history.slice(-RETAINED_MESSAGES),
    };
  }
}
