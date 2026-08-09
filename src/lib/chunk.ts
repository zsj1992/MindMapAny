import { blockToSource, type Block, type ExtractedDoc } from '@/lib/extract/types';
import type { PromptChunk } from '@/lib/mindmap/prompt';
import type { SourceRef } from '@/lib/mindmap/schema';

/**
 * 切块。两条硬约束：
 * 1. 尽量不在句子/段落中间切，否则模型会把半句话当成一个主题。
 * 2. 每个 chunk 必须带回它起始位置的 SourceRef —— 溯源准不准全看这里，
 *    模型只回引 chunkId，页码/时间戳一律由 chunkIndex 查表还原。
 */

/** 按字符数估算，中文 1 字 ≈ 1 token，英文 ≈ 0.25，取保守值 */
export const DEFAULT_CHUNK_CHARS = 6000;
export const CHUNK_OVERLAP_CHARS = 200;

export interface ChunkResult {
  chunks: PromptChunk[];
  chunkIndex: Map<string, SourceRef>;
}

function hintFor(doc: ExtractedDoc, block: Block): string | undefined {
  if (doc.kind === 'pdf' && block.page) return `p.${block.page}`;
  if (doc.kind === 'youtube' && block.startSec !== undefined) return formatTimestamp(block.startSec);
  if (doc.kind === 'web' && block.anchor) return block.anchor;
  if (doc.kind === 'document' && block.location) return block.location;
  return undefined;
}

export function formatTimestamp(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(r).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

/** 段落过长时按句子边界二次切分，避免单个 block 撑爆 chunk */
function splitLongText(text: string, limit: number): string[] {
  if (text.length <= limit) return [text];
  const parts: string[] = [];
  const sentences = text.split(/(?<=[。！？.!?\n])\s*/);
  let buf = '';
  for (const s of sentences) {
    if (buf && buf.length + s.length > limit) {
      parts.push(buf);
      buf = buf.slice(-CHUNK_OVERLAP_CHARS);
    }
    buf += s;
    // 单句本身就超限（无标点的长文本）时硬切
    while (buf.length > limit) {
      parts.push(buf.slice(0, limit));
      buf = buf.slice(limit - CHUNK_OVERLAP_CHARS);
    }
  }
  if (buf.trim()) parts.push(buf);
  return parts;
}

export function chunkDocument(doc: ExtractedDoc, chunkChars = DEFAULT_CHUNK_CHARS): ChunkResult {
  const chunks: PromptChunk[] = [];
  const chunkIndex = new Map<string, SourceRef>();

  let seq = 0;
  let buf = '';
  // 当前 chunk 的起始 block，chunkId 的溯源锚点取它
  let anchorBlock = doc.blocks[0];

  const flush = () => {
    const text = buf.trim();
    buf = '';
    if (!text || !anchorBlock) return;
    const chunkId = `c${++seq}`;
    chunks.push({ chunkId, text, ...(hintFor(doc, anchorBlock) ? { hint: hintFor(doc, anchorBlock) } : {}) });
    chunkIndex.set(chunkId, blockToSource(doc, anchorBlock, chunkId));
  };

  for (const block of doc.blocks) {
    const pieces = splitLongText(block.text.trim(), chunkChars);
    for (const piece of pieces) {
      if (!piece.trim()) continue;
      if (buf && buf.length + piece.length > chunkChars) {
        flush();
        anchorBlock = block;
      }
      if (!buf) anchorBlock = block;
      buf += (buf ? '\n\n' : '') + piece;
    }
  }
  flush();

  return { chunks, chunkIndex };
}

/** map-reduce 判定：单次能塞下就直接一把过，省一轮调用和一半 token */
export function needsMapReduce(chunks: PromptChunk[], singlePassChars = 24000): boolean {
  return chunks.reduce((n, c) => n + c.text.length, 0) > singlePassChars;
}

/** reduce 前把 chunk 按预算分组，每组一次 map 调用 */
export function groupChunks(chunks: PromptChunk[], groupChars = 24000): PromptChunk[][] {
  const groups: PromptChunk[][] = [];
  let cur: PromptChunk[] = [];
  let size = 0;
  for (const c of chunks) {
    if (cur.length && size + c.text.length > groupChars) {
      groups.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(c);
    size += c.text.length;
  }
  if (cur.length) groups.push(cur);
  return groups;
}
