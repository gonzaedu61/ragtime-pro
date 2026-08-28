import client from "@/rag/azureClient";
import type { SessionMessage } from "@/r2/types";

// Deliberately a small, separate LLM call rather than trying to infer this
// from free-form chat text with regexes/state-flag heuristics - mirrors
// the existing secondary-call pattern already used for summarization
// (src/rag/summarize.ts). Regex would only catch email addresses reliably;
// this also has to notice "I already emailed you" style hints, and names/
// company mentions in ordinary prose, which really needs comprehension,
// not pattern matching.

export interface EmailLinkIntent {
  shouldAskForIdentity: boolean;
  email?: string;
  name?: string;
  company?: string;
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// Measured against a representative sample of ordinary chat turns (FAQ
// questions + natural follow-ups) and genuine "I contacted you before"
// style hints (see docs/rag-implementation-spec.md §8): an earlier, looser
// version of this pattern - which included bare "before", "already",
// "contact", "i'm ", "i am ", and "this is " - triggered on ~36% of
// ordinary turns, since those words are just common English regardless of
// topic. This version drops those and keeps only phrases that actually
// carry signal, narrows "work at/for" to first-person framing (so "how
// would this work for our team" doesn't match), and adds "sent" (a real
// gap) - measured 0% false positives on the same sample with no loss of
// recall on genuine hints.
const HINT_PATTERN =
  /\b(e-?mail(ed)?|contacted|reach(ed)?\s*out|form|submitt?ed|previously|earlier|last time|follow(ing)?[\s-]*up|wrote|sent|spoke|talked|mentioned|as i (said|mentioned)|my name is|on behalf of|my company|(i|we)\s+work(s|ing)?\s*(at|for))\b/i;

// Cheap pre-filter run before detectEmailLinkIntent (a full o4-mini call,
// ~3s - see docs/rag-implementation-spec.md §7.12's performance follow-up)
// so the classifier only runs on turns that could plausibly matter, instead
// of every single turn of every unlinked chat. Tuned toward precision, not
// just recall: a looser first attempt at this pattern (see git history)
// measured a 36% false-positive rate on ordinary conversation - generic
// words like "already" and "this is" are just common English, not a
// meaningful signal. Missing a genuine hint here just means the linking
// flow doesn't trigger this turn (it can still trigger on a later turn
// that repeats or clarifies it, and awaitingIdentityInfo below covers the
// one case that can't self-correct - a bare identity reply right after
// we've asked for one).
export function mightReferencePriorContact(text: string): boolean {
  return EMAIL_PATTERN.test(text) || HINT_PATTERN.test(text);
}

function parseJson<T>(raw: string | undefined | null): T | null {
  if (!raw) return null;
  try {
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

export async function detectEmailLinkIntent(
  history: SessionMessage[],
  query: string
): Promise<EmailLinkIntent> {
  const fallback: EmailLinkIntent = { shouldAskForIdentity: false };

  try {
    const transcript = [...history, { role: "user" as const, content: query }]
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const prompt = `You are analyzing a live website chat conversation with RAGnify, to detect whether the visitor is referring to prior contact via email or the contact form.

Conversation so far:
${transcript}

Determine:
1. Has the visitor, anywhere in this conversation, provided an email address, their name, or their company name that could be used to look up a prior email/contact-form conversation?
2. Does the visitor's LATEST message suggest they've contacted RAGnify before by email or the contact form (e.g. "I already emailed you", "I submitted the form", "following up on my message", "as I mentioned in my email")?

Return exactly this JSON (no code fences, no extra text):
{
  "shouldAskForIdentity": boolean (true only if #2 is true AND no email/name/company has been provided anywhere in the conversation yet),
  "email": string or null (an email address found anywhere in the conversation, if any),
  "name": string or null (the visitor's name, if they stated it),
  "company": string or null (the visitor's company, if they stated it)
}`;

    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = parseJson<{
      shouldAskForIdentity?: boolean;
      email?: string | null;
      name?: string | null;
      company?: string | null;
    }>(response.choices[0]?.message?.content);

    if (!parsed) return fallback;

    return {
      shouldAskForIdentity: !!parsed.shouldAskForIdentity,
      email: parsed.email ?? undefined,
      name: parsed.name ?? undefined,
      company: parsed.company ?? undefined,
    };
  } catch (error) {
    console.error("detectEmailLinkIntent error:", error);
    return fallback;
  }
}

export type ConfirmationResult = "confirm" | "deny" | "unclear";

// Classifies the visitor's reply to a single "is this you?" confirm
// question - kept separate from detectEmailLinkIntent above since it only
// ever runs for exactly one turn (see src/rag/answer.ts's
// pendingEmailLinkCandidate handling), with a much narrower question.
export async function classifyIdentityConfirmation(reply: string): Promise<ConfirmationResult> {
  try {
    const prompt = `A chat assistant just asked a visitor "Does this sound like you?" about a previous conversation it found. The visitor replied:

"${reply}"

Classify this reply as exactly one of: "confirm" (they said yes / that's them), "deny" (they said no / not them), or "unclear" (ambiguous, or they didn't actually answer the question). Return exactly this JSON (no code fences, no extra text): { "result": "confirm" | "deny" | "unclear" }`;

    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = parseJson<{ result?: string }>(response.choices[0]?.message?.content);
    if (parsed?.result === "confirm" || parsed?.result === "deny") return parsed.result;
    return "unclear";
  } catch (error) {
    console.error("classifyIdentityConfirmation error:", error);
    return "unclear";
  }
}
