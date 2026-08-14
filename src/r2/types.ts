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
}
