import { normalizeEmail, readEmailHistory, writeEmailHistory } from "@/r2/emailHistory";
import { shouldSummarize, summarizeSession } from "@/rag/summarize";
import type { EmailHistoryMessage } from "@/r2/types";

export interface EmailContext {
  emailKey: string; // normalized - pass straight through to recordEmailTurn
  summary: string;
  history: EmailHistoryMessage[]; // already post-summarization if it was triggered
  fullHistory: EmailHistoryMessage[]; // as-loaded, unsummarized - append-only
}

// Mirrors generateAnswer()'s summarize-before-building-the-prompt ordering
// (src/rag/answer.ts) - summarization happens here, once, so the value
// used for *this turn's* prompt and the value written back to R2 afterward
// (via recordEmailTurn) are the same, instead of re-deciding twice.
export async function loadEmailContext(email: string): Promise<EmailContext> {
  const emailKey = normalizeEmail(email);
  const existing = await readEmailHistory(emailKey);

  let summary = existing?.summary ?? "";
  let history = existing?.history ?? [];

  if (shouldSummarize({ summary, history })) {
    const summarized = await summarizeSession({ summary, history });
    summary = summarized.summary;
    history = summarized.history;
  }

  return {
    emailKey,
    summary,
    history,
    fullHistory: existing?.fullHistory ?? [],
  };
}

export async function recordEmailTurn(
  context: EmailContext,
  visitorMessage: string,
  channel: "form" | "email" | "noreply",
  reply: string
): Promise<void> {
  const newTurn: EmailHistoryMessage[] = [
    { role: "user", content: visitorMessage, channel },
    { role: "assistant", content: reply },
  ];

  await writeEmailHistory({
    email: context.emailKey,
    summary: context.summary,
    history: [...context.history, ...newTurn],
    fullHistory: [...context.fullHistory, ...newTurn],
    lastSeen: new Date().toISOString(),
  });
}
