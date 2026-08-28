import { randomUUID } from "crypto";
import { writeSession } from "./writeSession";
import type { AlmendroSessionData } from "./types";

export async function createSession(): Promise<AlmendroSessionData> {
  const session: AlmendroSessionData = {
    sessionId: randomUUID(),
    history: [],
    lastSeen: new Date().toISOString(),
  };

  await writeSession(session);
  return session;
}
