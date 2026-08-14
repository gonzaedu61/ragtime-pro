import { readFile } from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import type { Block } from "./chunkText";

export interface SourceDoc {
  docId: string;
  title: string;
  blocks: Block[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toMarkdownBlocks(raw: string, fallbackSection: string): Block[] {
  const blocks: Block[] = [];
  let section = fallbackSection;

  const paragraphs = raw.split(/\n{2,}/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^#{1,6}\s+(.*)$/);
    if (headingMatch) {
      section = headingMatch[1].replace(/[`*]/g, "").trim();
      continue;
    }

    blocks.push({ section, text: trimmed.replace(/\s+/g, " ") });
  }

  return blocks;
}

function toPlainTextBlocks(raw: string, fallbackSection: string): Block[] {
  const blocks: Block[] = [];
  let section = fallbackSection;

  const paragraphs = raw
    .split(/\n{2,}|\f/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  paragraphs.forEach((para, index) => {
    const isLast = index === paragraphs.length - 1;
    const looksLikeHeading = !isLast && para.length <= 80 && !/[.!?]$/.test(para);

    if (looksLikeHeading) {
      section = para;
      return;
    }

    blocks.push({ section, text: para });
  });

  return blocks;
}

export async function extractSource(filePath: string): Promise<SourceDoc> {
  const base = path.basename(filePath);
  const ext = path.extname(base).toLowerCase();
  const title = base.slice(0, -ext.length);
  const docId = slugify(title);

  if (ext === ".md") {
    const raw = await readFile(filePath, "utf8");
    return { docId, title, blocks: toMarkdownBlocks(raw, title) };
  }

  if (ext === ".pdf") {
    const buffer = await readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return { docId, title, blocks: toPlainTextBlocks(result.text, title) };
  }

  throw new Error(`Unsupported source file type: ${filePath}`);
}
