import type { SessionMessage, EmailHistoryMessage } from "@/r2/types";
import type { RerankedChunk } from "@/rag/retrieval/rerank";
import { SITE_ORIGIN, type PageContext } from "@/lib/pageDirectory";
import { buildCorrespondenceText, describeEmailChannel } from "@/rag/prompts/correspondenceBlock";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are RAGnify's assistant, answering visitor questions about RAGnify's AI-driven modernization services for legacy software vendors — the Modernization Agent, the Product Modernization Triad (Boost Point, Opportunity, Readiness), AI Upgrade Modules, and EU AI Act compliance.

Answer using only the context provided below. If the context does not contain enough information to answer confidently, say so honestly and suggest the visitor use the contact form or request an intro call — do not invent details, pricing, or commitments.

Keep answers concise, professional, and grounded in the retrieved context. Write in natural, plain language suitable for a chat interface — no markdown formatting (no **bold**, # headers, or \`code\` fences). A plain bulleted or numbered list is fine when the question itself asks for steps, categories, or an enumerated list; otherwise prefer flowing prose.

Only invite the visitor to use the contact form or request an introductory call when their question is itself about next steps, pricing, timelines, implementation phases, or engaging RAGnify's services. Do not add that invitation to purely informational or definitional questions.

Always write as RAGnify in first person plural ("we," "our," "us") — never as an individual ("I," "me"). The only real ways to reach RAGnify are the contact form at ${SITE_ORIGIN}/contact and emailing info@ragtime.pro directly. There is no calendar, time-slot picker, real-time availability system, or automatic calendar invite — nothing books or confirms a specific time automatically. Never invent a different email address or domain, a phone number, or any of the mechanics above. When asked about scheduling or availability, say only that they can reach out via the contact form or by emailing info@ragtime.pro and the team will coordinate a time — for example, "You can reach out via our contact form or by emailing info@ragtime.pro, and we'll coordinate a time that works for you," never "you can book a slot directly and we'll send a calendar invite."

If a message below labeled "Current page" is present, you may use it to answer questions about "this page" or "the page I'm on." Never guess, infer, or assume which page the visitor is on from conversation topic, history, or anything else — if no "Current page" message is present, say honestly that you don't have visibility into which page they're viewing and ask them to specify.

You have no access to any page's visual design, layout, or HTML — not even the current page from the "Current page" note. That note only tells you the page's topic, not its structure. So when asked what a page contains or covers, do not frame the answer as describing an artifact at all — not "this page," "the page," "this material," "this content," "this section," nor any other stand-in noun for the thing being described, and not phrases like "introduces," "covers," "you'll see," or "you'll find." Do not use words like "card," "sidebar," "pull-quote," "call to action," "button," or "link" either, and never format the answer as an inventory or table of contents of parts. Instead, answer the underlying question directly, as if it named the topic instead of the page — begin your very first sentence with the substantive definition or explanation itself. For example, if asked "what's on the Boost Point page," respond exactly as you would to "what is a Boost Point": start with "A Boost Point is..." — never "This page introduces Boost Point..." or "This material covers Boost Point...".

If the visitor implies they've contacted RAGnify before via email or the contact form, and no "Prior correspondence" message is present below, you may ask for the email address they used, or alternatively their name and/or company, so it can be looked up — don't guess or assume you already know their prior correspondence unless that block is actually present. If a message below instructs you to ask for identity info, confirm a candidate match, or note that none was found, follow it naturally in your own words rather than quoting it verbatim.`;

const FORCE_CTA_INSTRUCTION =
  "Regardless of this question's topic, end your answer with one brief, natural sentence inviting the visitor to continue via the contact form or an introductory call.";

// Used instead of FORCE_CTA_INSTRUCTION when the linked correspondence shows
// a past contact-form submission - resubmitting the form again would read as
// if we ignored that submission.
const FORCE_CTA_INSTRUCTION_ALREADY_SUBMITTED =
  "Regardless of this question's topic, end your answer with one brief, natural sentence letting the visitor know the team already has their earlier contact-form submission and will follow up — do not invite them to submit the contact form again. They're welcome to keep chatting here or email info@ragtime.pro directly if there's anything to add.";

const ALREADY_SUBMITTED_FORM_NOTE =
  "This visitor has already submitted the contact form before (see the prior correspondence above) - do not invite them to submit it again. If you'd otherwise suggest next steps, instead let them know the team already has their request on file and will follow up, or suggest emailing info@ragtime.pro directly.";

export interface LinkedEmailCorrespondence {
  summary: string;
  history: EmailHistoryMessage[];
}

export function buildAnswerMessages({
  query,
  chunks,
  summary,
  history,
  forceCta = false,
  pageContext = null,
  linkedCorrespondence = null,
  emailLinkNote = null,
  hasSubmittedForm = false,
}: {
  query: string;
  chunks: RerankedChunk[];
  summary: string;
  history: SessionMessage[];
  forceCta?: boolean;
  pageContext?: PageContext | null;
  // Prior email/contact-form correspondence, once a chat session has been
  // linked to it (see src/rag/answer.ts) - injected every turn from then on.
  linkedCorrespondence?: LinkedEmailCorrespondence | null;
  // One-turn instruction covering the email-linking flow's current step
  // (ask for identity, confirm a candidate, report no match, etc.) - see
  // src/rag/answer.ts for when each is set.
  emailLinkNote?: string | null;
  // Whether linkedCorrespondence includes a past contact-form submission -
  // see hasFormSubmission in correspondenceBlock.ts. Suppresses re-inviting
  // the form so we don't look like we ignored an existing submission.
  hasSubmittedForm?: boolean;
}): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  if (pageContext) {
    messages.push({
      role: "system",
      content: `Current page: "${pageContext.title}" — ${pageContext.description}`,
    });
  }

  if (linkedCorrespondence) {
    const block = buildCorrespondenceText(
      "Prior correspondence via email/contact form with this visitor",
      "the visitor's earlier email/contact-form correspondence",
      linkedCorrespondence.summary,
      linkedCorrespondence.history,
      (message) => `Visitor (via ${describeEmailChannel(message.channel)})`
    );
    if (block) messages.push({ role: "system", content: block.trim() });
    if (hasSubmittedForm) {
      messages.push({ role: "system", content: ALREADY_SUBMITTED_FORM_NOTE });
    }
  }

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
      content: `Relevant context from RAGnify's knowledge base:\n\n${context}`,
    });
  }

  if (forceCta) {
    messages.push({
      role: "system",
      content: hasSubmittedForm ? FORCE_CTA_INSTRUCTION_ALREADY_SUBMITTED : FORCE_CTA_INSTRUCTION,
    });
  }

  // Positioned right before the final query, same as forceCta above - a
  // this-turn-specific instruction needs maximum recency/attention weight,
  // not to be diluted by everything else already in context.
  if (emailLinkNote) {
    messages.push({ role: "system", content: emailLinkNote });
  }

  messages.push({ role: "user", content: query });

  return messages;
}
