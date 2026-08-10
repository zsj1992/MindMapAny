import type { Metadata } from 'next';
import { PricingContent } from '@/components/site/PricingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('en').pricing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/pricing', 'en'),
  openGraph: openGraphFor('en'),
};

export default function PricingPage() {
  return <PricingContent locale="en" />;
}
