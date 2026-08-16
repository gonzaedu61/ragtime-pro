import { normalizeEmail, readEmailHistory, writeEmailHistory, findEmailHistoryByNameOrCompany } from "@/r2/emailHistory";
import { shouldSummarize, summarizeSession } from "@/rag/summarize";
import type { EmailHistoryData, EmailHistoryMessage } from "@/r2/types";

export interface EmailContext {
  emailKey: string; // normalized - pass straight through to recordEmailTurn
  summary: string;
  history: EmailHistoryMessage[]; // already post-summarization if it was triggered
  fullHistory: EmailHistoryMessage[]; // as-loaded, unsummarized - append-only
  // Informational only (not relied on for the write path - see
  // recordEmailTurn, which re-reads instead of trusting a stale snapshot).
  name?: string;
  company?: string;
  linkedSessionId?: string;
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
    name: existing?.name,
    company: existing?.company,
    linkedSessionId: existing?.linkedSessionId,
  };
}

export async function recordEmailTurn(
  context: EmailContext,
  visitorMessage: string,
  channel: "form" | "email" | "noreply",
  reply: string,
  identity?: { name?: string; company?: string; linkedSessionId?: string }
): Promise<void> {
  const newTurn: EmailHistoryMessage[] = [
    { role: "user", content: visitorMessage, channel },
    { role: "assistant", content: reply },
  ];

  // Re-read rather than trust EmailContext (captured before the LLM call)
  // for fields this function doesn't itself own - name/company/
  // linkedSessionId could have changed since context was loaded. Avoids
  // silently dropping them by only spreading history/summary explicitly.
  const existing = await readEmailHistory(context.emailKey);

  await writeEmailHistory({
    ...existing,
    email: context.emailKey,
    summary: context.summary,
    history: [...context.history, ...newTurn],
    fullHistory: [...context.fullHistory, ...newTurn],
    lastSeen: new Date().toISOString(),
    name: identity?.name ?? existing?.name,
    company: identity?.company ?? existing?.company,
    linkedSessionId: identity?.linkedSessionId ?? existing?.linkedSessionId,
  });
}

// Email is the exact, authoritative key; name/company are a softer
// fallback for when a chat visitor doesn't have (or doesn't want to give)
// their email - see findEmailHistoryByNameOrCompany for the matching rules.
export async function findEmailHistoryByIdentity(identity: {
  email?: string;
  name?: string;
  company?: string;
}): Promise<EmailHistoryData | null> {
  if (identity.email) {
    const byEmail = await readEmailHistory(identity.email);
    if (byEmail) return byEmail;
  }
  if (identity.name || identity.company) {
    return findEmailHistoryByNameOrCompany({ name: identity.name, company: identity.company });
  }
  return null;
}

// A short, deliberately vague topic hint for the "is this you?" confirm
// step - enough to jog a genuine visitor's memory without leaking real
// content to someone who guessed/typo'd their way to a match that isn't
// actually theirs.
export function summarizeTopicHint(record: EmailHistoryData): string {
  const source =
    record.summary || record.history.find((m) => m.role === "user")?.content || "your previous inquiry";
  const words = source.split(/\s+/).slice(0, 15);
  const joined = words.join(" ");
  return joined.length < source.length ? `${joined}...` : joined;
}
