import { encode } from "gpt-tokenizer";
import type { LogicalBlock, AlmendroChunk } from "./types";

// Node port of python/Chunker.py's _create_chunks. MIN_TOKENS from the
// Python source is intentionally not ported: reading that function, it's
// declared but never actually used to force merging past a semantic
// boundary - its own comment says as much ("We do NOT merge across semantic
// boundaries just to reach a minimum size"), so MAX_TOKENS is the only real
// constraint.
const MAX_TOKENS = 1500;

// Heading-level threshold matching Chunker.py: numbered headings at or
// above this depth (e.g. "3.1.2" = level 3) still force a chunk break;
// deeper ones (rare in these manuals) are folded in as inline text instead.
const MIN_HEADING_LEVEL_FOR_CHUNK_BREAK = 4;

const NUMBERED_HEADING_PREFIX = /^\s*(\d+(?:\.\d+)*)(?:[.)])?\s+/;

function countTokens(text: string): number {
  return encode(text).length;
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function assembleChunks(blocks: LogicalBlock[], docId: string, docTitle: string): AlmendroChunk[] {
  const chunks: AlmendroChunk[] = [];
  let currentBlocks: LogicalBlock[] = [];
  let currentPages = new Set<number>();
  let headingPath: string[] = [];
  let chunkIndex = 1;

  const flush = () => {
    if (currentBlocks.length === 0) return;

    const nonHeading = currentBlocks.filter((b) => b.kind !== "heading");
    if (nonHeading.length === 0) {
      currentBlocks = [];
      currentPages = new Set();
      return;
    }

    const text = normalize(currentBlocks.map((b) => b.text).join(" "));
    if (!text) {
      currentBlocks = [];
      currentPages = new Set();
      return;
    }

    chunks.push({
      id: `${docId}_${String(chunkIndex).padStart(4, "0")}`,
      doc_id: docId,
      doc_title: docTitle,
      pages: [...currentPages].sort((a, b) => a - b),
      heading_path: [...headingPath],
      section: headingPath[headingPath.length - 1] ?? docTitle,
      text,
      tokens: countTokens(text),
    });

    chunkIndex += 1;
    currentBlocks = [];
    currentPages = new Set();
  };

  const isTextual = (kind: LogicalBlock["kind"]) => kind === "paragraph" || kind === "list_item";

  for (const block of blocks) {
    if (block.kind === "heading") {
      const numberedMatch = NUMBERED_HEADING_PREFIX.exec(block.text);
      const level = block.headingLevel ?? 1;
      const breakHere = numberedMatch ? level <= MIN_HEADING_LEVEL_FOR_CHUNK_BREAK : true;

      if (breakHere) flush();

      headingPath = headingPath.slice(0, level - 1);
      headingPath.push(block.text);

      if (breakHere) {
        currentBlocks = [block];
        currentPages = new Set([block.pageNum]);
      } else {
        currentBlocks.push(block);
        currentPages.add(block.pageNum);
      }
      continue;
    }

    if (currentBlocks.length > 0) {
      const last = currentBlocks[currentBlocks.length - 1];

      if (block.pageNum !== last.pageNum) flush();

      if (currentBlocks.length > 0) {
        const lastKind = currentBlocks[currentBlocks.length - 1].kind;
        if (!(isTextual(lastKind) && isTextual(block.kind)) && block.kind !== lastKind) {
          flush();
        }
      }
    }

    if (currentBlocks.length > 0) {
      const candidateText = normalize([...currentBlocks, block].map((b) => b.text).join(" "));
      if (countTokens(candidateText) > MAX_TOKENS) {
        flush();
        currentBlocks = [block];
        currentPages = new Set([block.pageNum]);
        continue;
      }
    }

    currentBlocks.push(block);
    currentPages.add(block.pageNum);
  }

  flush();
  return chunks;
}
