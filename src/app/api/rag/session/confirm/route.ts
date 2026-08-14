import { NextRequest, NextResponse } from "next/server";
import { confirmSession, getClientIp, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/rag/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const candidateSessionId = body?.candidateSessionId;
  const accept = body?.accept;

  if (typeof candidateSessionId !== "string" || typeof accept !== "boolean") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "";

  const result = await confirmSession(accept, candidateSessionId, ip, userAgent);

  const response = NextResponse.json(result);
  response.cookies.set(SESSION_COOKIE, result.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return response;
}
