import type { SessionMessage } from "@/r2/types";
import type { RerankedChunk } from "@/rag/retrieval/rerank";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Ragtime-Pro's assistant, answering visitor questions about Ragtime-Pro's AI-driven modernization services for legacy software vendors — the Modernization Agent, the Product Modernization Triad (Boost Point, Opportunity, Readiness), AI Upgrade Modules, and EU AI Act compliance.

Answer using only the context provided below. If the context does not contain enough information to answer confidently, say so honestly and suggest the visitor use the contact form or book an intro call — do not invent details, pricing, or commitments.

Keep answers concise, professional, and grounded in the retrieved context. Write in natural, plain language suitable for a chat interface — no markdown formatting (no **bold**, # headers, or \`code\` fences). A plain bulleted or numbered list is fine when the question itself asks for steps, categories, or an enumerated list; otherwise prefer flowing prose.

Only invite the visitor to use the contact form or book an introductory call when their question is itself about next steps, pricing, timelines, implementation phases, or engaging Ragtime-Pro's services. Do not add that invitation to purely informational or definitional questions.`;

const FORCE_CTA_INSTRUCTION =
  "Regardless of this question's topic, end your answer with one brief, natural sentence inviting the visitor to continue via the contact form or an introductory call.";

export function buildAnswerMessages({
  query,
  chunks,
  summary,
  history,
  forceCta = false,
}: {
  query: string;
  chunks: RerankedChunk[];
  summary: string;
  history: SessionMessage[];
  forceCta?: boolean;
}): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  if (summary) {
    messages.push({ role: "system", content: `Conversation summary so far:\n${summary}` });
  }

  for (const message of history) {
    messages.push({ role: message.role, content: message.content });
  }

  if (chunks.length > 0) {
    const context = chunks
      .map((result, index) => `[${index + 1}] (${result.chunk.section})\n${result.chunk.text}`)
      .join("\n\n");
    messages.push({
      role: "system",
      content: `Relevant context from Ragtime-Pro's knowledge base:\n\n${context}`,
    });
  }

  if (forceCta) {
    messages.push({ role: "system", content: FORCE_CTA_INSTRUCTION });
  }

  messages.push({ role: "user", content: query });

  return messages;
}
