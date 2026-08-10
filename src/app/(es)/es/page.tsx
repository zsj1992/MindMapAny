import type { Metadata } from 'next';
import { HomeContent } from '@/components/site/HomeContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, OG_LOCALE } from '@/lib/i18n/routes';

const copy = marketingCopy('es').home;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/', 'es'),
  openGraph: { locale: OG_LOCALE['es'] },
};

export default function PageEsHome() {
  return <HomeContent locale="es" />;
}
