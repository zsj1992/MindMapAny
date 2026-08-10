import type { Metadata } from 'next';
import { BillingContent } from '@/components/site/BillingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('de').billing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/billing', 'de'),
  openGraph: openGraphFor('de'),
};

export default function PageDe() {
  return <BillingContent locale="de" />;
}
