import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { embedQuery } from "@/almendro/loaders/loadEmbeddingModel";

const CHUNKS_FILE = path.join(process.cwd(), "rag_data_almendro", "chunks.json");
const OUTPUT_FILE = path.join(process.cwd(), "rag_data_almendro", "embeddings.json");

interface Chunk {
  id: string;
  text: string;
  heading_path: string[];
}

interface EmbeddingRecord {
  id: string;
  embedding: number[];
}

// Many chunks' body text never states the concept its heading names (e.g. a
// paragraph about entering a "Positionsnummer"/"Artikelnummer" whose heading
// is "Auftragspositionen" - the word "Auftrag" never appears in the text
// itself). Embedding the text alone makes such chunks topically invisible to
// dense search for exactly the query terms that should find them.
// Prepending the heading path restores that context.
function embeddingInput(chunk: Chunk): string {
  return `${chunk.heading_path.join(" > ")}\n${chunk.text}`;
}

async function main() {
  const chunks: Chunk[] = JSON.parse(await readFile(CHUNKS_FILE, "utf8"));

  if (chunks.length === 0) {
    throw new Error(`No chunks found in ${CHUNKS_FILE}. Run "npm run rag:almendro:chunk" first.`);
  }

  const output: EmbeddingRecord[] = [];

  for (const [index, chunk] of chunks.entries()) {
    const embedding = await embedQuery(embeddingInput(chunk));
    output.push({ id: chunk.id, embedding });

    if ((index + 1) % 25 === 0 || index === chunks.length - 1) {
      console.log(`Embedded ${index + 1}/${chunks.length}`);
    }
  }

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(
    `\nWrote ${output.length} embeddings (dim=${output[0]?.embedding.length ?? 0}) to ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main().catch((error) => {
  console.error("embedAlmendro failed:", error);
  process.exit(1);
});
