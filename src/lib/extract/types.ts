import type { SourceRef } from '@/lib/mindmap/schema';

export const INPUT_KINDS = ['text', 'pdf', 'web', 'youtube'] as const;
export type InputKind = (typeof INPUT_KINDS)[number];
export type ExtractedKind = InputKind | 'document';

/**
 * 所有输入格式统一提取成 Block[]，下游切块/生成/溯源完全共用一条管线。
 * 位置信息（页码 / 时间戳）在这里就必须锚定好 —— 后面模型无权再改。
 */
export interface Block {
  text: string;
  /** pdf: 1-based 页码 */
  page?: number;
  /** youtube: 起始秒 */
  startSec?: number;
  /** web: 最近的一个标题锚点 */
  anchor?: string;
  /** docx/epub/pptx: 章节、幻灯片等确定性位置 */
  location?: string;
}

export interface ExtractedDoc {
  kind: ExtractedKind;
  title: string;
  blocks: Block[];
  /** 原始地址，web/youtube 有 */
  url?: string;
  /** 提取阶段的降级信息，透传给前端提示用户 */
  notes: string[];
}

export function totalChars(doc: ExtractedDoc): number {
  return doc.blocks.reduce((n, b) => n + b.text.length, 0);
}

/** 把 Block 的位置信息固化成 SourceRef，供 chunkIndex 查表还原 */
export function blockToSource(doc: ExtractedDoc, block: Block, chunkId: string): SourceRef {
  switch (doc.kind) {
    case 'pdf':
      return { type: 'pdf', chunkId, page: block.page ?? 1 };
    case 'youtube':
      return { type: 'youtube', chunkId, startSec: block.startSec ?? 0 };
    case 'web':
      return { type: 'web', chunkId, url: doc.url ?? '', ...(block.anchor ? { anchor: block.anchor } : {}) };
    case 'document':
      return { type: 'document', chunkId, ...(block.location ? { location: block.location } : {}) };
    default:
      return { type: 'text', chunkId };
  }
}

export class ExtractError extends Error {
  constructor(
    readonly code:
      | 'unsupported'
      | 'too_large'
      | 'empty'
      | 'fetch_failed'
      | 'blocked_url'
      | 'no_transcript'
      | 'provider_unconfigured',
    message: string,
  ) {
    super(message);
    this.name = 'ExtractError';
  }
}
