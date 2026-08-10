import type { Metadata } from 'next';
import { LegalContent } from '@/components/site/LegalContent';
import { legalCopy } from '@/lib/i18n/legal';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = legalCopy('en').privacy;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/privacy', 'en'),
  openGraph: openGraphFor('en'),
};

export default function Page() {
  return <LegalContent locale="en" doc="privacy" />;
}
