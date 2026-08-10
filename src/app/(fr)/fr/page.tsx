import type { Metadata } from 'next';
import { HomeContent } from '@/components/site/HomeContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('fr').home;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/', 'fr'),
  openGraph: openGraphFor('fr'),
};

export default function PageFrHome() {
  return <HomeContent locale="fr" />;
}
