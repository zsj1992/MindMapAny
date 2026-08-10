import type { Metadata } from 'next';
import { ToolsIndexContent } from '@/components/site/ToolsIndexContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('en').toolsIndex;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/tools', 'en'),
  openGraph: openGraphFor('en'),
};

export default function ToolsPage() {
  return <ToolsIndexContent locale="en" />;
}
