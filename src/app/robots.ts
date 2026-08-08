import type { MetadataRoute } from 'next';

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 搜索入口放在 /tools 和 /blog；整个交互工作台不参与索引。
      disallow: ['/api/', '/app/', '/login', '/auth/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
