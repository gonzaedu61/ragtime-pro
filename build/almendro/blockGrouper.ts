import type { RawSpan, LogicalBlock, BlockKind } from "./types";
import type { PageSize } from "./extractSpans";

// Node port of python/Chunker.py's block-construction stage. PyMuPDF (used
// by the Python version) hands over ready-made block/line numbers and a
// bold flag per span; pdfjs-dist's getTextContent() gives neither, so both
// are reconstructed here:
//   - "lines" are rebuilt by clustering spans with near-identical baselines
//     (same technique/tolerance the Python code already uses for its own
//     TOC line-merging: `round(y / 3)`).
//   - "bold" is approximated by which fontName IDs co-occur with
//     above-body-size text in this document, since pdfjs only exposes an
//     opaque per-document font alias (e.g. "g_d0_f2"), not a real bold bit.
//
// IMPORTANT coordinate note: PDF-native space (what pdfjs returns) has its
// origin at the bottom-left with y increasing upward - the opposite of
// PyMuPDF's bbox convention (origin top-left, y increasing downward) that
// the Python thresholds below were written against. Every top/bottom zone
// check here is deliberately flipped from its Python counterpart to
// compensate.

const REMOVE_HEADERS = true;
const REMOVE_FOOTERS = true;
const HEADER_FOOTER_HEIGHT_RATIO = 0.08;
const MIN_REPEAT_COUNT = 3;

const MAX_TOC_PAGES = 10;
const TOC_LIKE_RATIO_THRESHOLD = 0.2;

const MAX_WORDS_HEADING = 50;

const LINE_Y_TOLERANCE = 3;

// A same-word split across two adjacent items (pdfjs sometimes breaks a
// word at a mid-word font/style change) leaves a near-zero gap (~0.3pt in
// practice); a genuine inter-word space leaves a much larger one (~2.5pt+).
// Scaled by font size so this holds across the different heading/body sizes
// in a document, not just its ~10pt body text.
const SPACE_GAP_RATIO = 0.15;

// How much larger than body text a line's font must be to count as a
// heading candidate on size alone. 1.05 (5%) was too close to this corpus's
// body-to-emphasis ratio (~10pt body vs ~11pt bolded contact/legal text),
// misclassifying non-heading emphasis as a heading; real headings here run
// at least 20% larger (12pt+ over a 10pt body).
const HEADING_SIZE_RATIO = 1.15;

const HEADING_REGEX = /^(?:[0-9]+(?:\.[0-9]+)*)?\s*[A-ZÄÖÜ][A-ZÄÖÜ0-9\s\-.,]{3,}$/;
const LIST_BULLET_REGEX = /^(\s*[-*•]\s+|\s*[0-9]+\.\s+)/;
const NUMBERED_HEADING_PREFIX = /^\s*(\d+(?:\.\d+)*)(?:[.)])?\s+/;

interface Line {
  text: string;
  fontSize: number;
  fontName: string;
  x0: number;
  y0: number;
  x1: number;
  pageNum: number;
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

// Joins a line's items in x-order, inserting a space only where the gap
// between consecutive items indicates a real inter-word space rather than
// pdfjs having split one word across two adjacent items (see SPACE_GAP_RATIO
// above). Concatenating everything with an unconditional space breaks words
// like "Erfor" + "dernissen" apart; concatenating with none merges real word
// boundaries like "3 " + "Übersicht" together - the gap is what tells them
// apart.
function joinLineText(sortedSpans: RawSpan[]): string {
  let result = "";
  for (let i = 0; i < sortedSpans.length; i++) {
    const span = sortedSpans[i];
    if (i > 0) {
      const prev = sortedSpans[i - 1];
      const gap = span.x0 - prev.x1;
      if (gap > prev.fontSize * SPACE_GAP_RATIO) result += " ";
    }
    result += span.text;
  }
  return result;
}

function spanSignature(s: RawSpan): string {
  const text = s.text.trim();
  const textKey = /^\d+$/.test(text) ? "PAGE_NUMBER" : text;
  return `${textKey}|${Math.round(s.fontSize * 10) / 10}|${Math.round(s.x0)}`;
}

function detectRepeatedHeaderFooterSignatures(spans: RawSpan[]): Set<string> {
  const sigPages = new Map<string, Set<number>>();
  for (const s of spans) {
    const sig = spanSignature(s);
    if (!sigPages.has(sig)) sigPages.set(sig, new Set());
    sigPages.get(sig)!.add(s.pageNum);
  }
  const repeated = new Set<string>();
  for (const [sig, pages] of sigPages) {
    if (pages.size >= MIN_REPEAT_COUNT) repeated.add(sig);
  }
  return repeated;
}

function filterHeadersFooters(spans: RawSpan[], pageSizes: Map<number, PageSize>): RawSpan[] {
  if (!REMOVE_HEADERS && !REMOVE_FOOTERS) return spans;

  const repeated = detectRepeatedHeaderFooterSignatures(spans);
  const filtered: RawSpan[] = [];

  for (const s of spans) {
    const sig = spanSignature(s);
    if (!repeated.has(sig)) {
      filtered.push(s);
      continue;
    }

    const pageHeight = pageSizes.get(s.pageNum)?.height ?? 0;
    // Flipped vs Python: PDF space y increases upward, so "top of page" (the
    // header zone) is the HIGH end of the y range, not the low end.
    const inHeaderZone = s.y0 >= pageHeight * (1 - HEADER_FOOTER_HEIGHT_RATIO);
    const inFooterZone = s.y0 <= pageHeight * HEADER_FOOTER_HEIGHT_RATIO;

    if ((REMOVE_HEADERS && inHeaderZone) || (REMOVE_FOOTERS && inFooterZone)) continue;
    filtered.push(s);
  }

  return filtered;
}

function mergeIntoLines(spans: RawSpan[]): Line[] {
  const byPage = new Map<number, RawSpan[]>();
  for (const s of spans) {
    if (!byPage.has(s.pageNum)) byPage.set(s.pageNum, []);
    byPage.get(s.pageNum)!.push(s);
  }

  const lines: Line[] = [];

  for (const [pageNum, pageSpans] of byPage) {
    const groups = new Map<number, RawSpan[]>();
    for (const s of pageSpans) {
      const key = Math.round(s.y0 / LINE_Y_TOLERANCE);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(s);
    }

    for (const group of groups.values()) {
      group.sort((a, b) => a.x0 - b.x0);
      const text = normalize(joinLineText(group));
      if (!text) continue;

      // The line's own font size/name is taken from its largest span (matches
      // the Python code's `line_font = max(s.font_size for s in current)`
      // used for heading detection), so a numeric prefix rendered slightly
      // smaller than its title text doesn't drag the whole line down.
      const dominant = group.reduce((a, b) => (b.fontSize > a.fontSize ? b : a));

      lines.push({
        text,
        fontSize: dominant.fontSize,
        fontName: dominant.fontName,
        x0: group[0].x0,
        y0: group[0].y0,
        x1: group[group.length - 1].x1,
        pageNum,
      });
    }
  }

  // Reading order: top to bottom (descending y in PDF space) within each
  // page, pages in ascending order.
  lines.sort((a, b) => a.pageNum - b.pageNum || b.y0 - a.y0);
  return lines;
}

function detectTocPages(spans: RawSpan[], pageSizes: Map<number, PageSize>): Set<number> {
  const byPage = new Map<number, RawSpan[]>();
  for (const s of spans) {
    if (s.pageNum > MAX_TOC_PAGES) continue;
    if (!byPage.has(s.pageNum)) byPage.set(s.pageNum, []);
    byPage.get(s.pageNum)!.push(s);
  }

  const tocPages = new Set<number>();

  for (const [pageNum, pageSpans] of byPage) {
    const pageSize = pageSizes.get(pageNum);
    if (!pageSize) continue;
    const { width: pageWidth, height: pageHeight } = pageSize;

    const groups = new Map<number, RawSpan[]>();
    for (const s of pageSpans) {
      const key = Math.round(s.y0 / LINE_Y_TOLERANCE);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(s);
    }

    const mergedLines: { text: string; x1: number; y0: number }[] = [];
    for (const group of groups.values()) {
      group.sort((a, b) => a.x0 - b.x0);
      const text = normalize(joinLineText(group));
      if (!text) continue;
      mergedLines.push({ text, x1: group[group.length - 1].x1, y0: group[0].y0 });
    }

    let tocLike = 0;
    const total = mergedLines.length;

    for (const { text, x1, y0 } of mergedLines) {
      const hasLeader =
        text.includes("...") ||
        text.includes("___") ||
        text.includes("···") ||
        text.includes("—") ||
        text.includes("–") ||
        /\.{5,}/.test(text);

      const endsWithNumber = /\d+$/.test(text);
      const hasTitleText = /[A-Za-zÄÖÜäöüß]/.test(text);
      const multiLevelPrefix = /^\d+(?:\.\d+){1,6}\b/.test(text);

      const patternA = hasLeader && endsWithNumber && (hasTitleText || multiLevelPrefix);

      const isRightNumber =
        endsWithNumber && /^\d+$/.test(text) && x1 > pageWidth * 0.65 && y0 > pageHeight * 0.05 && y0 < pageHeight * 0.95;

      let patternB = false;
      if (isRightNumber) {
        for (const other of mergedLines) {
          if (other.text === text) continue;
          if (Math.abs(other.y0 - y0) < LINE_Y_TOLERANCE && other.text.trim().length > 3) {
            patternB = true;
            break;
          }
        }
      }

      if (patternA || patternB) tocLike += 1;
    }

    if (total > 0 && tocLike / total >= TOC_LIKE_RATIO_THRESHOLD) {
      tocPages.add(pageNum);
    }
  }

  return tocPages;
}

function computeBodyFontSize(lines: Line[]): number {
  const counts = new Map<number, number>();
  for (const l of lines) {
    const rounded = Math.round(l.fontSize * 10) / 10;
    counts.set(rounded, (counts.get(rounded) ?? 0) + 1);
  }
  let best = 0;
  let bestCount = -1;
  for (const [size, count] of counts) {
    if (count > bestCount) {
      best = size;
      bestCount = count;
    }
  }
  return best || 10;
}

// Approximates PyMuPDF's per-span bold flag: any fontName that shows up
// disproportionately often on above-body-size lines is treated as this
// document's "heading font", regardless of its (opaque, per-doc) name.
function detectHeadingFonts(lines: Line[], bodyFontSize: number): Set<string> {
  const larger = lines.filter((l) => l.fontSize > bodyFontSize * HEADING_SIZE_RATIO);
  return new Set(larger.map((l) => l.fontName));
}

function classifyLine(
  line: Line,
  bodyFontSize: number,
  headingFonts: Set<string>
): { kind: BlockKind; headingLevel: number | null } {
  const text = line.text;
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isShort = wordCount <= MAX_WORDS_HEADING;
  const validHeadingEnding = text.endsWith(":") || !/[.;]$/.test(text);
  const largerThanBody = line.fontSize > bodyFontSize * HEADING_SIZE_RATIO;
  const isHeadingFont = headingFonts.has(line.fontName);

  const isHeadingCandidate = HEADING_REGEX.test(text) || isHeadingFont || largerThanBody;

  const numberedMatch = NUMBERED_HEADING_PREFIX.exec(text);
  if (numberedMatch && isHeadingCandidate && isShort && validHeadingEnding) {
    const prefix = numberedMatch[1];
    const level = prefix.split(".").length;
    return { kind: "heading", headingLevel: level };
  }

  if (isHeadingCandidate && isShort && validHeadingEnding) {
    return { kind: "heading", headingLevel: null };
  }

  if (LIST_BULLET_REGEX.test(text)) {
    return { kind: "list_item", headingLevel: null };
  }

  return { kind: "paragraph", headingLevel: null };
}

// Merges wrapped continuation lines into their owning paragraph/list_item
// block. pdfjs gives us individual lines with no block grouping (unlike
// PyMuPDF's ready-made block_no), so a paragraph that wraps to a second
// line would otherwise stay split. A continuation is: same page, small
// vertical gap from the previous line, and itself classified as plain
// "paragraph" text (a wrapped line never starts with a new bullet marker,
// so this also correctly lets a list_item absorb its own wrapped lines
// without turning into a run-on "paragraph").
function mergeWrappedLines(lines: Line[], classifications: { kind: BlockKind; headingLevel: number | null }[]): LogicalBlock[] {
  const blocks: LogicalBlock[] = [];
  let current: LogicalBlock | null = null;
  let currentLastY0 = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { kind, headingLevel } = classifications[i];

    const isWrapContinuation =
      current !== null &&
      current.kind !== "heading" &&
      kind === "paragraph" &&
      line.pageNum === current.pageNum &&
      currentLastY0 - line.y0 < line.fontSize * 1.8;

    if (isWrapContinuation && current) {
      current.text = `${current.text} ${line.text}`.trim();
      currentLastY0 = line.y0;
      continue;
    }

    if (current) blocks.push(current);
    current = {
      kind,
      text: line.text,
      pageNum: line.pageNum,
      fontSize: line.fontSize,
      fontName: line.fontName,
      headingLevel,
      y0: line.y0,
    };
    currentLastY0 = line.y0;
  }

  if (current) blocks.push(current);
  return blocks;
}

function assignFallbackHeadingLevels(blocks: LogicalBlock[]): void {
  const sizes = blocks.filter((b) => b.kind === "heading" && b.headingLevel === null).map((b) => b.fontSize);
  if (sizes.length === 0) return;

  const unique = [...new Set(sizes)].sort((a, b) => b - a);
  const sizeToLevel = new Map(unique.map((size, i) => [size, i + 1]));

  for (const b of blocks) {
    if (b.kind === "heading" && b.headingLevel === null) {
      b.headingLevel = sizeToLevel.get(b.fontSize) ?? 1;
    }
  }
}

function mergeCrossPageParagraphs(blocks: LogicalBlock[], pageSizes: Map<number, PageSize>): LogicalBlock[] {
  const merged: LogicalBlock[] = [];
  let prev: LogicalBlock | null = null;

  for (const b of blocks) {
    if (!prev) {
      prev = { ...b };
      continue;
    }

    const pageHeight = pageSizes.get(b.pageNum)?.height ?? 0;
    // "near top of page" - flipped vs Python: PDF space y increases upward,
    // so being near the top means a HIGH y0, close to pageHeight.
    const nearTop = pageHeight > 0 && b.y0 >= pageHeight - 100;

    const continuation = prev.kind === "paragraph" && b.kind === "paragraph" && b.pageNum === prev.pageNum + 1 && nearTop;

    if (continuation) {
      prev.text = `${prev.text.trimEnd()} ${b.text.trimStart()}`.trim();
    } else {
      merged.push(prev);
      prev = { ...b };
    }
  }

  if (prev) merged.push(prev);
  return merged;
}

export function groupSpansIntoBlocks(
  rawSpans: RawSpan[],
  pageSizes: Map<number, PageSize>
): { blocks: LogicalBlock[]; tocPages: number[] } {
  const withoutHeadersFooters = filterHeadersFooters(rawSpans, pageSizes);

  const tocPages = detectTocPages(withoutHeadersFooters, pageSizes);
  const withoutToc = withoutHeadersFooters.filter((s) => !tocPages.has(s.pageNum));

  const lines = mergeIntoLines(withoutToc);
  const bodyFontSize = computeBodyFontSize(lines);
  const headingFonts = detectHeadingFonts(lines, bodyFontSize);

  const classifications = lines.map((line) => classifyLine(line, bodyFontSize, headingFonts));
  const wrapped = mergeWrappedLines(lines, classifications);

  assignFallbackHeadingLevels(wrapped);
  const merged = mergeCrossPageParagraphs(wrapped, pageSizes);

  return { blocks: merged, tocPages: [...tocPages].sort((a, b) => a - b) };
}
