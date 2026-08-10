import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Workspace } from '@/components/Workspace';
import { requireUser } from '@/lib/auth/require-user';
import { SOURCE_COPY, SOURCE_SLUGS, type SourceCopy } from '@/lib/sources';

/**
 * 每种来源一个独立路由。除了产品结构上更清晰，
 * 每种来源页也承接对应的搜索意图（例如“PDF 转思维导图”）。
 */

type Props = { params: Promise<{ kind: string }> };

export function generateStaticParams() {
  return SOURCE_SLUGS.map((kind) => ({ kind }));
}

function resolve(kind: string): SourceCopy | null {
  return (SOURCE_COPY as Record<string, SourceCopy>)[kind] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind } = await params;
  const copy = resolve(kind);
  if (!copy) return {};
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    alternates: { canonical: `/app/${copy.slug}` },
  };
}

export default async function SourcePage({ params }: Props) {
  const { kind } = await params;
  const copy = resolve(kind);
  if (!copy) notFound();
  const { plan } = await requireUser(`/app/${copy.slug}`);

  return (
    <Workspace
      plan={plan}
      mode={copy.slug}
      title={copy.title}
      subtitle={copy.subtitle}
      copy={{ ...(copy.hint ? { hint: copy.hint } : {}), examples: copy.examples }}
    />
  );
}
