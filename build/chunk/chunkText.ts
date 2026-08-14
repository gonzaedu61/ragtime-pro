import { encode, decode } from "gpt-tokenizer";

export interface Block {
  section: string;
  text: string;
}

export interface RawChunk {
  section: string;
  text: string;
  tokens: number;
}

const TARGET_MIN_TOKENS = 200;
const HARD_MAX_TOKENS = 350;
const OVERLAP_TOKENS = 75;

function countTokens(text: string): number {
  return encode(text).length;
}

function takeOverlap(text: string, maxTokens: number): string {
  if (maxTokens <= 0) return "";
  const tokens = encode(text);
  if (tokens.length <= maxTokens) return "";
  return decode(tokens.slice(-maxTokens));
}

// Distributes tokens evenly across the minimum number of pieces needed,
// rather than a fixed HARD_MAX_TOKENS stride, so the last piece never ends
// up as a tiny, useless remainder.
function hardSliceByTokens(text: string): string[] {
  const tokens = encode(text);
  if (tokens.length === 0) return [];

  const numPieces = Math.ceil(tokens.length / HARD_MAX_TOKENS);
  const sizePerPiece = Math.ceil(tokens.length / numPieces);

  const pieces: string[] = [];
  for (let i = 0; i < tokens.length; i += sizePerPiece) {
    pieces.push(decode(tokens.slice(i, i + sizePerPiece)));
  }
  return pieces;
}

function splitOversized(text: string): string[] {
  if (countTokens(text) <= HARD_MAX_TOKENS) return [text];

  const sentences = text.split(/(?<=[.!?])\s+/);
  const pieces: string[] = [];
  let current = "";
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = countTokens(sentence);

    // A "sentence" with no terminal punctuation (bullet/label runs) can itself
    // exceed the hard max - fall back to slicing it by raw token count.
    if (sentenceTokens > HARD_MAX_TOKENS) {
      if (current) {
        pieces.push(current.trim());
        current = "";
        currentTokens = 0;
      }
      pieces.push(...hardSliceByTokens(sentence));
      continue;
    }

    if (currentTokens + sentenceTokens > HARD_MAX_TOKENS && current) {
      pieces.push(current.trim());
      current = "";
      currentTokens = 0;
    }
    current += (current ? " " : "") + sentence;
    currentTokens += sentenceTokens;
  }
  if (current) pieces.push(current.trim());

  return pieces;
}

export function chunkBlocks(blocks: Block[]): RawChunk[] {
  const chunks: RawChunk[] = [];
  let bufferSection = blocks[0]?.section ?? "Untitled";
  let bufferParts: string[] = [];
  let bufferTokens = 0;

  const pushChunk = () => {
    const text = bufferParts.join("\n\n").trim();
    if (text) chunks.push({ section: bufferSection, text, tokens: countTokens(text) });
  };

  for (const block of blocks) {
    for (const piece of splitOversized(block.text)) {
      const pieceTokens = countTokens(piece);
      const sectionChanged = block.section !== bufferSection;
      // Overflow must always force a flush, regardless of whether the target
      // minimum has been reached - HARD_MAX_TOKENS is a hard cap, not a goal.
      const wouldOverflow = bufferParts.length > 0 && bufferTokens + pieceTokens > HARD_MAX_TOKENS;
      const reachedTarget = bufferTokens >= TARGET_MIN_TOKENS;

      if (bufferParts.length > 0 && (wouldOverflow || (sectionChanged && reachedTarget))) {
        const prevText = bufferParts.join("\n\n");
        pushChunk();

        // Cap overlap so overlap + the piece being carried into the new
        // chunk can never itself exceed HARD_MAX_TOKENS.
        const overlapBudget = Math.max(0, HARD_MAX_TOKENS - pieceTokens);
        const overlapText = takeOverlap(prevText, Math.min(OVERLAP_TOKENS, overlapBudget));

        bufferSection = block.section;
        bufferParts = overlapText ? [overlapText] : [];
        bufferTokens = overlapText ? countTokens(overlapText) : 0;
      } else if (bufferParts.length === 0) {
        bufferSection = block.section;
      }

      bufferParts.push(piece);
      bufferTokens += pieceTokens;
    }
  }
  if (bufferParts.length > 0) pushChunk();

  return enforceMaxTokens(chunks);
}

// Running-total bookkeeping above can undercount by a token or two across
// join boundaries (tokenization isn't perfectly additive across "\n\n").
// This pass guarantees the HARD_MAX_TOKENS invariant regardless.
function enforceMaxTokens(chunks: RawChunk[]): RawChunk[] {
  const result: RawChunk[] = [];
  for (const chunk of chunks) {
    if (chunk.tokens <= HARD_MAX_TOKENS) {
      result.push(chunk);
      continue;
    }
    for (const piece of hardSliceByTokens(chunk.text)) {
      result.push({ section: chunk.section, text: piece, tokens: countTokens(piece) });
    }
  }
  return result;
}
