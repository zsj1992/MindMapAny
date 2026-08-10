import type { Metadata } from 'next';
import { PricingContent } from '@/components/site/PricingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, OG_LOCALE } from '@/lib/i18n/routes';

const copy = marketingCopy('es').pricing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/pricing', 'es'),
  openGraph: { locale: OG_LOCALE['es'] },
};

export default function PageEsPricing() {
  return <PricingContent locale="es" />;
}
