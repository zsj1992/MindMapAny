import type { Metadata } from 'next';
import { SupportContent } from '@/components/site/SupportContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('de').support;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/support', 'de'),
  openGraph: openGraphFor('de'),
};

export default function PageDe() {
  return <SupportContent locale="de" />;
}
