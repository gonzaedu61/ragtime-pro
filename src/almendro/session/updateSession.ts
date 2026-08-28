import { readSession } from "./readSession";
import { writeSession } from "./writeSession";
import type { AlmendroSessionData } from "./types";

export async function updateSession(
  sessionId: string,
  updates: Partial<Omit<AlmendroSessionData, "sessionId">>
): Promise<AlmendroSessionData> {
  const existing = await readSession(sessionId);

  if (!existing) {
    throw new Error(`almendro updateSession: no session found for ${sessionId}`);
  }

  const updated: AlmendroSessionData = {
    ...existing,
    ...updates,
    sessionId,
    lastSeen: new Date().toISOString(),
  };

  await writeSession(updated);
  return updated;
}
