import type { Metadata } from 'next';
import { HomeContent } from '@/components/site/HomeContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('ko').home;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/', 'ko'),
  openGraph: openGraphFor('ko'),
};

export default function PageKoHome() {
  return <HomeContent locale="ko" />;
}
