import { NextRequest, NextResponse } from "next/server";
import { getClientIp, omitFullHistory, resolveSession, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/rag/session";

export async function GET(request: NextRequest) {
  const existingSessionId = request.cookies.get(SESSION_COOKIE)?.value ?? null;
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "";

  const result = await resolveSession(existingSessionId, ip, userAgent);

  const response = NextResponse.json(
    result.status === "confirm" ? result : { ...result, session: omitFullHistory(result.session) }
  );

  if (result.status !== "confirm") {
    response.cookies.set(SESSION_COOKIE, result.sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/api",
      maxAge: SESSION_COOKIE_MAX_AGE,
    });
  }

  return response;
}
