import type { Metadata } from 'next';
import { SupportContent } from '@/components/site/SupportContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('es').support;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/support', 'es'),
  openGraph: openGraphFor('es'),
};

export default function PageEs() {
  return <SupportContent locale="es" />;
}
