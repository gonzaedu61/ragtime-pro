import { randomUUID } from "crypto";
import { computeFingerprint } from "./fingerprint";
import { writeSession } from "./writeSession";
import type { SessionData } from "./types";

export async function createSession(
  ip: string,
  userAgent: string
): Promise<{ sessionId: string; session: SessionData }> {
  const sessionId = randomUUID();
  const session: SessionData = {
    sessionId,
    fingerprint: computeFingerprint(ip, userAgent),
    history: [],
    summary: "",
    lastSeen: new Date().toISOString(),
  };

  await writeSession(session);

  return { sessionId, session };
}
