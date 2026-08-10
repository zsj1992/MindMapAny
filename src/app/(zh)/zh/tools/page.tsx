import type { Metadata } from 'next';
import { ToolsIndexContent } from '@/components/site/ToolsIndexContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, OG_LOCALE } from '@/lib/i18n/routes';

const copy = marketingCopy('zh-CN').toolsIndex;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/tools', 'zh-CN'),
  openGraph: { locale: OG_LOCALE['zh-CN'] },
};

export default function ToolsPageZh() {
  return <ToolsIndexContent locale="zh-CN" />;
}
