import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { tokenize } from "@/almendro/utils/tokenize";

const CHUNKS_FILE = path.join(process.cwd(), "rag_data_almendro", "chunks.json");
const OUTPUT_FILE = path.join(process.cwd(), "rag_data_almendro", "bm25.json");
const EPSILON = 0.25;

interface Chunk {
  id: string;
  text: string;
  heading_path: string[];
}

// See embedAlmendro.ts's embeddingInput() for why: a chunk's body text
// frequently never restates the concept named by its own heading, so
// indexing text alone leaves BM25 with zero lexical overlap for exactly the
// terms that should match it.
function indexInput(chunk: Chunk): string {
  return `${chunk.heading_path.join(" > ")}\n${chunk.text}`;
}

interface Bm25Index {
  doc_ids: string[];
  tokenized_docs: string[][];
  idf: Record<string, number>;
  avgdl: number;
}

function buildIndex(chunks: Chunk[]): Bm25Index {
  const tokenizedDocs = chunks.map((chunk) => tokenize(indexInput(chunk)));
  const docIds = chunks.map((chunk) => chunk.id);
  const corpusSize = tokenizedDocs.length;

  const docFreq = new Map<string, number>();
  for (const tokens of tokenizedDocs) {
    for (const term of new Set(tokens)) {
      docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
    }
  }

  const idf: Record<string, number> = {};
  const negativeTerms: string[] = [];
  let idfSum = 0;

  for (const [term, freq] of docFreq) {
    const value = Math.log(corpusSize - freq + 0.5) - Math.log(freq + 0.5);
    idf[term] = value;
    idfSum += value;
    if (value < 0) negativeTerms.push(term);
  }

  const averageIdf = idfSum / docFreq.size;
  const eps = EPSILON * averageIdf;
  for (const term of negativeTerms) {
    idf[term] = eps;
  }

  const totalLength = tokenizedDocs.reduce((sum, tokens) => sum + tokens.length, 0);
  const avgdl = corpusSize > 0 ? totalLength / corpusSize : 0;

  return { doc_ids: docIds, tokenized_docs: tokenizedDocs, idf, avgdl };
}

async function main() {
  const chunks: Chunk[] = JSON.parse(await readFile(CHUNKS_FILE, "utf8"));

  if (chunks.length === 0) {
    throw new Error(`No chunks found in ${CHUNKS_FILE}. Run "npm run rag:almendro:chunk" first.`);
  }

  const index = buildIndex(chunks);

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(index, null, 2));

  console.log(
    `Wrote BM25 index for ${chunks.length} chunks (${Object.keys(index.idf).length} unique terms, avgdl=${index.avgdl.toFixed(1)}) to ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main().catch((error) => {
  console.error("bm25Almendro failed:", error);
  process.exit(1);
});
