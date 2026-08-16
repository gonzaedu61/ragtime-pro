import client from "@/rag/azureClient";
import { hybridSearch } from "@/rag/retrieval/hybrid";
import { rerankCandidates } from "@/rag/retrieval/rerank";
import { buildAnswerMessages, type LinkedEmailCorrespondence } from "@/rag/prompts/answerPrompt";
import { shouldSummarize, summarizeSession } from "@/rag/summarize";
import { getPageContext } from "@/lib/pageDirectory";
import { detectEmailLinkIntent, classifyIdentityConfirmation } from "@/rag/emailLinkDetector";
import { findEmailHistoryByIdentity, summarizeTopicHint } from "@/rag/emailHistory";
import { readEmailHistory, writeEmailHistory } from "@/r2/emailHistory";
import type { SessionData, SessionMessage } from "@/r2/types";

export interface AnswerSource {
  id: string;
  doc_id: string;
  section: string;
}

export interface AnswerResult {
  answer: string;
  sources: AnswerSource[];
  summary: string;
  history: SessionMessage[];
  // Both undefined = no change from what's already on the session. See
  // src/r2/types.ts's SessionData fields of the same name for the full
  // state-machine explanation.
  linkedEmail?: string;
  pendingEmailLinkCandidate?: string;
}

// Scenario 1 of the chat <-> email linking feature: if the visitor implies
// prior contact via email/the contact form, look up that correspondence
// (by email, or a softer name/company match) and, once they confirm it's
// really them, fold it into the conversation from then on. Runs as part of
// generateAnswer() rather than a separate step so the found context can
// still influence *this* turn's answer, not just future ones.
async function resolveEmailLink(
  session: SessionData,
  query: string
): Promise<{
  linkedCorrespondence: LinkedEmailCorrespondence | null;
  emailLinkNote: string | null;
  linkedEmail: string | undefined;
  pendingEmailLinkCandidate: string | undefined;
}> {
  // Already linked: just load and inject, every turn, no re-detection.
  if (session.linkedEmail) {
    const record = await readEmailHistory(session.linkedEmail);
    return {
      linkedCorrespondence: record ? { summary: record.summary, history: record.history } : null,
      emailLinkNote: null,
      linkedEmail: session.linkedEmail,
      pendingEmailLinkCandidate: undefined,
    };
  }

  // A candidate was found last turn and is awaiting a yes/no - this reply
  // is that answer. One-shot: whatever happens, pendingEmailLinkCandidate
  // is not carried forward past this turn.
  if (session.pendingEmailLinkCandidate) {
    const confirmation = await classifyIdentityConfirmation(query);

    if (confirmation === "confirm") {
      const record = await readEmailHistory(session.pendingEmailLinkCandidate);
      if (record) {
        // Bidirectional link - the email side also gets to know about the
        // chat session (src/lib/acknowledgement.ts does the reverse for
        // scenario 2).
        await writeEmailHistory({ ...record, linkedSessionId: session.sessionId });
      }
      return {
        linkedCorrespondence: record ? { summary: record.summary, history: record.history } : null,
        emailLinkNote:
          "The visitor just confirmed the previous conversation is theirs - the correspondence above is now available; use it naturally.",
        linkedEmail: session.pendingEmailLinkCandidate,
        pendingEmailLinkCandidate: undefined,
      };
    }

    return {
      linkedCorrespondence: null,
      emailLinkNote:
        confirmation === "deny"
          ? "The visitor said the previous conversation found was NOT them. Do not reference it. You may offer to try a different email, name, or company if they'd like."
          : "The visitor's reply didn't clearly confirm or deny the previous conversation found. Don't assume either way - you can ask again naturally if it's still relevant.",
      linkedEmail: undefined,
      pendingEmailLinkCandidate: undefined,
    };
  }

  // Nothing linked or pending yet - see if this turn (or the conversation
  // so far) gives us anything to look up with.
  const intent = await detectEmailLinkIntent(session.history, query);

  if (intent.email || intent.name || intent.company) {
    const match = await findEmailHistoryByIdentity({
      email: intent.email,
      name: intent.name,
      company: intent.company,
    });

    if (match) {
      const hint = summarizeTopicHint(match);
      return {
        linkedCorrespondence: null,
        emailLinkNote: `A previous conversation was found that might belong to this visitor, generally about: "${hint}". Your reply this turn must ask a direct yes/no confirmation question, paraphrasing that topic briefly in your own natural words - never quote the topic text verbatim, especially if it's cut off mid-sentence. For example, if the topic were about automating shipment approval workflows, ask something like "It looks like we received a message from you before about automating your shipment approval process - is that right?" Do NOT ask for more identifying details (name, company, a different email, etc.) at this point - identifying info is exactly what led to this match. Do not reveal any further specific content from that conversation until they confirm.`,
        linkedEmail: undefined,
        pendingEmailLinkCandidate: match.email,
      };
    }

    return {
      linkedCorrespondence: null,
      emailLinkNote:
        "No previous correspondence was found matching the information the visitor gave. Tell them honestly, and ask if they'd like to try different details or just continue without it.",
      linkedEmail: undefined,
      pendingEmailLinkCandidate: undefined,
    };
  }

  if (intent.shouldAskForIdentity) {
    return {
      linkedCorrespondence: null,
      emailLinkNote:
        "The visitor seems to be referring to a prior email or contact-form conversation. Ask them for the email address they used, or alternatively their name and/or company, so it can be looked up.",
      linkedEmail: undefined,
      pendingEmailLinkCandidate: undefined,
    };
  }

  return {
    linkedCorrespondence: null,
    emailLinkNote: null,
    linkedEmail: undefined,
    pendingEmailLinkCandidate: undefined,
  };
}

export async function generateAnswer(
  query: string,
  session: SessionData,
  pagePath?: string | null
): Promise<AnswerResult> {
  // Turn number is derived from the session as loaded, before any
  // in-request summarization trims it - so the request that triggers
  // summarization still counts correctly for the CTA cadence rule. After
  // that, the stored history is shorter, so cadence effectively restarts
  // per summarization cycle rather than staying exact for the whole
  // session lifetime. A precise version would need a persistent turn
  // counter on SessionData; not worth the schema change for this.
  const turnNumber = session.history.length / 2 + 1;
  const forceCta = turnNumber % 3 === 0;

  let summary = session.summary;
  let history = session.history;

  if (shouldSummarize(session)) {
    const summarized = await summarizeSession(session);
    summary = summarized.summary;
    history = summarized.history;
  }

  const pageContext = getPageContext(pagePath);
  // Bias retrieval toward the current page's topic (e.g. "what's on this
  // page?" has no lexical overlap with the right chunks on its own) without
  // changing the literal query shown to the LLM as the user's turn.
  const retrievalQuery = pageContext
    ? `${query} (current page: ${pageContext.title} - ${pageContext.description})`
    : query;

  const candidates = await hybridSearch(retrievalQuery);
  const reranked = await rerankCandidates(retrievalQuery, candidates);

  const { linkedCorrespondence, emailLinkNote, linkedEmail, pendingEmailLinkCandidate } = await resolveEmailLink(
    session,
    query
  );

  const messages = buildAnswerMessages({
    query,
    chunks: reranked,
    summary,
    history,
    forceCta,
    pageContext,
    linkedCorrespondence,
    emailLinkNote,
  });

  const response = await client.chat.completions.create({
    model: "o4-mini",
    messages,
  });

  const answer = response.choices[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error("Azure OpenAI returned an empty answer.");
  }

  return {
    answer,
    sources: reranked.map((result) => ({
      id: result.chunk.id,
      doc_id: result.chunk.doc_id,
      section: result.chunk.section,
    })),
    summary,
    history,
    linkedEmail,
    pendingEmailLinkCandidate,
  };
}
