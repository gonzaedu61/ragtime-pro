import type { SessionMessage } from "@/r2/types";
import type { ChatMessage } from "./answerPrompt";

const SYSTEM_PROMPT = `You are a conversation summarization model. Your task is to compress the conversation into a concise, factual summary that preserves the user's goals, context, and constraints. Do not include irrelevant small talk. Do not invent details. Capture only what is necessary for future turns.`;

function formatHistory(history: SessionMessage[]): string {
  return history.map((message) => `${message.role}: ${message.content}`).join("\n");
}

export function buildSummaryMessages({
  existingSummary,
  history,
}: {
  existingSummary: string;
  history: SessionMessage[];
}): ChatMessage[] {
  const previousSummarySection = existingSummary ? `Previous summary:\n${existingSummary}\n\n` : "";

  const userPrompt = `Summarize the following conversation so it can be used as context in future turns.

${previousSummarySection}Conversation:
${formatHistory(history)}

Requirements:
- Preserve user goals and constraints.
- Preserve assistant commitments.
- Preserve important facts.
- Remove irrelevant details.
- Keep the summary under 250 tokens.
- Output only the summary text.`;

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];
}
