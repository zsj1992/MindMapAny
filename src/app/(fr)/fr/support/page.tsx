import type { Metadata } from 'next';
import { SupportContent } from '@/components/site/SupportContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('fr').support;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/support', 'fr'),
  openGraph: openGraphFor('fr'),
};

export default function PageFr() {
  return <SupportContent locale="fr" />;
}
