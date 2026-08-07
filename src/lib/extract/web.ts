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

  const article = new Readability(document as unknown as Document, { charThreshold: 100 }).parse();
  if (!article?.content) {
    throw new ExtractError('empty', '未能提取正文，该页面可能需要登录、有反爬保护或依赖 JS 渲染');
  }

  const blocks = htmlToBlocks(article.content);
  const chars = blocks.reduce((n, b) => n + b.text.length, 0);
  if (chars < MIN_ARTICLE_CHARS) {
    throw new ExtractError('empty', '正文内容过少，可能是列表页或需要 JS 渲染的页面');
  }
  if (article.excerpt && chars < 600) notes.push('提取到的正文较短，脑图可能比较简略');

  return {
    kind: 'web',
    title: (article.title || rawTitle || url).slice(0, 120),
    blocks,
    url,
    notes,
  };
}

/**
 * 把 Readability 产出的 HTML 拍平成段落块，并把最近的标题作为锚点带上，
 * 这样脑图节点能定位回原文的哪一节。
 */
function htmlToBlocks(content: string): Block[] {
  const { document } = parseHTML(`<body>${content}</body>`);
  const blocks: Block[] = [];
  let anchor: string | undefined;

  const nodes = document.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,pre,figcaption');
  for (const el of Array.from(nodes)) {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!text) continue;

    if (/^h[1-4]$/.test(tag)) {
      anchor = text.slice(0, 80);
      blocks.push({ text, ...(anchor ? { anchor } : {}) });
      continue;
    }
    // 嵌套 li 会被父节点重复捕获一次，跳过已被包含的内容
    if (tag === 'li' && el.parentElement?.closest('li')) continue;
    if (text.length < 2) continue;
    blocks.push({ text, ...(anchor ? { anchor } : {}) });
  }

  return blocks;
}
