import { MarketingShell } from '@/components/site/MarketingShell';

/** 德语营销页外壳。独立路由组，避免嵌进英文 layout 里套两层页头。 */
export default function MarketingLayoutDe({ children }: { children: React.ReactNode }) {
  return <MarketingShell locale="de">{children}</MarketingShell>;
}
