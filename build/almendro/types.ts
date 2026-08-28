// Node port of python/Chunking_Models.py, adapted for pdfjs-dist's flat
// text-item model (no block/line hierarchy or bold flag like PyMuPDF gives
// the Python version - see extractSpans.ts / blockGrouper.ts for how those
// are reconstructed).

export interface RawSpan {
  text: string;
  fontSize: number;
  fontName: string;
  x0: number;
  y0: number; // baseline, PDF space (origin bottom-left, y increases upward)
  x1: number;
  y1: number;
  pageNum: number; // 1-indexed
}

export type BlockKind = "heading" | "paragraph" | "list_item";

export interface LogicalBlock {
  kind: BlockKind;
  text: string;
  pageNum: number;
  fontSize: number;
  fontName: string;
  headingLevel: number | null;
  // Baseline y (PDF space) of the block's first line - only used internally
  // by the cross-page continuation check, not needed past block-grouping.
  y0: number;
}

export interface AlmendroChunk {
  id: string;
  doc_id: string;
  doc_title: string;
  pages: number[];
  heading_path: string[];
  section: string;
  text: string;
  tokens: number;
}
