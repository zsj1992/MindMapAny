import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolPageContent } from '@/components/site/ToolPageContent';
import { getToolPage, localizedToolPage, TOOL_PAGES } from '@/lib/seo/content';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOOL_PAGES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = getToolPage((await params).slug);
  if (!found) return {};
  const tool = localizedToolPage(found, 'ko');
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: [tool.primaryKeyword, ...tool.relatedKeywords],
    alternates: alternatesFor(`/tools/${tool.slug}`, 'ko'),
    openGraph: openGraphFor('ko', { title: tool.seoTitle, description: tool.seoDescription, url: `/ko/tools/${tool.slug}` }),
  };
}

export default async function ToolLandingPageKo({ params }: Props) {
  const found = getToolPage((await params).slug);
  if (!found) notFound();
  return <ToolPageContent tool={localizedToolPage(found, 'ko')} locale="ko" />;
}
