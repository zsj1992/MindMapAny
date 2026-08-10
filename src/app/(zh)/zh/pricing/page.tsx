import type { Metadata } from 'next';
import { PricingContent } from '@/components/site/PricingContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('zh-CN').pricing;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/pricing', 'zh-CN'),
  openGraph: openGraphFor('zh-CN'),
};

export default function PricingPageZh() {
  return <PricingContent locale="zh-CN" />;
}
