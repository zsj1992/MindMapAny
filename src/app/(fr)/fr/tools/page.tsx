import type { Metadata } from 'next';
import { ToolsIndexContent } from '@/components/site/ToolsIndexContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('fr').toolsIndex;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/tools', 'fr'),
  openGraph: openGraphFor('fr'),
};

export default function ToolsPageFr() {
  return <ToolsIndexContent locale="fr" />;
}
