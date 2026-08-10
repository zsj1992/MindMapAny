import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo/content';
import type { Locale } from './locales';

/**
 * 营销站的多语言路由。
 *
 * 英文留在根路径（`/pricing`），中文挂 `/zh` 前缀（`/zh/pricing`）。
 * 英文 URL 一个都不动 —— 站点已经在这些地址上积累排名，改路径等于把资产清零。
 *
 * 为什么不用中间件做语言重写：Next 16 把 middleware 改名成 proxy，且只能跑在
 * Node.js runtime，OpenNext/Cloudflare 在构建阶段就会直接拒绝。所以语言只能
 * 来自路由本身 —— 这反而是好事，营销页因此仍是纯静态预渲染，不读 cookie、
 * 不读请求头，能留在边缘缓存里。
 */

export const ZH_PREFIX = '/zh';

/**
 * 有中文版本的路径。没列进来的（工作台、博客正文、法务页…）在中文界面里
 * 仍然链到英文原页 —— 宁可让用户看到一页英文，也不能给出一个 404。
 * 新增中文页时必须同步加到这里，否则页面存在却没人链得到。
 */
const TRANSLATED = new Set([
  '/',
  '/pricing',
  '/tools',
  '/tools/pdf-to-mind-map',
  '/tools/docx-to-mind-map',
  '/tools/epub-to-mind-map',
  '/tools/pptx-to-mind-map',
  '/tools/text-to-mind-map',
  '/tools/webpage-to-mind-map',
]);

export function hasTranslation(path: string): boolean {
  return TRANSLATED.has(path);
}

/** 把一条英文路径转成指定语言的路径。'/' 是特例，不能拼成 '/zh/'。 */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === 'en' || !TRANSLATED.has(path)) return path;
  return path === '/' ? ZH_PREFIX : `${ZH_PREFIX}${path}`;
}

/** 从任意路径还原出对应的英文路径，用于语言切换和 hreflang 互指 */
export function basePath(path: string): string {
  if (path === ZH_PREFIX) return '/';
  return path.startsWith(`${ZH_PREFIX}/`) ? path.slice(ZH_PREFIX.length) : path;
}

/**
 * 一个页面的 canonical + hreflang。
 *
 * 两件事必须同时给对，少一件都会掉排名：
 *   - canonical 指向自己（英文页指英文、中文页指中文）。指错会让整个语言版本从索引里消失。
 *   - languages 里两个语言互指，并给 x-default。缺了搜索引擎会把中英当成重复内容。
 *
 * @param path 英文路径，如 '/pricing'；首页传 '/'
 */
export function alternatesFor(path: string, locale: Locale): Metadata['alternates'] {
  const en = path;
  // 没有中文版的页面不能声明 hreflang：指向一个英文页会被判成错误的语言标注，
  // 比不写更糟。这类页面只留 canonical。
  if (!hasTranslation(path)) return { canonical: en };
  return {
    canonical: localizedPath(path, locale),
    languages: {
      en,
      'zh-CN': localizedPath(path, 'zh-CN'),
      // x-default 给英文：命中不了任何语言时，英文是覆盖面最广的那一版
      'x-default': en,
    },
  };
}

/** JSON-LD 和 OG 标签用的语言码，两处写法不同，集中在这里避免写反 */
export const OG_LOCALE: Record<Locale, string> = { en: 'en_US', 'zh-CN': 'zh_CN' };
export const HTML_LANG: Record<Locale, string> = { en: 'en', 'zh-CN': 'zh-CN' };

export function absoluteUrl(path: string, locale: Locale): string {
  const localized = localizedPath(path, locale);
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`;
}
