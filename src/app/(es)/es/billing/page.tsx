import type { Metadata } from 'next';
import { BillingContent } from '@/components/site/BillingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('es').billing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/billing', 'es'),
  openGraph: openGraphFor('es'),
};

export default function PageEs() {
  return <BillingContent locale="es" />;
}
