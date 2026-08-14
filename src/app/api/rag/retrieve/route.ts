import { NextRequest, NextResponse } from "next/server";
import { hybridSearch } from "@/rag/retrieval/hybrid";
import { rerankCandidates } from "@/rag/retrieval/rerank";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const query = body?.query;

  if (typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ error: "Missing required field: query" }, { status: 400 });
  }

  const candidates = await hybridSearch(query);
  const results = await rerankCandidates(query, candidates);

  return NextResponse.json({
    query,
    results: results.map((result) => ({
      id: result.chunk.id,
      doc_id: result.chunk.doc_id,
      section: result.chunk.section,
      text: result.chunk.text,
      hybridScore: result.hybridScore,
      rerankScore: result.rerankScore,
    })),
  });
}
