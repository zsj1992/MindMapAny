import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo/content';
import { LOCALE_PREFIX, LOCALES, type Locale } from './locales';

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

const CORE_PAGES = ['/', '/pricing', '/support', '/billing'];
/** 法务页按语言单独声明：译文齐全的语言才列出，其余整页回退英文 */
const LEGAL_PAGES = ['/terms', '/privacy', '/refund-policy'];
const TOOL_PAGES_PATHS = [
  '/tools',
  '/tools/pdf-to-mind-map',
  '/tools/docx-to-mind-map',
  '/tools/epub-to-mind-map',
  '/tools/pptx-to-mind-map',
  '/tools/text-to-mind-map',
  '/tools/webpage-to-mind-map',
];

/**
 * 每种语言各自已翻译的页面，按语言分别声明 —— 各语言进度本来就不同。
 *
 * 没列进来的页面在该语言下仍然链到英文原页：宁可让用户看到一页英文，
 * 也不能给出一个 404。新增译文页时必须同步加到这里，
 * 否则页面存在却没有任何入口链得到，等于白做。
 */
/**
 * 英文是源语言，按定义拥有全部页面 —— 由其余集合求并集得出，不手写。
 *
 * 手写过一次就出过事：法务页加进了中文集合却忘了加进英文集合，
 * 于是 '/terms' 只剩一种语言，中文版既不进 sitemap 也拿不到 hreflang 互指。
 * 页面上线了、能打开，搜索引擎却永远不知道它存在。
 */
const ALL_PAGES = [...CORE_PAGES, ...TOOL_PAGES_PATHS, ...LEGAL_PAGES];

const TRANSLATED: Record<Locale, Set<string>> = {
  en: new Set(ALL_PAGES),
  'zh-CN': new Set([...CORE_PAGES, ...TOOL_PAGES_PATHS, ...LEGAL_PAGES]),
  ja: new Set([...CORE_PAGES, ...TOOL_PAGES_PATHS]),
  ko: new Set([...CORE_PAGES, ...TOOL_PAGES_PATHS]),
  es: new Set([...CORE_PAGES, ...TOOL_PAGES_PATHS]),
  de: new Set([...CORE_PAGES, ...TOOL_PAGES_PATHS]),
  fr: new Set([...CORE_PAGES, ...TOOL_PAGES_PATHS]),
};

export function hasTranslation(path: string, locale: Locale): boolean {
  return TRANSLATED[locale]?.has(path) ?? false;
}

/** 某个页面有译文的所有语言，用于 hreflang 与语言切换 */
export function localesWithTranslation(path: string): Locale[] {
  return LOCALES.filter((locale) => hasTranslation(path, locale));
}

/** 把一条英文路径转成指定语言的路径。'/' 是特例，不能拼成 '/zh/'。 */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === 'en' || !hasTranslation(path, locale)) return path;
  const prefix = LOCALE_PREFIX[locale];
  return path === '/' ? prefix : `${prefix}${path}`;
}

/** 从任意带前缀的路径还原出英文路径，用于语言切换和 hreflang 互指 */
export function basePath(path: string): string {
  for (const locale of LOCALES) {
    const prefix = LOCALE_PREFIX[locale];
    if (!prefix) continue;
    if (path === prefix) return '/';
    if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length);
  }
  return path;
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
  const available = localesWithTranslation(path);
  // 只有英文一版时不声明 hreflang：把英文页标成别的语言的译文，比不标更糟
  if (available.length < 2) return { canonical: path };
  const languages: Record<string, string> = {};
  for (const item of available) languages[item] = localizedPath(path, item);
  // x-default 给英文：命中不了任何语言时，英文是覆盖面最广的那一版
  languages['x-default'] = path;
  return { canonical: localizedPath(path, locale), languages };
}

/** JSON-LD 和 OG 标签用的语言码，两处写法不同，集中在这里避免写反 */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  'zh-CN': 'zh_CN',
  ja: 'ja_JP',
  ko: 'ko_KR',
  es: 'es_ES',
  de: 'de_DE',
  fr: 'fr_FR',
};
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  'zh-CN': 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  es: 'es',
  de: 'de',
  fr: 'fr',
};

export function absoluteUrl(path: string, locale: Locale): string {
  const localized = localizedPath(path, locale);
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`;
}

/**
 * 页面级的 openGraph。必须走这个函数，不能在页面里直接写 `openGraph: { locale }`。
 *
 * Next 的 metadata 合并对 openGraph 是「整块替换」而不是深合并：子页面只要声明了
 * openGraph，根布局里的 images / type / siteName 就全部消失。
 * 之前每个营销页只写了 locale，结果全站的 og:image 都没了 —— 分享出去没有预览图，
 * 而这件事在页面上完全看不出来，只有抓 HTML 才发现。
 */
export function openGraphFor(locale: Locale, extra?: { title?: string; description?: string; url?: string }) {
  return {
    type: 'website' as const,
    siteName: 'MindMapAny',
    locale: OG_LOCALE[locale],
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'MindMapAny — turn complex content into a clear mind map' }],
    ...extra,
  };
}
