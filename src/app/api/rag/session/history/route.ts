import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/r2/readSession";
import { SESSION_COOKIE } from "@/rag/session";
import { HISTORY_PAGE_SIZE, HISTORY_PAGE_SIZE_MAX } from "@/rag/historyPagination";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value ?? null;
  if (!sessionId) {
    return NextResponse.json({ messages: [], hasMore: false, nextBefore: 0 });
  }

  const session = await readSession(sessionId);
  if (!session) {
    return NextResponse.json({ messages: [], hasMore: false, nextBefore: 0 });
  }

  const fullHistory = session.fullHistory ?? session.history;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    HISTORY_PAGE_SIZE_MAX,
    Math.max(1, Number(searchParams.get("limit")) || HISTORY_PAGE_SIZE)
  );
  // Number(null) is 0, not NaN, so an absent param must be checked with
  // .get() !== null rather than relying on Number.isFinite alone - otherwise
  // "no before given" silently resolves to "before index 0" instead of
  // defaulting to the latest page.
  const beforeRaw = searchParams.get("before");
  const beforeParam = beforeRaw === null ? NaN : Number(beforeRaw);
  const before = Number.isFinite(beforeParam) && beforeParam >= 0 ? beforeParam : fullHistory.length;

  const start = Math.max(0, before - limit);
  const messages = fullHistory.slice(start, before);

  return NextResponse.json({
    messages,
    hasMore: start > 0,
    nextBefore: start,
  });
}
