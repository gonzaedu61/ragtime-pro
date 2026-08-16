import { encode } from "gpt-tokenizer";
import client from "@/rag/azureClient";
import { buildSummaryMessages } from "@/rag/prompts/summaryPrompt";
import type { SessionMessage } from "@/r2/types";

const MAX_HISTORY_LENGTH = 20;
const MAX_HISTORY_TOKENS = 1500;
const RETAINED_MESSAGES = 4;

// Generic over the message type (M) so this works for both chat's
// SessionMessage[] and email's EmailHistoryMessage[] without duplicating
// the logic - callers only need to structurally provide {summary, history}.
interface Summarizable<M extends SessionMessage> {
  summary: string;
  history: M[];
}

function countHistoryTokens(history: SessionMessage[]): number {
  return history.reduce((sum, message) => sum + encode(message.content).length, 0);
}

export function shouldSummarize<M extends SessionMessage>(target: Summarizable<M>): boolean {
  return target.history.length > MAX_HISTORY_LENGTH || countHistoryTokens(target.history) > MAX_HISTORY_TOKENS;
}

export interface SummarizeResult<M extends SessionMessage> {
  summary: string;
  history: M[];
}

export async function summarizeSession<M extends SessionMessage>(
  target: Summarizable<M>
): Promise<SummarizeResult<M>> {
  try {
    const messages = buildSummaryMessages({
      existingSummary: target.summary,
      history: target.history,
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
      history: target.history.slice(-RETAINED_MESSAGES),
    };
  } catch (error) {
    // Per spec §6.8: keep the existing summary, just truncate history, and
    // don't let a summarization failure block the actual answer generation.
    console.error("Summarization error:", error);
    return {
      summary: target.summary,
      history: target.history.slice(-RETAINED_MESSAGES),
    };
  }
}
