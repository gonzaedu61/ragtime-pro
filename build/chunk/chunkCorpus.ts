import { readdir, mkdir, writeFile } from "fs/promises";
import path from "path";
import { extractSource } from "./extractSources";
import { chunkBlocks } from "./chunkText";

const SOURCE_DIR = path.join(process.cwd(), "docs", "RAG_Source_Docs");
const OUTPUT_DIR = path.join(process.cwd(), "rag_data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "chunks.json");
const SUPPORTED_EXTENSIONS = new Set([".md", ".pdf"]);

interface OutputChunk {
  id: string;
  doc_id: string;
  section: string;
  text: string;
  tokens: number;
}

async function main() {
  const entries = await readdir(SOURCE_DIR);
  const files = entries.filter((name) => SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase()));

  if (files.length === 0) {
    throw new Error(`No supported source files found in ${SOURCE_DIR}`);
  }

  const output: OutputChunk[] = [];
  let counter = 1;

  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    const source = await extractSource(filePath);
    const rawChunks = chunkBlocks(source.blocks);

    console.log(`${file} -> ${rawChunks.length} chunks (doc_id: ${source.docId})`);

    for (const chunk of rawChunks) {
      output.push({
        id: `chunk_${String(counter).padStart(4, "0")}`,
        doc_id: source.docId,
        section: chunk.section,
        text: chunk.text,
        tokens: chunk.tokens,
      });
      counter += 1;
    }
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`\nWrote ${output.length} chunks to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error("chunkCorpus failed:", error);
  process.exit(1);
});
