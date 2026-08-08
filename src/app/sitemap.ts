import type { MetadataRoute } from 'next';
import { listPublicSlugs } from '@/lib/db/repositories/maps';
import { BLOG_POSTS, TOOL_PAGES } from '@/lib/seo/content';

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';

export const revalidate = 3600;

/** 只收录公开、独立且有搜索价值的内容页；工作台统一 noindex。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/tools`, changeFrequency: 'weekly', priority: 0.9 },
    ...TOOL_PAGES.map(({ slug }) => ({
      url: `${siteUrl}/tools/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
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
