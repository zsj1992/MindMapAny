import type { MetadataRoute } from 'next';
import { listPublicSlugs } from '@/lib/db/repositories/maps';
import { SOURCE_SLUGS } from '@/lib/sources';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mindmapany.com';

export const revalidate = 3600;

/** 公开分享页是唯一的内容资产，全部进 sitemap */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    // 四个来源落地页各自承接一组关键词
    ...SOURCE_SLUGS.map((slug) => ({
      url: `${siteUrl}/app/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
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
