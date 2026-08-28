// Same shape as src/rag/utils/tokenize.ts, but keeps German-specific letters
// (ä/ö/ü/ß) instead of stripping them as non-ASCII - the source manuals are
// entirely in German, so the site's own [a-z0-9] tokenizer would corrupt
// most of the vocabulary (e.g. "Übersicht" -> "bersicht").
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zäöüß0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
