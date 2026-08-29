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

// ws_info.pdf's own table is incomplete - it's missing at least one manual
// entirely (auf_pos.pdf, the sales-order-line-item manual, has no row there
// at all). A doc_id with no directory entry is invisible to the query
// expansion LLM (rewriteQuery.ts), which then has no way to guess that
// manual's own vocabulary and keeps producing generic misses. Guarantee
// every doc_id that actually exists in the corpus gets an entry, falling
// back to that document's own chapter headings (its most reliable
// indication of its content, in its own words) when ws_info.pdf is silent
// on it.
function buildFallbackEntries(chunks: Chunk[], known: Set<string>): ManualEntry[] {
  const headingsByDoc = new Map<string, Set<string>>();
  for (const chunk of chunks) {
    if (known.has(chunk.doc_id)) continue;
    const topHeading = chunk.heading_path[0];
    if (!topHeading) continue;
    if (!headingsByDoc.has(chunk.doc_id)) headingsByDoc.set(chunk.doc_id, new Set());
    headingsByDoc.get(chunk.doc_id)!.add(topHeading.replace(/^\d+(\.\d+)*\s*/, ""));
  }

  return [...headingsByDoc.entries()].map(([docId, headings]) => ({
    doc_id: docId,
    description: [...headings].slice(0, 8).join(", "),
  }));
}

async function main() {
  const chunks: Chunk[] = JSON.parse(await readFile(CHUNKS_FILE, "utf8"));
  const wsInfoChunks = chunks.filter((c) => c.doc_id === "ws-info");

  if (wsInfoChunks.length === 0) {
    throw new Error(`No ws-info chunks found in ${CHUNKS_FILE}. Run "npm run rag:almendro:chunk" first.`);
  }

  const fromTable = extractEntries(wsInfoChunks);
  const knownDocIds = new Set(fromTable.map((e) => e.doc_id));
  const fallback = buildFallbackEntries(chunks, knownDocIds);
  const directory = [...fromTable, ...fallback];

  await writeFile(OUTPUT_FILE, JSON.stringify(directory, null, 2));
  console.log(
    `Wrote ${directory.length} manual directory entries (${fromTable.length} from ws_info.pdf's table, ${fallback.length} derived from headings) to ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main().catch((error) => {
  console.error("buildManualDirectory failed:", error);
  process.exit(1);
});
