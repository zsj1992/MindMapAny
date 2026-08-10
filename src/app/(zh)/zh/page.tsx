import type { Metadata } from 'next';
import { HomeContent } from '@/components/site/HomeContent';
import { marketingCopy } from '@/lib/i18n/marketing';
import { alternatesFor, OG_LOCALE } from '@/lib/i18n/routes';

const copy = marketingCopy('zh-CN').home;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: alternatesFor('/', 'zh-CN'),
  openGraph: { locale: OG_LOCALE['zh-CN'] },
};

export default function HomePageZh() {
  return <HomeContent locale="zh-CN" />;
}
