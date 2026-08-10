import type { Metadata } from 'next';
import { ToolsIndexContent } from '@/components/site/ToolsIndexContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('de').toolsIndex;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/tools', 'de'),
  openGraph: openGraphFor('de'),
};

export default function ToolsPageDe() {
  return <ToolsIndexContent locale="de" />;
}
