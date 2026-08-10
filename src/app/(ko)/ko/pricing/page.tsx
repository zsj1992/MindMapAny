import type { Metadata } from 'next';
import { PricingContent } from '@/components/site/PricingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('ko').pricing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/pricing', 'ko'),
  openGraph: openGraphFor('ko'),
};

export default function PageKoPricing() {
  return <PricingContent locale="ko" />;
}
