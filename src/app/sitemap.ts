import type { MetadataRoute } from 'next';
import { listPublicSlugs } from '@/lib/db/repositories/maps';
import { BLOG_POSTS, TOOL_PAGES } from '@/lib/seo/content';
import { absoluteUrl, localesWithTranslation } from '@/lib/i18n/routes';

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';

export const revalidate = 3600;

/**
 * 一个页面在每种语言下各出一条 <loc>，每条都带上全部语言的 alternates（含自指）。
 *
 * 之前只输出英文那条、把其他语言塞进 alternates —— 中文和日文页面因此在 sitemap 里
 * 没有自己的条目，也就没有各自的 lastmod 和优先级，收录全靠 Google 顺着 alternates 摸过去。
 * 另外首页的 <loc> 是不带尾斜杠的裸域名，而 alternates 里的 en 带斜杠，
 * 自指对不上会让整组 hreflang 被判为无效。统一用 absoluteUrl 生成，两边不可能再对不上。
 */
function localizedEntries(
  path: string,
  entry: Omit<MetadataRoute.Sitemap[number], 'url'>,
): MetadataRoute.Sitemap {
  const available = localesWithTranslation(path);
  if (available.length < 2) return [{ url: absoluteUrl(path, 'en'), ...entry }];
  const languages = Object.fromEntries(available.map((locale) => [locale, absoluteUrl(path, locale)]));
  return available.map((locale) => ({
    url: absoluteUrl(path, locale),
    ...entry,
    alternates: { languages: { ...languages, 'x-default': absoluteUrl(path, 'en') } },
  }));
}

/** 只收录公开、独立且有搜索价值的内容页；工作台统一 noindex。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    ...localizedEntries('/', { changeFrequency: 'weekly', priority: 1 }),
    ...localizedEntries('/pricing', { changeFrequency: 'monthly', priority: 0.7 }),
    { url: `${siteUrl}/support`, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${siteUrl}/billing`, changeFrequency: 'monthly', priority: 0.45 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/refund-policy`, changeFrequency: 'yearly', priority: 0.35 },
    ...localizedEntries('/tools', { changeFrequency: 'weekly', priority: 0.9 }),
    ...TOOL_PAGES.flatMap(({ slug }) =>
      localizedEntries(`/tools/${slug}`, { changeFrequency: 'monthly' as const, priority: 0.85 }),
    ),
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...BLOG_POSTS.map(({ slug, updatedAt }) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.72,
    })),
  ];

  try {
    for (const { slug, updatedAt } of await listPublicSlugs()) {
      base.push({
        url: `${siteUrl}/m/${slug}`,
        lastModified: new Date(updatedAt * 1000),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch {
    // sitemap 生成失败不能让整站构建挂掉
  }
  return base;
}
