import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/r2/deleteSession";
import { SESSION_COOKIE } from "@/rag/session";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value ?? null;
  if (sessionId) await deleteSession(sessionId);

  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/api",
    maxAge: 0,
  });

  return response;
}
