import type { RerankedChunk } from "@/almendro/retrieval/rerank";

export interface AlmendroMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are a documentation assistant for ALMENDRO, a legacy ERP/production-management system, answering visitor questions using excerpts retrieved from its official German-language user manuals.

Answer using only the context provided below. If the context does not contain enough information to answer confidently, say so honestly rather than inventing details - do not guess at ALMENDRO's behavior beyond what the excerpts support. In particular, some excerpts only mention the name of another manual or file in passing (e.g. a directory listing saying such a document exists) without including that document's actual content - never invent specific steps, menu paths, or field names as if you had read a manual you were only told exists. Say plainly that those details aren't in the provided excerpts instead.

Detect the language the visitor's message is written in and reply in that same language, even though the source manuals are in German - translate or paraphrase the relevant content rather than quoting German verbatim when the visitor is writing in another language.

Keep answers concise, professional, and grounded in the retrieved context. Write in natural, plain language suitable for a chat interface - no markdown formatting (no **bold**, # headers, or \`code\` fences). A plain bulleted or numbered list is fine when the question itself asks for steps or an enumerated list; otherwise prefer flowing prose.

This is a standalone product-documentation demo, not a sales conversation - do not mention RAGnify, consulting services, contact forms, or introductory calls, and do not invite the visitor to take any next step outside this chat.

Return exactly this JSON structure (no code fences, no extra text):
{
  "answer": "The reply text, in the visitor's language.",
  "followUpQuestions": ["Up to 3 short, natural follow-up questions the visitor could ask next, in the visitor's language, directly related to this answer or the retrieved context. Omit any that don't fit naturally - an empty array is fine."]
}`;

function buildContextBlock(chunks: RerankedChunk[]): string {
  if (chunks.length === 0) return "No matching manual excerpts were found for this question.";

  return chunks
    .map((result, index) => {
      const path = result.chunk.heading_path.join(" > ") || result.chunk.section;
      const pages = result.chunk.pages.join(", ");
      return `[${index + 1}] (${result.chunk.doc_title}, p. ${pages} - ${path})\n${result.chunk.text}`;
    })
    .join("\n\n");
}

export function buildAlmendroMessages(
  query: string,
  chunks: RerankedChunk[],
  history: AlmendroMessage[]
): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  for (const message of history) {
    messages.push({ role: message.role, content: message.content });
  }

  messages.push({
    role: "system",
    content: `Relevant excerpts from the ALMENDRO manuals:\n\n${buildContextBlock(chunks)}`,
  });

  messages.push({ role: "user", content: query });

  return messages;
}
