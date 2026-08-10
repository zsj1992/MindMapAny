import { MarketingShell } from '@/components/site/MarketingShell';

/** 中文营销页外壳。嵌在英文 layout 里会套两层页头，所以这里不复用父级布局的结构。 */
export default function MarketingLayoutZh({ children }: LayoutProps<'/zh'>) {
  return <MarketingShell locale="zh-CN">{children}</MarketingShell>;
}
