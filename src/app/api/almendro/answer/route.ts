import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/almendro/session/readSession";
import { createSession } from "@/almendro/session/createSession";
import { updateSession } from "@/almendro/session/updateSession";
import { ALMENDRO_SESSION_COOKIE, ALMENDRO_SESSION_COOKIE_MAX_AGE } from "@/almendro/session/cookie";
import { generateAlmendroAnswer } from "@/almendro/answer";
import type { AlmendroMessage } from "@/almendro/prompts/answerPrompt";

// Higher than the main site's equivalent (30s) - this pipeline does an
// extra full LLM round-trip up front (query expansion), searches a corpus
// ~17x larger, and retries the main call once on malformed JSON. Measured
// in production: real requests were hitting Vercel's 30s function timeout
// (Runtime Timeout Error), especially on a cold start where the local
// embedding model also has to load.
export const maxDuration = 60;

// How many prior turns get sent to the model as conversational context -
// the full transcript is still stored/displayed in full, this only caps
// what's fed into each new prompt.
const MAX_HISTORY_MESSAGES = 12;

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(ALMENDRO_SESSION_COOKIE)?.value ?? null;
  const session = sessionId ? await readSession(sessionId) : null;

  return NextResponse.json({ history: session?.history ?? [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const query = body?.query;

  if (typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ error: "Missing required field: query" }, { status: 400 });
  }

  const existingSessionId = request.cookies.get(ALMENDRO_SESSION_COOKIE)?.value ?? null;
  const session = (existingSessionId ? await readSession(existingSessionId) : null) ?? (await createSession());

  const promptHistory: AlmendroMessage[] = session.history
    .slice(-MAX_HISTORY_MESSAGES)
    .map(({ role, content }) => ({ role, content }));

  let result;
  try {
    result = await generateAlmendroAnswer(query, promptHistory);
  } catch (error) {
    console.error("ALMENDRO answer generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong generating a response. Please try again." },
      { status: 502 }
    );
  }

  const updatedSession = await updateSession(session.sessionId, {
    history: [
      ...session.history,
      { role: "user", content: query },
      {
        role: "assistant",
        content: result.answer,
        sources: result.sources,
        followUpTopics: result.followUpTopics,
      },
    ],
  });

  const response = NextResponse.json({
    answer: result.answer,
    sources: result.sources,
    followUpTopics: result.followUpTopics,
  });

  response.cookies.set(ALMENDRO_SESSION_COOKIE, updatedSession.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/almendro",
    maxAge: ALMENDRO_SESSION_COOKIE_MAX_AGE,
  });

  return response;
}
