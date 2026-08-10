import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolPageContent } from '@/components/site/ToolPageContent';
import { getToolPage, localizedToolPage, TOOL_PAGES } from '@/lib/seo/content';
import { alternatesFor, OG_LOCALE } from '@/lib/i18n/routes';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOOL_PAGES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = getToolPage((await params).slug);
  if (!found) return {};
  const tool = localizedToolPage(found, 'zh-CN');
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: [tool.primaryKeyword, ...tool.relatedKeywords],
    alternates: alternatesFor(`/tools/${tool.slug}`, 'zh-CN'),
    openGraph: { title: tool.seoTitle, description: tool.seoDescription, url: `/zh/tools/${tool.slug}`, locale: OG_LOCALE['zh-CN'] },
  };
}

export default async function ToolLandingPageZh({ params }: Props) {
  const found = getToolPage((await params).slug);
  if (!found) notFound();
  return <ToolPageContent tool={localizedToolPage(found, 'zh-CN')} locale="zh-CN" />;
}
