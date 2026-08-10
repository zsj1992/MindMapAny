import { MarketingShell } from '@/components/site/MarketingShell';

/** 日文营销页外壳。独立路由组，避免嵌进英文 layout 里套两层页头。 */
export default function MarketingLayoutJa({ children }: { children: React.ReactNode }) {
  return <MarketingShell locale="ja">{children}</MarketingShell>;
}
