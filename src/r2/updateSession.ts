import { readSession } from "./readSession";
import { writeSession } from "./writeSession";
import type { SessionData } from "./types";

export async function updateSession(
  sessionId: string,
  updates: Partial<Omit<SessionData, "sessionId">>
): Promise<SessionData> {
  const existing = await readSession(sessionId);

  if (!existing) {
    throw new Error(`updateSession: no session found for ${sessionId}`);
  }

  const updated: SessionData = {
    ...existing,
    ...updates,
    sessionId,
    lastSeen: new Date().toISOString(),
  };

  await writeSession(updated);

  return updated;
}
