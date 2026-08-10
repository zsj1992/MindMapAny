import { MarketingShell } from '@/components/site/MarketingShell';

/** 英文营销页外壳。中文在 zh/layout.tsx，两者只差一个 locale。 */
export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return <MarketingShell locale="en">{children}</MarketingShell>;
}
