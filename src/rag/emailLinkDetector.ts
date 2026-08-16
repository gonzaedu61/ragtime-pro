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
// Deliberately broad (favors false positives, which just cost one extra LLM
// call, over false negatives, which would silently skip a real hint) -
// covers both "I contacted you before" style phrasing and the visitor
// introducing themselves by name/company.
const HINT_PATTERN =
  /\b(e-?mail(ed)?|contact(ed)?|reach(ed)?\s*out|form|submitt?ed|before|previously|earlier|already|last time|follow(ing)?\s*up|wrote|spoke|talked|mentioned|as i (said|mentioned)|my name is|i'?m\s|i am\s|this is\s|on behalf of|work(s|ing)?\s*(at|for)|my company)\b/i;

// Cheap pre-filter run before detectEmailLinkIntent (a full o4-mini call,
// ~3s - see docs/rag-implementation-spec.md §7.12's performance follow-up)
// so the classifier only runs on turns that could plausibly matter, instead
// of every single turn of every unlinked chat. Intentionally permissive:
// missing a genuine hint just means the linking flow doesn't trigger this
// turn (it can still trigger on a later turn that repeats or clarifies it),
// which is a much smaller cost than paying ~3s on turns that have nothing
// to do with prior contact at all.
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

    const prompt = `You are analyzing a live website chat conversation with Ragtime-Pro, to detect whether the visitor is referring to prior contact via email or the contact form.

Conversation so far:
${transcript}

Determine:
1. Has the visitor, anywhere in this conversation, provided an email address, their name, or their company name that could be used to look up a prior email/contact-form conversation?
2. Does the visitor's LATEST message suggest they've contacted Ragtime-Pro before by email or the contact form (e.g. "I already emailed you", "I submitted the form", "following up on my message", "as I mentioned in my email")?

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
