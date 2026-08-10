import type { Metadata } from 'next';
import { SupportContent } from '@/components/site/SupportContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('zh-CN').support;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/support', 'zh-CN'),
  openGraph: openGraphFor('zh-CN'),
};

export default function PageZh() {
  return <SupportContent locale="zh-CN" />;
}
