import { readdir, mkdir, writeFile } from "fs/promises";
import path from "path";
import { extractSpans } from "./extractSpans";
import { groupSpansIntoBlocks } from "./blockGrouper";
import { assembleChunks } from "./assembleChunks";
import type { AlmendroChunk } from "./types";

const SOURCE_DIR = path.join(process.cwd(), "docs", "ALMENDRO_Manuals");
const OUTPUT_DIR = path.join(process.cwd(), "rag_data_almendro");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "chunks.json");

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleize(name: string): string {
  return name.replace(/[_-]+/g, " ").trim();
}

export async function chunkDocument(filePath: string): Promise<{ chunks: AlmendroChunk[]; tocPages: number[]; numPages: number }> {
  const base = path.basename(filePath, path.extname(filePath));
  const docId = slugify(base);
  const docTitle = titleize(base);

  const { spans, numPages, pageSizes } = await extractSpans(filePath);
  const { blocks, tocPages } = groupSpansIntoBlocks(spans, pageSizes);
  const chunks = assembleChunks(blocks, docId, docTitle);

  return { chunks, tocPages, numPages };
}

async function main() {
  const entries = await readdir(SOURCE_DIR);
  const pdfFiles = entries.filter((name) => path.extname(name).toLowerCase() === ".pdf").sort();

  if (pdfFiles.length === 0) {
    throw new Error(`No PDF files found in ${SOURCE_DIR}`);
  }

  const output: AlmendroChunk[] = [];

  for (const file of pdfFiles) {
    const filePath = path.join(SOURCE_DIR, file);
    const { chunks, tocPages, numPages } = await chunkDocument(filePath);
    console.log(
      `${file} -> ${numPages} pages, TOC pages: [${tocPages.join(", ")}], ${chunks.length} chunks`
    );
    output.push(...chunks);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`\nWrote ${output.length} chunks to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error("chunkAlmendro failed:", error);
  process.exit(1);
});
