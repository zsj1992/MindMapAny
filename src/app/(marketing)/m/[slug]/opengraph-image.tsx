import { ImageResponse } from 'next/og';
import { getPublicBySlug } from '@/lib/db/repositories/maps';

/**
 * 分享卡片。不截画布（服务端没有浏览器），而是用一级主题重绘一张摘要图 ——
 * 信息量其实比缩小到看不清的截图更高。
 */

export const alt = 'MindMapAny mind map';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let title = 'MindMapAny';
  let topics: string[] = [];

  try {
    const found = await getPublicBySlug(slug);
    if (found) {
      const map = found.map;
      title = map.title;
      const rootId = map.nodes.find((n) => n.parentId === null)?.id;
      topics = map.nodes
        .filter((n) => n.parentId === rootId)
        .sort((a, b) => a.order - b.order)
        .slice(0, 5)
        .map((n) => n.title);
    }
  } catch {
    // 取不到就用兜底文案，OG 图不能因为查库失败而整体 500
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 54, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
            {title.slice(0, 60)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {topics.map((t) => (
              <div
                key={t}
                style={{
                  display: 'flex',
                  fontSize: 26,
                  color: '#334155',
                  background: '#f1f5f9',
                  borderRadius: 10,
                  padding: '10px 18px',
                }}
              >
                {t.slice(0, 24)}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#94a3b8' }}>MindMapAny · turn any content into a mind map</div>
      </div>
    ),
    size,
  );
}
