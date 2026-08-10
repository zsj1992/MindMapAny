import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';
import { safeFetchHtml } from './ssrf';
import { ExtractError, type Block, type ExtractedDoc } from './types';

/**
 * 网页正文提取。不上无头浏览器（冷启动、成本、被封三重代价）。
 *
 * 但「JS 渲染」不等于「拿不到正文」：大量框架和 CMS 会在首屏 HTML 的 <script> 里
 * 注入一份服务端数据，正文 HTML 就在里面（Nuxt 的 __NUXT__、Next 的 __NEXT_DATA__、
 * 各种 window.__INITIAL_STATE__，以及国内政务/CMS 常见的 var xxx = {...}）。
 * 所以 Readability 拿不到东西时，再去 script 里挖一遍，能救回相当一部分页面。
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
  let blocks = article?.content ? htmlToBlocks(article.content) : [];
  let chars = blocks.reduce((n, b) => n + b.text.length, 0);

  // Readability 只看 DOM，看不见 script 里的数据。不够就去挖。
  if (chars < MIN_ARTICLE_CHARS) {
    const embedded = extractEmbeddedArticle(html);
    if (embedded) {
      const embeddedChars = embedded.reduce((n, b) => n + b.text.length, 0);
      if (embeddedChars > chars) {
        blocks = embedded;
        chars = embeddedChars;
      }
    }
  }

  if (!blocks.length) {
    throw new ExtractError('empty', 'No body text could be extracted. This page may require a login, use anti-bot protection, or render entirely in JavaScript.');
  }
  if (chars < MIN_ARTICLE_CHARS) {
    throw new ExtractError('empty', 'Too little body text was found — this may be a listing page, or one that renders in JavaScript.');
  }
  if (article?.excerpt && chars < 600) notes.push('The extracted article is short, so the map may be sparse');

  return {
    kind: 'web',
    title: (article?.title || rawTitle || url).slice(0, 120),
    blocks,
    url,
    notes,
  };
}

/**
 * 从 <script> 里挖服务端注入的正文。
 *
 * 只在常规提取失败时兜底 —— script 里同时躺着导航、配置、埋点这些噪音，
 * 常规路径能拿到正文时不该冒这个险。
 *
 * 做法是找「解码后含有块级 HTML 标签」的最大片段：正文一定带 <p>/<div>，
 * 而导航菜单、配置对象通常是纯 JSON 字符串，天然被这一条筛掉。
 */
export function extractEmbeddedArticle(html: string): Block[] | null {
  let best: Block[] = [];
  let bestChars = 0;

  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = match[1];
    if (!raw || raw.length < 500) continue;

    const decoded = decodeScriptPayload(raw);
    // 没有块级标签的片段不可能是正文，直接跳过，省掉一次昂贵的解析
    if (!/<(p|div|section|article|h[1-6])[\s>]/i.test(decoded)) continue;

    for (const fragment of htmlFragments(decoded)) {
      const parsed = htmlToBlocks(fragment);
      const chars = parsed.reduce((n, b) => n + b.text.length, 0);
      if (chars > bestChars) {
        best = parsed;
        bestChars = chars;
      }
    }
  }

  return bestChars >= MIN_ARTICLE_CHARS ? best : null;
}

/** JSON 字面量里的中文是 \uXXXX，斜杠和引号也被转义过，先还原成正常 HTML */
function decodeScriptPayload(raw: string): string {
  return raw
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/\\\//g, '/')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n');
}

/**
 * 从解码后的脚本里切出 HTML 片段。
 * 取第一个块级标签到最后一个闭合标签之间的整段 —— 正文通常是连续的一大块，
 * 逐标签匹配反而会把一篇文章拆成几十个碎片。
 */
function htmlFragments(decoded: string): string[] {
  const start = decoded.search(/<(p|div|section|article|h[1-6])[\s>]/i);
  if (start < 0) return [];
  const end = decoded.lastIndexOf('</');
  if (end <= start) return [];
  return [decoded.slice(start, end + 200)];
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
