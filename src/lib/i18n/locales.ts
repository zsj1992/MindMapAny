/**
 * 工作台的界面语言。只覆盖 /app —— 营销页和博客保持纯英文。
 *
 * 为什么只做工作台：营销页要做多语言就得配 /zh 子路径和 hreflang，
 * 还要再养一整套中文关键词和内容，否则两套页面互相抢排名。
 * 那是个独立的增长决策。工作台是登录后才可见的 noindex 区域，
 * 翻译它对 SEO 零影响，是纯收益。
 */

export const LOCALES = ['en', 'zh-CN'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** 手动选择记在 cookie 里。用 cookie 而不是 localStorage：服务端首屏渲染就要用到它 */
export const LOCALE_COOKIE = 'locale';

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/**
 * 用户选过 → 听用户的；没选过 → 看浏览器的 Accept-Language；都没有 → 英文。
 *
 * 必须在服务端定下来：客户端再改会造成首屏闪一下英文，
 * 而且 React 会因为服务端/客户端渲染结果不一致而报 hydration 错误。
 */
export function resolveLocale(cookieValue: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  return matchAcceptLanguage(acceptLanguage);
}

/**
 * 按 q 值排序后取第一个能对上的语言。
 * 只做前缀匹配：zh-Hans-CN、zh-HK、zh 都归到 zh-CN —— 目前只有一套中文，
 * 与其为繁体单独开一档不如先让所有中文用户看到中文界面。
 */
function matchAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { tag: tag.trim().toLowerCase(), q: q ? Number.parseFloat(q.split('=')[1]) || 0 : 1 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith('zh')) return 'zh-CN';
    if (tag.startsWith('en')) return 'en';
  }
  return DEFAULT_LOCALE;
}
