import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { embedQuery } from "@/rag/loaders/loadEmbeddingModel";

const CHUNKS_FILE = path.join(process.cwd(), "rag_data", "chunks.json");
const OUTPUT_FILE = path.join(process.cwd(), "rag_data", "embeddings.json");

interface Chunk {
  id: string;
  text: string;
}

interface EmbeddingRecord {
  id: string;
  embedding: number[];
}

async function main() {
  const chunks: Chunk[] = JSON.parse(await readFile(CHUNKS_FILE, "utf8"));

  if (chunks.length === 0) {
    throw new Error(`No chunks found in ${CHUNKS_FILE}. Run "npm run rag:chunk" first.`);
  }

  const output: EmbeddingRecord[] = [];

  for (const [index, chunk] of chunks.entries()) {
    const embedding = await embedQuery(chunk.text);
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
  console.error("generateEmbeddings failed:", error);
  process.exit(1);
});
