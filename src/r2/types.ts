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
}

export interface EmailHistoryMessage extends SessionMessage {
  // Only meaningful (and set) on "user" turns - which channel this message
  // arrived through. Our replies always go out by email either way, so
  // assistant turns don't carry one.
  channel?: "form" | "email";
}

export interface EmailHistoryData {
  email: string; // normalized (lowercased, trimmed) - this is the R2 key
  history: EmailHistoryMessage[];
  summary: string;
  // Append-only, never truncated, mirroring SessionData.fullHistory - kept
  // for a complete audit trail even though nothing currently displays it.
  fullHistory: EmailHistoryMessage[];
  lastSeen: string;
}
