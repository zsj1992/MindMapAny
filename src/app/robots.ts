import type { MetadataRoute } from 'next';

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 私有区域和 API 不进索引，/m/ 是唯一要被抓的内容区
      // /app/{pdf,web,text,youtube} 是要被索引的落地页，只挡私有区
      disallow: ['/api/', '/app/maps', '/app/map/', '/app/new', '/login', '/auth/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
