import client from "@/rag/azureClient";
import { MANUAL_DIRECTORY } from "@/almendro/loaders/loadManualDirectory";

// The corpus is 100% German with its own specific, narrow terminology, and
// both retrieval stages are wording-sensitive: BM25 needs literal token
// overlap, and even a multilingual embedding model's topical similarity
// isn't precise enough to reliably separate closely related concepts across
// 3406 chunks (e.g. "Auftrag" - a sales order, covered in auf_pos.pdf - vs.
// "Bestellung" - a purchase order, covered in mawi_best.pdf - are similar
// enough thematically to blur together). A single "best guess" rewrite is
// also unreliable - measured directly, one rewrite attempt confidently
// produced "Kundenauftrag anlegen", but "Kundenauftrag" appears exactly
// once in the entire corpus. Generating several DIFFERENT guesses instead
// of committing to one hedges against any single guess being wrong; all
// variants get searched and merged (see answer.ts), so this only needs one
// of them to land on the right vocabulary.
const DIRECTORY_BLOCK = MANUAL_DIRECTORY.map((entry) => `- ${entry.doc_id}: ${entry.description}`).join("\n");

function buildPrompt(query: string): string {
  return `You are helping search a German-language ERP system's (ALMENDRO) user manuals. Below is a directory of what each manual covers, in the manuals' own words:

${DIRECTORY_BLOCK}

A visitor asked (in any language): "${query}"

You don't know exactly which German term these manuals use for this concept - generate 4 DIFFERENT short German search phrases, each guessing a different plausible terminology angle (different specific nouns/verbs a German ERP manual might use), to maximize the chance at least one matches the manuals' actual wording. Prefer concrete, specific nouns over generic phrasing.

Return ONLY a JSON array of 4 strings, no explanation, no code fences.`;
}

export async function expandQueryForRetrieval(query: string): Promise<string[]> {
  try {
    const response = await client.chat.completions.create({
      model: "o4-mini",
      messages: [{ role: "user", content: buildPrompt(query) }],
    });

    const raw = response.choices[0]?.message?.content?.trim() || "[]";
    const cleaned = raw
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const variants = Array.isArray(parsed) ? parsed.filter((q): q is string => typeof q === "string" && q.trim().length > 0) : [];
    return variants.length > 0 ? variants : [query];
  } catch (error) {
    console.error("ALMENDRO query expansion error:", error);
    return [query];
  }
}
