import { readFile } from "fs/promises";
// The main pdfjs-dist build assumes browser APIs (DOMMatrix, Canvas) for some
// code paths - the legacy Node build works headlessly for pure text
// extraction, which is all we need here (no rendering).
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { RawSpan } from "./types";

interface PdfTextItem {
  str: string;
  transform: number[]; // [scaleX, skewX, skewY, scaleY, x, y]
  width: number;
  height: number;
  fontName: string;
}

export interface PageSize {
  width: number;
  height: number;
}

export async function extractSpans(
  filePath: string
): Promise<{ spans: RawSpan[]; numPages: number; pageSizes: Map<number, PageSize> }> {
  const data = new Uint8Array(await readFile(filePath));
  const doc = await pdfjsLib.getDocument({ data, useSystemFonts: true, disableFontFace: true }).promise;

  const spans: RawSpan[] = [];
  const pageSizes = new Map<number, PageSize>();

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    pageSizes.set(pageNum, { width: viewport.width, height: viewport.height });

    const content = await page.getTextContent();

    for (const raw of content.items as PdfTextItem[]) {
      const text = raw.str;
      if (!text || !text.trim()) continue;

      // font size = magnitude of the transform matrix's vertical scale
      // component - robust to the rare rotated/skewed span, unlike just
      // reading transform[3] directly.
      const fontSize = Math.hypot(raw.transform[2], raw.transform[3]) || raw.height || 1;
      const x0 = raw.transform[4];
      const y0 = raw.transform[5];

      spans.push({
        text,
        fontSize,
        fontName: raw.fontName,
        x0,
        y0,
        x1: x0 + (raw.width || 0),
        y1: y0 + fontSize,
        pageNum,
      });
    }
  }

  return { spans, numPages: doc.numPages, pageSizes };
}
