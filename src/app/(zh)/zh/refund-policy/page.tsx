import type { Metadata } from 'next';
import { LegalContent } from '@/components/site/LegalContent';
import { legalCopy } from '@/lib/i18n/legal';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = legalCopy('zh-CN').refund;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/refund-policy', 'zh-CN'),
  openGraph: openGraphFor('zh-CN'),
};

export default function PageZh() {
  return <LegalContent locale="zh-CN" doc="refund" />;
}
