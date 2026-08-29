import type { AlmendroSource } from "@/almendro/answer";

export interface AlmendroSessionMessage {
  role: "user" | "assistant";
  content: string;
  sources?: AlmendroSource[];
  followUpTopics?: string[];
}

// Deliberately much simpler than src/r2/types.ts's SessionData: no
// fingerprint (no cross-device recovery), no linkedEmail (no cross-channel
// linking) - this is a single, session-scoped conversation that either gets
// found by its cookie or starts fresh, nothing more.
export interface AlmendroSessionData {
  sessionId: string;
  history: AlmendroSessionMessage[];
  lastSeen: string;
}
