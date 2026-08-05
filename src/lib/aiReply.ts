import { AzureOpenAI } from "openai/azure";

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
}

interface AiReply {
  text: string;
  subject: string;
}

const FALLBACK_SUBJECT = "We've received your message — The BrokerAI";

function buildPrompt({ name, company, email, phone, aiInterest, message }: ContactFields): string {
  return `You are an email response assistant for The BrokerAI, a consulting firm that helps SMEs adopt AI safely and effectively.
A visitor just submitted our website's contact form. Write a warm, professional acknowledgement reply and return it as JSON.

Return exactly this JSON structure (no code fences, no extra text):
{
  "personalizedReply": "A friendly, professional reply email addressed to the visitor by name. Acknowledge their message, briefly reflect what they're asking about or interested in, and state that the team will review it and follow up shortly with the information they're looking for. Do not invent specific answers, prices, or commitments. Close with a sign-off from 'The BrokerAI Team'.",
  "replySubject": "A short (10 words max) subject line describing their request, e.g. 'Your question about ...'"
}

Rules:
1. The personalized reply must be warm, polite, and written in natural language — no bullet points, no markdown.
2. Do NOT include JSON code fences in your output.
3. Do NOT include explanations outside the JSON.
4. Detect the language the visitor wrote their message in and reply in that same language.

Visitor details:
Name: ${name}
Company: ${company || "not provided"}
Email: ${email}
Phone: ${phone || "not provided"}
AI interest: ${aiInterest || "not specified"}
Message: ${message}`;
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
    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages: [{ role: "user", content: buildPrompt(fields) }],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;

    return parseReply(raw);
  } catch (error) {
    console.error("AI reply generation error:", error);
    return null;
  }
}
