import transporter from "@/lib/mailer";
import { generateAiReply } from "@/lib/aiReply";
import { loadEmailContext, recordEmailTurn } from "@/rag/emailHistory";

const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS!;
const INFO_ADDRESS = process.env.MAIL_INFO_ADDRESS!;
const FALLBACK_SUBJECT = "We've received your message — Ragtime-Pro";

// Only appended when the reply actually came from the model - the fallback
// text below is a fixed string, not AI-generated, so claiming otherwise
// there would be inaccurate.
const AI_DISCLOSURE = "This reply was generated automatically by Ragtime-Pro's AI agent.";

interface AckFields {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  aiInterest?: string;
  message: string;
  channel: "form" | "email";
}

function fallbackText(name: string): string {
  return `Dear ${name},\n\nThank you for getting in touch with us — we appreciate your interest in exploring how AI could modernize your product. We'll review your message and get back to you shortly with the information you're looking for.\nWe hope the walkthrough on our site has been helpful in shaping your thinking around modernization. With a bit of luck, this first conversation becomes the start of something more meaningful.\n\n— The Ragtime-Pro Team`;
}

const URL_PATTERN = /(https?:\/\/[^\s<>"')]+)/g;
// A URL match can swallow trailing sentence punctuation ("...rag-solutions.")
// since "." is a legitimate mid-URL character too - split it back off so the
// href doesn't 404 on a dead trailing character.
const TRAILING_PUNCTUATION = /[.,;:!?]+$/;

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Splitting on a capturing group keeps the matched URLs in the result array
// (at odd indices), interleaved with the surrounding plain-text segments (at
// even indices) - lets each half be handled differently below.
function linkify(text: string): string {
  return text
    .split(URL_PATTERN)
    .map((segment, index) => {
      if (index % 2 !== 1) return escapeHtml(segment);
      const trailingMatch = segment.match(TRAILING_PUNCTUATION);
      const trailing = trailingMatch?.[0] ?? "";
      const url = trailing ? segment.slice(0, -trailing.length) : segment;
      return `<a href="${url}">${url}</a>${escapeHtml(trailing)}`;
    })
    .join("");
}

function buildHtmlBody(replyText: string, disclosure?: string): string {
  const body = linkify(replyText).replace(/\n/g, "<br>\n");
  const disclosureHtml = disclosure
    ? `<p style="color:#888888;font-size:12px;margin-top:24px;">${escapeHtml(disclosure)}</p>`
    : "";
  return `<div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;">${body}</div>${disclosureHtml}`;
}

export async function sendAcknowledgement(fields: AckFields): Promise<void> {
  const context = await loadEmailContext(fields.email);
  const aiReply = await generateAiReply(fields, context);

  const bodyText = aiReply ? aiReply.text : fallbackText(fields.name);
  const disclosure = aiReply ? AI_DISCLOSURE : undefined;
  const plainText = disclosure ? `${bodyText}\n\n${disclosure}` : bodyText;

  await transporter.sendMail({
    from: `"Ragtime-Pro" <${FROM_ADDRESS}>`,
    to: fields.email,
    bcc: INFO_ADDRESS,
    subject: aiReply?.subject ?? FALLBACK_SUBJECT,
    text: plainText,
    html: buildHtmlBody(bodyText, disclosure),
  });

  // Record what was actually sent - including the fallback path, so the
  // history stays accurate even when AI generation failed this time.
  await recordEmailTurn(context, fields.message, fields.channel, bodyText);
}
