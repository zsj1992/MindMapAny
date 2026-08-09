import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SharedMap } from '@/components/SharedMap';
import { getPublicBySlug } from '@/lib/db/repositories/maps';
import { toOutline } from '@/lib/mindmap/outline';
import type { MindMap } from '@/lib/mindmap/schema';

/**
 * 公开分享页。这是整个产品唯一的自然流量入口 ——
 * 必须服务端渲染、必须可索引、大纲必须以纯文本进入 HTML（画布是 canvas，爬虫读不到）。
 */

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function loadShared(slug: string): Promise<{ map: MindMap; updatedAt: string } | null> {
  try {
    const found = await getPublicBySlug(slug);
    return found ? { map: found.map, updatedAt: new Date(found.row.updated_at * 1000).toISOString() } : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const shared = await loadShared(slug);
  if (!shared) return { title: 'Mind map not found' };

  const topics = shared.map.nodes
    .filter((n) => n.parentId !== null)
    .slice(0, 6)
    .map((n) => n.title)
    .join('、');
  const description = `Mind map of ${shared.map.title}: ${topics}`.slice(0, 155);

  return {
    title: `${shared.map.title} — mind map | MindMapAny`,
    description,
    openGraph: {
      title: shared.map.title,
      description,
      type: 'article',
      images: [{ url: `/m/${slug}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `/m/${slug}` },
  };
}

export default async function SharePage({ params }: Props) {
  const { slug } = await params;
  const shared = await loadShared(slug);
  if (!shared) notFound();

  const { map } = shared;
  return (
    <main className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="min-h-0 flex-1">
        <SharedMap map={map} />
      </div>

      {/* 爬虫和读屏软件读这一份：画布内容对它们不可见 */}
      <section className="sr-only">
        <h1>{map.title}</h1>
        <pre>{toOutline(map)}</pre>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: map.title,
            dateModified: shared.updatedAt,
            inLanguage: map.language,
            articleBody: toOutline(map),
          }),
        }}
      />
    </main>
  );
}
