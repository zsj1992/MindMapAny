import type { Metadata } from 'next';
import { HomeContent } from '@/components/site/HomeContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('en').home;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/', 'en'),
  openGraph: openGraphFor('en'),
};

export default function HomePage() {
  return <HomeContent locale="en" />;
}
