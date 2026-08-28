import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/almendro/session/deleteSession";
import { ALMENDRO_SESSION_COOKIE } from "@/almendro/session/cookie";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(ALMENDRO_SESSION_COOKIE)?.value ?? null;
  if (sessionId) await deleteSession(sessionId);

  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(ALMENDRO_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/almendro",
    maxAge: 0,
  });

  return response;
}
