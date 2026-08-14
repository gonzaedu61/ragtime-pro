import { computeFingerprint } from "@/r2/fingerprint";
import { createSession } from "@/r2/createSession";
import { findByFingerprint } from "@/r2/findByFingerprint";
import { readSession } from "@/r2/readSession";
import type { SessionData } from "@/r2/types";

export const SESSION_COOKIE = "rag_session";
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export type ResolveResult =
  | { status: "active"; sessionId: string; session: SessionData }
  | { status: "new"; sessionId: string; session: SessionData }
  | { status: "confirm"; candidateSessionId: string; lastSeen: string };

export async function resolveSession(
  existingSessionId: string | null,
  ip: string,
  userAgent: string
): Promise<ResolveResult> {
  if (existingSessionId) {
    const session = await readSession(existingSessionId);
    if (session) {
      return { status: "active", sessionId: session.sessionId, session };
    }
    // Missing/corrupted session file: create a fresh one (spec §5.7).
    const created = await createSession(ip, userAgent);
    return { status: "new", ...created };
  }

  const fingerprint = computeFingerprint(ip, userAgent);
  const candidate = await findByFingerprint(fingerprint);

  if (candidate) {
    return {
      status: "confirm",
      candidateSessionId: candidate.sessionId,
      lastSeen: candidate.lastSeen,
    };
  }

  const created = await createSession(ip, userAgent);
  return { status: "new", ...created };
}

export async function confirmSession(
  accept: boolean,
  candidateSessionId: string,
  ip: string,
  userAgent: string
): Promise<{ sessionId: string; session: SessionData }> {
  if (accept) {
    const session = await readSession(candidateSessionId);
    if (session) {
      return { sessionId: session.sessionId, session };
    }
  }

  return createSession(ip, userAgent);
}
