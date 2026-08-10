import type { MetadataRoute } from 'next';
import { listPublicSlugs } from '@/lib/db/repositories/maps';
import { BLOG_POSTS, TOOL_PAGES } from '@/lib/seo/content';
import { localesWithTranslation, localizedPath } from '@/lib/i18n/routes';

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';

export const revalidate = 3600;

/**
 * 有中文版的页面，同一条 URL 上带 alternates.languages。
 *
 * 只写两条独立 URL 而不声明互为译文，搜索引擎会把中英当成重复内容 ——
 * 结果是两版互相压制，比只有一版还糟。
 */
function withAlternates(entry: MetadataRoute.Sitemap[number], path: string): MetadataRoute.Sitemap[number] {
  const available = localesWithTranslation(path);
  if (available.length < 2) return entry;
  const languages: Record<string, string> = {};
  for (const locale of available) languages[locale] = `${siteUrl}${localizedPath(path, locale)}`;
  return { ...entry, alternates: { languages } };
}

/** 只收录公开、独立且有搜索价值的内容页；工作台统一 noindex。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    withAlternates({ url: siteUrl, changeFrequency: 'weekly', priority: 1 }, '/'),
    withAlternates({ url: `${siteUrl}/pricing`, changeFrequency: 'monthly', priority: 0.7 }, '/pricing'),
    { url: `${siteUrl}/support`, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${siteUrl}/billing`, changeFrequency: 'monthly', priority: 0.45 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/refund-policy`, changeFrequency: 'yearly', priority: 0.35 },
    withAlternates({ url: `${siteUrl}/tools`, changeFrequency: 'weekly', priority: 0.9 }, '/tools'),
    ...TOOL_PAGES.map(({ slug }) =>
      withAlternates(
        { url: `${siteUrl}/tools/${slug}`, changeFrequency: 'monthly' as const, priority: 0.85 },
        `/tools/${slug}`,
      ),
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
