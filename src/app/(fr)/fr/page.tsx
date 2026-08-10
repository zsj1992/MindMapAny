import type { Metadata } from 'next';
import { HomeContent } from '@/components/site/HomeContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, OG_LOCALE } from '@/lib/i18n/routes';

const copy = marketingCopy('fr').home;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/', 'fr'),
  openGraph: { locale: OG_LOCALE['fr'] },
};

export default function PageFrHome() {
  return <HomeContent locale="fr" />;
}
