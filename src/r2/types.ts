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
