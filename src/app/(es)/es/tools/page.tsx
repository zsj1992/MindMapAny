import type { Metadata } from 'next';
import { ToolsIndexContent } from '@/components/site/ToolsIndexContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('es').toolsIndex;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/tools', 'es'),
  openGraph: openGraphFor('es'),
};

export default function ToolsPageEs() {
  return <ToolsIndexContent locale="es" />;
}
