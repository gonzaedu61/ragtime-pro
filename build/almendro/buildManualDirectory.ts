import { readFile, writeFile } from "fs/promises";
import path from "path";

// ws_info.pdf is itself a one-line-per-manual directory ("Dateiname X.pdf
// Beschreibung Y") of what every other manual in the corpus covers - the
// exact same role src/lib/pageDirectory.ts plays for the main site. Reusing
// it here (rather than hand-writing descriptions) means the directory used
// for query rewriting (see src/almendro/retrieval/rewriteQuery.ts) stays in
// the manuals' own words, and updates automatically if ws_info.pdf changes.
const CHUNKS_FILE = path.join(process.cwd(), "rag_data_almendro", "chunks.json");
const OUTPUT_FILE = path.join(process.cwd(), "rag_data_almendro", "manualDirectory.json");

interface Chunk {
  doc_id: string;
  text: string;
  heading_path: string[];
}

export interface ManualEntry {
  doc_id: string;
  description: string;
}

const ENTRY_PATTERN = /Dateiname\s+(\S+?)\.pdf\s+Beschreibung\s+([\s\S]*?)(?=\s*Dateiname\s+\S+?\.pdf\s+Beschreibung|$)/g;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractEntries(chunks: Chunk[]): ManualEntry[] {
  const entries: ManualEntry[] = [];

  for (const chunk of chunks) {
    for (const match of chunk.text.matchAll(ENTRY_PATTERN)) {
      const docId = slugify(match[1]);
      const description = match[2].trim();
      if (docId && description) entries.push({ doc_id: docId, description });
    }
  }

  // A manual can legitimately be mentioned more than once (ws_info.pdf's
  // "Vorversionen" chapter re-lists some filenames for older releases) -
  // keep the first (current-version) description for each doc_id.
  const seen = new Map<string, ManualEntry>();
  for (const entry of entries) {
    if (!seen.has(entry.doc_id)) seen.set(entry.doc_id, entry);
  }
  return [...seen.values()];
}

// ws_info.pdf's one-line-per-manual descriptions ("Angebotsverwaltung",
// "Bestellung") name the TOPIC of a manual but not its internal structure -
// and these manuals are organized by UI panel/data area (Kopfdaten, Stamm,
// Spezifikation, Positionen...), not by task. Measured directly: a visitor
// asking "how do I prepare a quote" needs the query-expansion LLM to guess
// "Kopfdaten" (header data) - the chapter that actually documents starting
// a new record via the "New" action - but nothing told it that word exists,
// so it kept guessing task-shaped phrases ("Angebot erstellen") that don't
// match the manual's own structural vocabulary. Every entry's description is
// extended with that manual's own top-level chapter titles so this
// structural vocabulary is visible up front, not just its topic.
function chapterListByDoc(chunks: Chunk[]): Map<string, string[]> {
  const headingsByDoc = new Map<string, Set<string>>();
  for (const chunk of chunks) {
    const topHeading = chunk.heading_path[0];
    if (!topHeading) continue;
    if (!headingsByDoc.has(chunk.doc_id)) headingsByDoc.set(chunk.doc_id, new Set());
    headingsByDoc.get(chunk.doc_id)!.add(topHeading.replace(/^\d+(\.\d+)*\s*/, ""));
  }

  const result = new Map<string, string[]>();
  for (const [docId, headings] of headingsByDoc) {
    result.set(docId, [...headings].slice(0, 10));
  }
  return result;
}

async function main() {
  const chunks: Chunk[] = JSON.parse(await readFile(CHUNKS_FILE, "utf8"));
  const wsInfoChunks = chunks.filter((c) => c.doc_id === "ws-info");

  if (wsInfoChunks.length === 0) {
    throw new Error(`No ws-info chunks found in ${CHUNKS_FILE}. Run "npm run rag:almendro:chunk" first.`);
  }

  const fromTable = extractEntries(wsInfoChunks);
  const knownDocIds = new Set(fromTable.map((e) => e.doc_id));
  const chapters = chapterListByDoc(chunks);

  // Manuals absent from ws_info.pdf's own table (e.g. auf_pos.pdf) still need
  // an entry - the chapter list alone becomes their description in that case.
  const allDocIds = new Set(chunks.map((c) => c.doc_id));
  allDocIds.delete("ws-info");

  const directory: ManualEntry[] = [...allDocIds].map((docId) => {
    const topicDescription = fromTable.find((e) => e.doc_id === docId)?.description;
    const chapterList = (chapters.get(docId) ?? []).join(", ");
    const description = topicDescription
      ? `${topicDescription} (chapters: ${chapterList})`
      : chapterList;
    return { doc_id: docId, description };
  });

  await writeFile(OUTPUT_FILE, JSON.stringify(directory, null, 2));
  console.log(
    `Wrote ${directory.length} manual directory entries (${knownDocIds.size} with a ws_info.pdf topic description, all with their own chapter list) to ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main().catch((error) => {
  console.error("buildManualDirectory failed:", error);
  process.exit(1);
});
