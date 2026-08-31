import transporter from "@/lib/mailer";
import { generateAiReply, generateNoreplyRedirectReply, type ChatCorrespondence } from "@/lib/aiReply";
import { loadEmailContext, recordEmailTurn } from "@/rag/emailHistory";
import { hasFormSubmission } from "@/rag/prompts/correspondenceBlock";
import { normalizeEmail } from "@/r2/emailHistory";
import { updateSession } from "@/r2/updateSession";
import { SITE_ORIGIN } from "@/lib/pageDirectory";

const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS!;
const INFO_ADDRESS = process.env.MAIL_INFO_ADDRESS!;
const FALLBACK_SUBJECT = "We've received your message — RAGnify";
const NOREPLY_FALLBACK_SUBJECT = "About your message to noreply@ragnify.pro";

// Only appended when the reply actually came from the model - the fallback
// text below is a fixed string, not AI-generated, so claiming otherwise
// there would be inaccurate.
const AI_DISCLOSURE = "This reply was generated automatically by RAGnify's AI agent.";

interface AckFields {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  aiInterest?: string;
  message: string;
  channel: "form" | "email";
  // Set by contact/route.ts when the same browser session used the chat
  // widget before submitting the form (scenario 2: chat -> form linking).
  chatSessionId?: string;
  chatContext?: ChatCorrespondence | null;
}

function fallbackText(name: string): string {
  return `Dear ${name},\n\nThank you for getting in touch with us — we appreciate your interest in exploring how AI could modernize your product. We'll review your message and get back to you shortly with the information you're looking for.\nWe hope the walkthrough on our site has been helpful in shaping your thinking around modernization. With a bit of luck, this first conversation becomes the start of something more meaningful.\n\n— The RAGnify Team`;
}

function noreplyFallbackText(name: string): string {
  return `Dear ${name},\n\nThanks for your message. This address (noreply@ragnify.pro) is used only for sending automated emails and isn't monitored, so we won't see anything sent here.\n\nIf you'd like an interactive conversation, visit ${SITE_ORIGIN} and look for the chat icon — or reach out via our contact form at ${SITE_ORIGIN}/contact or by emailing info@ragnify.pro directly.\n\n— The RAGnify Team`;
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
  const alreadySubmittedForm = hasFormSubmission(context.fullHistory);
  const aiReply = await generateAiReply(fields, context, fields.chatContext ?? null, alreadySubmittedForm);

  const bodyText = aiReply ? aiReply.text : fallbackText(fields.name);
  const disclosure = aiReply ? AI_DISCLOSURE : undefined;
  const plainText = disclosure ? `${bodyText}\n\n${disclosure}` : bodyText;

  await transporter.sendMail({
    from: `"RAGnify" <${FROM_ADDRESS}>`,
    to: fields.email,
    bcc: INFO_ADDRESS,
    subject: aiReply?.subject ?? FALLBACK_SUBJECT,
    text: plainText,
    html: buildHtmlBody(bodyText, disclosure),
  });

  // Record what was actually sent - including the fallback path, so the
  // history stays accurate even when AI generation failed this time.
  // Also persists name/company (for scenario-1 lookups from the chat side)
  // and links this record to the chat session it accompanied, if any.
  await recordEmailTurn(context, fields.message, fields.channel, bodyText, {
    name: fields.name,
    company: fields.company,
    linkedSessionId: fields.chatSessionId,
  });

  // Bidirectional: the chat session also gets to know it's linked, so
  // future chat turns in that same session pull in this correspondence
  // too (src/rag/answer.ts).
  if (fields.chatSessionId) {
    await updateSession(fields.chatSessionId, { linkedEmail: normalizeEmail(fields.email) }).catch((error) => {
      console.error("Failed to link chat session to email history:", error);
    });
  }
}

interface NoreplyFields {
  name: string;
  email: string;
  message: string;
}

// For messages sent to noreply@ragnify.pro: never attempts to answer what
// was written there (that's not the point), just a gentle redirect to a
// real channel, personalized with prior correspondence when there is any.
export async function sendNoreplyRedirect(fields: NoreplyFields): Promise<void> {
  const context = await loadEmailContext(fields.email);
  const aiReply = await generateNoreplyRedirectReply(fields.name, context, hasFormSubmission(context.fullHistory));

  const bodyText = aiReply ? aiReply.text : noreplyFallbackText(fields.name);
  const disclosure = aiReply ? AI_DISCLOSURE : undefined;
  const plainText = disclosure ? `${bodyText}\n\n${disclosure}` : bodyText;

  await transporter.sendMail({
    from: `"RAGnify" <${FROM_ADDRESS}>`,
    to: fields.email,
    bcc: INFO_ADDRESS,
    subject: aiReply?.subject ?? NOREPLY_FALLBACK_SUBJECT,
    text: plainText,
    html: buildHtmlBody(bodyText, disclosure),
  });

  await recordEmailTurn(context, fields.message, "noreply", bodyText, { name: fields.name });
}
