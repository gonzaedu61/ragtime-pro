import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/r2/readSession";
import { createSession } from "@/r2/createSession";
import { updateSession } from "@/r2/updateSession";
import { getClientIp, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/rag/session";
import { generateAnswer } from "@/rag/answer";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const query = body?.query;
  const pagePath = typeof body?.pagePath === "string" ? body.pagePath : null;

  if (typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ error: "Missing required field: query" }, { status: 400 });
  }

  const existingSessionId = request.cookies.get(SESSION_COOKIE)?.value ?? null;
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "";

  const session =
    (existingSessionId ? await readSession(existingSessionId) : null) ??
    (await createSession(ip, userAgent)).session;

  let result;
  try {
    result = await generateAnswer(query, session, pagePath);
  } catch (error) {
    console.error("Answer generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong generating a response. Please try again." },
      { status: 502 }
    );
  }

  const newTurn = [
    { role: "user" as const, content: query },
    { role: "assistant" as const, content: result.answer },
  ];

  const updatedSession = await updateSession(session.sessionId, {
    summary: result.summary,
    history: [...result.history, ...newTurn],
    // Append-only - never truncated, unlike history above (falls back to
    // history for pre-fullHistory sessions so nothing is silently dropped).
    fullHistory: [...(session.fullHistory ?? session.history), ...newTurn],
    // Explicitly included even when undefined - updateSession spreads these
    // over the existing session, and JSON.stringify drops undefined-valued
    // keys, so this is what actually clears pendingEmailLinkCandidate after
    // its one-shot turn (see src/rag/answer.ts's resolveEmailLink).
    linkedEmail: result.linkedEmail,
    pendingEmailLinkCandidate: result.pendingEmailLinkCandidate,
  });

  const response = NextResponse.json({
    sessionId: updatedSession.sessionId,
    answer: result.answer,
    sources: result.sources,
  });

  response.cookies.set(SESSION_COOKIE, updatedSession.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return response;
}
