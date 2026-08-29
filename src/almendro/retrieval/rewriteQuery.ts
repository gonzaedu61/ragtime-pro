import client from "@/almendro/azureClient";
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

First check the directory above for any manual whose description already closely names this concept - if you find one, one of your four phrases MUST be that manual's own description text, taken verbatim, not paraphrased or elaborated. The directory is already in the manuals' actual wording; inventing a more specific-sounding compound term (e.g. turning "Bestellung" into "Materialbestellung anlegen" or "Beschaffungsauftrag erstellen") throws away a match you already have and searches for wording the manual may not actually use. Only invent guesses for concepts the directory doesn't already name.

The chapter lists in parentheses are that manual's own UI-panel/data-area structure (Kopfdaten, Stamm, Spezifikation, Positionen...), not task descriptions - these manuals document "how to create a new X" under a structural chapter like "Kopfdaten" rather than one literally named "anlegen"/"erstellen", so when the visitor is asking how to create or start something, try combining the matching manual's own subject noun with a relevant chapter name (e.g. for a manual about "Angebotsverwaltung" with a "Kopfdaten" chapter, search "Angebot Kopfdaten", not bare "Kopfdaten" alone) - the subject noun keeps the search specific to that manual, since "Kopfdaten" by itself is a generic term shared across many unrelated manuals and won't discriminate.

Separately: when the visitor is asking how to find, select, or edit an EXISTING record (not create a new one), the "basis" manual's "Suchfunktionen" chapter documents that mechanism once for every screen in the system, rather than each manual repeating it - include "Suchfunktionen" as one of your four phrases for that kind of question, since no other manual will name it.

Generate 4 DIFFERENT short German search phrases in total, each covering a different plausible angle, to maximize the chance at least one matches the manuals' actual wording.

Return ONLY a JSON array of 4 strings, no explanation, no code fences.`;
}

export async function expandQueryForRetrieval(query: string): Promise<string[]> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
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
