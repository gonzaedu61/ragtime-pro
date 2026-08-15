import { AzureOpenAI } from "openai/azure";
import { hybridSearch } from "@/rag/retrieval/hybrid";
import { rerankCandidates, type RerankedChunk } from "@/rag/retrieval/rerank";
import { getAllPages } from "@/lib/pageDirectory";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_AI_PROJECT_API_KEY,
  apiVersion: "2024-12-01-preview",
  deployment: "o4-mini",
  timeout: 25000,
});

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ragtime.pro";

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

const FALLBACK_SUBJECT = "We've received your message — Ragtime-Pro";

const CHANNEL_CLOSING_RULE: Record<ContactFields["channel"], string> = {
  form: 'End by letting them know the team will follow up with them directly soon, using the contact details they provided — do not ask them to book a call themselves, since submitting the form already means we\'ll reach out.',
  email: `End with a polite invitation to book an introductory call at ${SITE_ORIGIN}/start, since they reached out directly by email rather than through the contact form.`,
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

function buildPrompt(
  { name, company, email, phone, aiInterest, message, channel }: ContactFields,
  chunks: RerankedChunk[]
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

Visitor details:
Name: ${name}
Company: ${company || "not provided"}
Email: ${email}
Phone: ${phone || "not provided"}
AI modernization interest: ${aiInterest || "not specified"}
Message: ${message}${buildContextBlock(chunks)}${buildPagesBlock()}`;
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

export async function generateAiReply(fields: ContactFields): Promise<AiReply | null> {
  try {
    const candidates = await hybridSearch(fields.message);
    const reranked = await rerankCandidates(fields.message, candidates);

    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages: [{ role: "user", content: buildPrompt(fields, reranked) }],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;

    return parseReply(raw);
  } catch (error) {
    console.error("AI reply generation error:", error);
    return null;
  }
}
