export interface SessionMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SessionData {
  sessionId: string;
  fingerprint: string;
  history: SessionMessage[];
  summary: string;
  lastSeen: string;
  /**
   * Append-only, never truncated - the full conversation transcript for
   * display in the chat pane. `history` above is the separate,
   * summarization-trimmed working set sent to the LLM for context.
   * Optional on the type because sessions written before this field
   * existed won't have it; readers should fall back to `history`.
   */
  fullHistory?: SessionMessage[];
  // Set once a chat session gets linked to an email-history record (see
  // src/rag/answer.ts) - normalized email, the EmailHistoryData R2 key.
  // Once set, every future turn in this chat pulls in that correspondence
  // for continuity, so the visitor never has to re-explain themselves.
  linkedEmail?: string;
  // Set for exactly one turn while a candidate match is awaiting the
  // visitor's yes/no confirmation ("is this you?") - cleared the next turn
  // regardless of outcome (confirmed -> promoted to linkedEmail; denied or
  // unclear -> just dropped). Never both this and linkedEmail at once.
  pendingEmailLinkCandidate?: string;
  // Set for exactly one turn right after the assistant asked the visitor
  // for their email/name/company to look up prior correspondence - cleared
  // the next turn regardless of outcome. Lets resolveEmailLink
  // (src/rag/answer.ts) force-run detectEmailLinkIntent on that reply even
  // if it's a bare name/company with none of mightReferencePriorContact's
  // keywords (see src/rag/emailLinkDetector.ts), since a terse identity
  // reply to a question we just asked wouldn't otherwise be caught by the
  // pre-filter that skips the classifier call on unrelated turns.
  awaitingIdentityInfo?: boolean;
}

export interface EmailHistoryMessage extends SessionMessage {
  // Only meaningful (and set) on "user" turns - which channel this message
  // arrived through. "noreply" = misdirected to noreply@ragtime.pro (not a
  // real inquiry channel, but worth recording for continuity). Our replies
  // always go out by email either way, so assistant turns don't carry one.
  channel?: "form" | "email" | "noreply";
}

export interface EmailHistoryData {
  email: string; // normalized (lowercased, trimmed) - this is the R2 key
  history: EmailHistoryMessage[];
  summary: string;
  // Append-only, never truncated, mirroring SessionData.fullHistory - kept
  // for a complete audit trail even though nothing currently displays it.
  fullHistory: EmailHistoryMessage[];
  lastSeen: string;
  // Visitor's name/company, if ever provided (contact form, or a chat
  // visitor stating them) - also written as R2 object metadata so they can
  // be searched without downloading every record (see findEmailHistoryByNameOrCompany).
  name?: string;
  company?: string;
  // Set when this record gets linked to a chat SessionData (bidirectional
  // with SessionData.linkedEmail above) - the chat session's sessionId.
  linkedSessionId?: string;
}
