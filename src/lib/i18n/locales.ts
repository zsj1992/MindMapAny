/**
 * 站点支持的界面语言。工作台按 cookie / Accept-Language 决定，
 * 营销页按 URL 前缀决定（见 routes.ts）。
 *
 * 各语言的翻译覆盖范围不同，由 routes.ts 里的 TRANSLATED 按语言分别声明 ——
 * 不能假设「支持这门语言」就等于「每一页都有这门语言」。
 */

export const LOCALES = ['en', 'zh-CN', 'ja', 'ko', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * 语言名一律用该语言自己的写法（endonym）。
 * 切换菜单要在任何当前语言下都认得出来 —— 一个只看得懂日文的用户，
 * 在中文界面里找「日语」远不如找「日本語」来得快。
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
};

/** URL 前缀。英文是默认语言，留在根路径上不加前缀。 */
export const LOCALE_PREFIX: Record<Locale, string> = {
  en: '',
  'zh-CN': '/zh',
  ja: '/ja',
  ko: '/ko',
  es: '/es',
};

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
    // 只做前缀匹配：zh-Hans-CN、zh-HK、zh 都归到简体中文；pt-BR 之类未支持的语言落到英文
    if (tag.startsWith('zh')) return 'zh-CN';
    if (tag.startsWith('ja')) return 'ja';
    if (tag.startsWith('ko')) return 'ko';
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('en')) return 'en';
  }
  return DEFAULT_LOCALE;
}

/**
 * 工作台界面已经翻译的语言。营销页支持得更多，但在账号菜单里列出一门
 * 选了却毫无变化的语言，比不列更让人困惑。补完翻译后再往这里加。
 */
export const WORKBENCH_LOCALES: Locale[] = ['en', 'zh-CN'];
