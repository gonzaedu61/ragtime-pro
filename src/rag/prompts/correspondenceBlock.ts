import type { SessionMessage, EmailHistoryMessage } from "@/r2/types";

// Shared by the chat prompt (injecting prior email/form correspondence)
// and the email-reply prompt (injecting prior chat correspondence, or its
// own prior email correspondence) - same rendering, different labels and
// per-turn descriptions depending on what kind of history is being shown.
export function buildCorrespondenceText<M extends SessionMessage>(
  blockLabel: string,
  summaryLabel: string,
  summary: string,
  history: M[],
  describeUserTurn: (message: M) => string
): string {
  if (!summary && history.length === 0) return "";

  const summaryPart = summary ? `Summary of ${summaryLabel}:\n${summary}` : "";

  const recentPart =
    history.length > 0
      ? history
          .map((message) =>
            message.role === "user"
              ? `${describeUserTurn(message)}: ${message.content}`
              : `Our reply: ${message.content}`
          )
          .join("\n\n")
      : "";

  const combined = [summaryPart, recentPart].filter(Boolean).join("\n\n");
  return `\n\n${blockLabel} (use this for continuity - reference it naturally if relevant, don't just repeat it):\n\n${combined}`;
}

export function describeEmailChannel(channel: EmailHistoryMessage["channel"]): string {
  if (channel === "email") return "direct email";
  if (channel === "noreply") return "an email to noreply@ragnify.pro";
  return "contact form";
}

// Checked against the *full*, never-trimmed history (not the
// summarization-trimmed `history` field) so a form submission from long ago
// is never missed just because it since scrolled into the summary text.
export function hasFormSubmission(fullHistory: EmailHistoryMessage[]): boolean {
  return fullHistory.some((message) => message.role === "user" && message.channel === "form");
}
