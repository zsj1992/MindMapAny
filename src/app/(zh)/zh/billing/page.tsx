import type { Metadata } from 'next';
import { BillingContent } from '@/components/site/BillingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('zh-CN').billing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/billing', 'zh-CN'),
  openGraph: openGraphFor('zh-CN'),
};

export default function PageZh() {
  return <BillingContent locale="zh-CN" />;
}
