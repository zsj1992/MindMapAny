import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';
import { safeFetchHtml } from './ssrf';
import { ExtractError, type Block, type ExtractedDoc } from './types';

/**
 * 网页正文提取。MVP 只处理服务端渲染的 HTML —— 纯 JS 渲染的页面直接明确报错，
 * 不上无头浏览器（冷启动、成本、被封三重代价，第二阶段再说）。
 */

const MIN_ARTICLE_CHARS = 200;

export async function extractWeb(rawUrl: string): Promise<ExtractedDoc> {
  const { url, html } = await safeFetchHtml(rawUrl);
  const notes: string[] = [];

  const { document } = parseHTML(html);
  // Readability 会就地改 DOM，先把标题存下来
  const rawTitle = document.querySelector('title')?.textContent?.trim() ?? '';

  if (isWechatArticleUrl(rawUrl) || isWechatArticleUrl(url)) {
    const wechat = extractWechatArticle(document as unknown as Document);
    if (!wechat) {
      throw new ExtractError(
        'fetch_failed',
        'WeChat refused this server request. Try again shortly, or copy the article text and use the long-text input instead.',
      );
    }
    return {
      kind: 'web',
      title: (wechat.title || rawTitle || url).slice(0, 120),
      blocks: wechat.blocks,
      url,
      notes,
    };
  }

  const article = new Readability(document as unknown as Document, { charThreshold: 100 }).parse();
  if (!article?.content) {
    throw new ExtractError('empty', 'No body text could be extracted. This page may require a login, use anti-bot protection, or render entirely in JavaScript.');
  }

  const blocks = htmlToBlocks(article.content);
  const chars = blocks.reduce((n, b) => n + b.text.length, 0);
  if (chars < MIN_ARTICLE_CHARS) {
    throw new ExtractError('empty', 'Too little body text was found — this may be a listing page, or one that renders in JavaScript.');
  }
  if (article.excerpt && chars < 600) notes.push('The extracted article is short, so the map may be sparse');

  return {
    kind: 'web',
    title: (article.title || rawTitle || url).slice(0, 120),
    blocks,
    url,
    notes,
  };
}

function isWechatArticleUrl(rawUrl: string): boolean {
  try {
    return new URL(rawUrl).hostname.toLowerCase() === 'mp.weixin.qq.com';
  } catch {
    return false;
  }
}

/** 微信公众号正文不用 Readability：它会误选作者栏，而正文固定在 #js_content。 */
export function extractWechatArticle(document: Document): { title: string; blocks: Block[] } | null {
  const content = document.querySelector('#js_content');
  if (!content) return null;

  const blocks = htmlToBlocks(content.innerHTML);
  const chars = blocks.reduce((total, block) => total + block.text.length, 0);
  if (chars < MIN_ARTICLE_CHARS) return null;

  const title = normalizeText(document.querySelector('#activity-name')?.textContent ?? '');
  return { title, blocks };
}

/**
 * 把 Readability 产出的 HTML 拍平成段落块，并把最近的标题作为锚点带上，
 * 这样脑图节点能定位回原文的哪一节。
 */
const SEMANTIC_BLOCK_SELECTOR = 'h1,h2,h3,h4,p,li,blockquote,pre,figcaption';
const FALLBACK_BLOCK_SELECTOR = `${SEMANTIC_BLOCK_SELECTOR},section,div`;

/**
 * Readability 能识别文章范围，但部分政府站和公众号编辑器会用层层 section/span
 * 表示段落。先走标准语义标签；内容明显不足时，再取最深层的 section/div 文本块。
 * “只取最深层”可以避免把同一段正文从父容器重复提取多次。
 */
export function htmlToBlocks(content: string): Block[] {
  const { document } = parseHTML(`<body>${content}</body>`);
  const semanticBlocks = nodesToBlocks(document, SEMANTIC_BLOCK_SELECTOR, false);
  const semanticChars = semanticBlocks.reduce((total, block) => total + block.text.length, 0);
  if (semanticChars >= MIN_ARTICLE_CHARS) return semanticBlocks;

  const fallbackBlocks = nodesToBlocks(document, FALLBACK_BLOCK_SELECTOR, true);
  const fallbackChars = fallbackBlocks.reduce((total, block) => total + block.text.length, 0);
  return fallbackChars > semanticChars ? fallbackBlocks : semanticBlocks;
}

function nodesToBlocks(document: Document, selector: string, deepestOnly: boolean): Block[] {
  const blocks: Block[] = [];
  const seen = new Set<string>();
  let anchor: string | undefined;

  const nodes = document.querySelectorAll(selector);
  for (const el of Array.from(nodes)) {
    const tag = el.tagName.toLowerCase();
    const text = normalizeText(el.textContent ?? '');
    if (!text) continue;

    if (deepestOnly) {
      const hasMeaningfulChildBlock = Array.from(el.querySelectorAll(selector)).some(
        (child) => child !== el && normalizeText(child.textContent ?? '').length >= 2,
      );
      if (hasMeaningfulChildBlock) continue;
    }

    if (/^h[1-4]$/.test(tag)) {
      anchor = text.slice(0, 80);
      if (!seen.has(text)) {
        seen.add(text);
        blocks.push({ text, anchor });
      }
      continue;
    }
    // 嵌套 li 会被父节点重复捕获一次，跳过已被包含的内容
    if (tag === 'li' && el.parentElement?.closest('li')) continue;
    if (text.length < 2) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    blocks.push({ text, ...(anchor ? { anchor } : {}) });
  }

  return blocks;
}

function normalizeText(text: string): string {
  return text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}
