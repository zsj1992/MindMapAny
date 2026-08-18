import { getCurrentProfile } from '@/lib/auth/session';
import { PLAN_CREDITS, type Plan } from '@/lib/credits';

/**
 * 「当前账号是谁、什么套餐、还剩多少积分」。
 *
 * 抽出来是因为有两个调用方：插件的浮层，和 7 个语言的定价页。
 * 定价页是静态生成的 SEO 页面，不能为了知道用户套餐就改成动态渲染 ——
 * 那会让每次访问都跑一遍服务端，还丢掉整页缓存。所以套餐由页面加载后
 * 客户端问一次，标出「当前套餐」的那一小块内容晚一拍出现，
 * 换取整张页面对搜索引擎和游客仍然是静态的。
 *
 * 只回显账号自己的信息，不含任何可以代替登录的凭据。
 */

export interface AccountSummary {
  signedIn: boolean;
  name?: string;
  plan?: Plan;
  credits?: number | null;
  creditsMax?: number | null;
}

export async function accountSummary(): Promise<AccountSummary> {
  const session = await getCurrentProfile();
  if (!session?.user || !session.profile) return { signedIn: false };
  const { user, profile } = session;
  const unlimited = !Number.isFinite(PLAN_CREDITS[profile.plan]);
  return {
    signedIn: true,
    name: user.name ?? user.email?.split('@')[0] ?? 'Account',
    plan: profile.plan,
    credits: unlimited ? null : profile.credits,
    creditsMax: unlimited ? null : PLAN_CREDITS[profile.plan],
  };
}
