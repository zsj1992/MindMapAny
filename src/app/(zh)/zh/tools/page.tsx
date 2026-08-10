import type { Metadata } from 'next';
import { ToolsIndexContent } from '@/components/site/ToolsIndexContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

const copy = marketingCopy('zh-CN').toolsIndex;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/tools', 'zh-CN'),
  openGraph: openGraphFor('zh-CN'),
};

export default function ToolsPageZh() {
  return <ToolsIndexContent locale="zh-CN" />;
}
