import { AzureOpenAI } from "openai/azure";
import { hybridSearch } from "@/rag/retrieval/hybrid";
import { rerankCandidates, type RerankedChunk } from "@/rag/retrieval/rerank";
import { getAllPages, SITE_ORIGIN } from "@/lib/pageDirectory";
import type { EmailHistoryMessage } from "@/r2/types";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_AI_PROJECT_API_KEY,
  apiVersion: "2024-12-01-preview",
  deployment: "o4-mini",
  timeout: 25000,
});

interface ContactFields {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  aiInterest?: string;
  message: string;
  // "form" (contact form: the visitor already gave their details expecting
  // to be contacted) vs "email" (wrote directly to info@ragtime.pro: no
  // structured lead capture happened, so the reply invites booking a call).
  channel: "form" | "email";
}

interface AiReply {
  text: string;
  subject: string;
}

export interface EmailCorrespondence {
  summary: string;
  history: EmailHistoryMessage[];
}

const FALLBACK_SUBJECT = "We've received your message — Ragtime-Pro";

const CHANNEL_CLOSING_RULE: Record<ContactFields["channel"], string> = {
  form: 'End by letting them know the team will follow up with them directly soon, using the contact details they provided — do not ask them to book a call themselves, since submitting the form already means we\'ll reach out.',
  email: `End by inviting them to get in touch via the contact form at ${SITE_ORIGIN}/contact to arrange an introductory call, since they reached out directly by email rather than through the form. Do not say "book" or imply the form schedules a specific time automatically.`,
};

function buildContextBlock(chunks: RerankedChunk[]): string {
  if (chunks.length === 0) return "";
  const context = chunks
    .map((result, index) => `[${index + 1}] (${result.chunk.section})\n${result.chunk.text}`)
    .join("\n\n");
  return `\n\nRelevant context from Ragtime-Pro's knowledge base (use this to answer their question as concretely and accurately as you can):\n\n${context}`;
}

function buildPagesBlock(): string {
  const pages = getAllPages()
    .map((page) => `- ${SITE_ORIGIN}${page.path} — ${page.title}: ${page.description}`)
    .join("\n");
  return `\n\nWebsite pages (only mention one if it's a clear, specific match for what the visitor is asking about — do not force a link if none genuinely fits):\n${pages}`;
}

function describeChannel(channel: EmailHistoryMessage["channel"]): string {
  if (channel === "email") return "direct email";
  if (channel === "noreply") return "an email to noreply@ragtime.pro";
  return "contact form";
}

function buildCorrespondenceBlock({ summary, history }: EmailCorrespondence): string {
  if (!summary && history.length === 0) return "";

  const summaryPart = summary ? `Summary of earlier correspondence with this visitor:\n${summary}` : "";

  const recentPart =
    history.length > 0
      ? history
          .map((message) =>
            message.role === "user"
              ? `Visitor (via ${describeChannel(message.channel)}): ${message.content}`
              : `Our reply: ${message.content}`
          )
          .join("\n\n")
      : "";

  const combined = [summaryPart, recentPart].filter(Boolean).join("\n\n");
  return `\n\nPrior correspondence with this visitor (use this for continuity - reference it naturally if relevant, don't just repeat it):\n\n${combined}`;
}

function buildPrompt(
  { name, company, email, phone, aiInterest, message, channel }: ContactFields,
  chunks: RerankedChunk[],
  correspondence: EmailCorrespondence
): string {
  const channelDescription =
    channel === "form"
      ? "just submitted our website's contact form"
      : "just sent an email directly to our info@ragtime.pro inbox";

  return `You are an email response assistant for Ragtime-Pro, a modernization partner that helps legacy software vendors adopt AI safely and incrementally, combining an AI-augmented Modernization Agent with expert consulting.
A visitor ${channelDescription}. Write a warm, professional, and concrete reply and return it as JSON.

Answer their question as specifically as the context below allows — do not just acknowledge their message and defer to a future follow-up if you can actually answer it now. If the context does not contain enough information to answer confidently, say so honestly rather than inventing details, pricing, or commitments.

Return exactly this JSON structure (no code fences, no extra text):
{
  "personalizedReply": "A friendly, professional reply email addressed to the visitor by name. Acknowledge their message, answer their question using the retrieved context when possible, and mention a matching website page's URL only when one is a clear fit. Do not invent specific answers, prices, or commitments beyond what the context supports. Close with a sign-off from 'The Ragtime-Pro Team'.",
  "replySubject": "A short (10 words max) subject line describing their request, e.g. 'Your question about ...'"
}

Rules:
1. The personalized reply must be warm, polite, and written in natural language — no bullet points, no markdown, though a plain URL is fine when it's a clear match.
2. Do NOT include JSON code fences in your output.
3. Do NOT include explanations outside the JSON.
4. Detect the language the visitor wrote their message in and reply in that same language.
5. ${CHANNEL_CLOSING_RULE[channel]}
6. Always write as Ragtime-Pro in first person plural ("we," "our," "us") — never as an individual ("I," "me").
7. The only real ways to reach Ragtime-Pro are the contact form at ${SITE_ORIGIN}/contact and emailing info@ragtime.pro directly. There is no calendar, time-slot picker, real-time availability system, or automatic calendar invite — nothing books or confirms a specific time automatically. Never invent a different email address or domain, a phone number, or any of the mechanics above. When asked about scheduling or availability, say only that they can reach out via the contact form or by emailing info@ragtime.pro and the team will coordinate a time — for example, "You can reach out via our contact form or by emailing info@ragtime.pro, and we'll coordinate a time that works for you," never "you can book a slot directly and we'll send a calendar invite."

Visitor details:
Name: ${name}
Company: ${company || "not provided"}
Email: ${email}
Phone: ${phone || "not provided"}
AI modernization interest: ${aiInterest || "not specified"}
Message: ${message}${buildCorrespondenceBlock(correspondence)}${buildContextBlock(chunks)}${buildPagesBlock()}`;
}

function parseReply(raw: string): AiReply | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  if (typeof parsed.personalizedReply !== "string" || !parsed.personalizedReply.trim()) {
    return null;
  }

  return {
    text: parsed.personalizedReply,
    subject:
      typeof parsed.replySubject === "string" && parsed.replySubject.trim()
        ? parsed.replySubject
        : FALLBACK_SUBJECT,
  };
}

export async function generateAiReply(
  fields: ContactFields,
  correspondence: EmailCorrespondence
): Promise<AiReply | null> {
  try {
    const candidates = await hybridSearch(fields.message);
    const reranked = await rerankCandidates(fields.message, candidates);

    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages: [{ role: "user", content: buildPrompt(fields, reranked, correspondence) }],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;

    return parseReply(raw);
  } catch (error) {
    console.error("AI reply generation error:", error);
    return null;
  }
}

function buildNoreplyPrompt(
  name: string,
  correspondence: EmailCorrespondence
): string {
  const hasPriorCorrespondence = !!correspondence.summary || correspondence.history.length > 0;

  return `You are an email response assistant for Ragtime-Pro, a modernization partner that helps legacy software vendors adopt AI safely and incrementally, combining an AI-augmented Modernization Agent with expert consulting.
A visitor just sent an email to noreply@ragtime.pro. That address is send-only and not monitored by anyone — it cannot receive replies and no one will see what they wrote there. Write a short, warm, professional reply and return it as JSON.

Your reply must:
- Gently explain that noreply@ragtime.pro doesn't accept incoming messages and isn't read by our team — this is not a scolding, just a friendly heads-up.
- Encourage them to visit ${SITE_ORIGIN} and use the chat icon there if they'd like an interactive conversation, or to reach out via the contact form at ${SITE_ORIGIN}/contact or by emailing info@ragtime.pro directly for anything else.
- Do NOT attempt to answer whatever they actually wrote in their message to noreply@ — you have no retrieved context for it here, and that's not the point of this reply.
- ${
    hasPriorCorrespondence
      ? "Briefly and warmly acknowledge their previous interest based on the correspondence summary below, so they feel recognized as someone we already know — one sentence is enough, don't repeat it in detail."
      : "There is no prior correspondence on file for this address — do not reference or imply any."
  }
- Stay brief — this is a redirect, not a full answer.
- Close with a sign-off from "The Ragtime-Pro Team".

Return exactly this JSON structure (no code fences, no extra text):
{
  "personalizedReply": "The reply text, addressed to the visitor by name.",
  "replySubject": "A short (10 words max) subject line, e.g. 'About your message to noreply@ragtime.pro'"
}

Rules:
1. The personalized reply must be warm, polite, and written in natural language — no bullet points, no markdown, though a plain URL is fine.
2. Do NOT include JSON code fences in your output.
3. Do NOT include explanations outside the JSON.
4. Detect the language the visitor wrote their message in and reply in that same language.
5. Always write as Ragtime-Pro in first person plural ("we," "our," "us") — never as an individual ("I," "me").
6. Never invent a different email address or domain, a phone number, or a scheduling/booking mechanism of any kind.

Visitor name: ${name}${buildCorrespondenceBlock(correspondence)}`;
}

export async function generateNoreplyRedirectReply(
  name: string,
  correspondence: EmailCorrespondence
): Promise<AiReply | null> {
  try {
    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages: [{ role: "user", content: buildNoreplyPrompt(name, correspondence) }],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;

    return parseReply(raw);
  } catch (error) {
    console.error("Noreply redirect reply generation error:", error);
    return null;
  }
}
