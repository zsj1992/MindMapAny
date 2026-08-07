import type { MetadataRoute } from 'next';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/db/server';
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

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return base;

  try {
    const { data } = await getSupabaseAdmin()
      .from('maps')
      .select('share_slug, updated_at')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(5000);

    for (const row of data ?? []) {
      if (!row.share_slug) continue;
      base.push({
        url: `${siteUrl}/m/${row.share_slug}`,
        lastModified: new Date(row.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch {
    // sitemap 生成失败不能让整站构建挂掉
  }
  return base;
}
