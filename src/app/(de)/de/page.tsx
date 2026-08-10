import type { Metadata } from 'next';
import { HomeContent } from '@/components/site/HomeContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, OG_LOCALE } from '@/lib/i18n/routes';

const copy = marketingCopy('de').home;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/', 'de'),
  openGraph: { locale: OG_LOCALE['de'] },
};

export default function PageDeHome() {
  return <HomeContent locale="de" />;
}
