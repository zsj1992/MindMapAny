import type { Metadata } from 'next';
import { SupportContent } from '@/components/site/SupportContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('ko').support;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/support', 'ko'),
  openGraph: openGraphFor('ko'),
};

export default function PageKo() {
  return <SupportContent locale="ko" />;
}
