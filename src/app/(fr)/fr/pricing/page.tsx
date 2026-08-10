import type { Metadata } from 'next';
import { PricingContent } from '@/components/site/PricingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('fr').pricing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/pricing', 'fr'),
  openGraph: openGraphFor('fr'),
};

export default function PageFrPricing() {
  return <PricingContent locale="fr" />;
}
