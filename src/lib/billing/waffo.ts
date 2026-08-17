import { WaffoPancake } from '@waffo/pancake-ts';
import type { Plan } from '@/lib/credits';

/**
 * Waffo Pancake 接入。
 *
 * 为什么并存而不是替换 Creem：Creem 的商户审核、KYC 和收款账户都已经跑通，
 * 而 Waffo 还没有过 KYB。真正的理由是支付方式 —— Creem 的收银台只有
 * Google Pay / Apple Pay / 信用卡，没有支付宝和微信，而我们后台看到的
 * 客户 100% 来自中国。Waffo 明确支持这两个钱包和银联。
 *
 * 谁来收钱由 BILLING_PROVIDER 决定，两边的商品和价格保持一致，
 * 这样切换过去之后转化率能直接对比。
 *
 * ⚠️ 一个必须知道的限制：SDK 的类型定义写明，**订阅只支持 card / applepay /
 * googlepay**；微信只在「一次性商品 + CNY」这一种组合下可用。
 * 也就是说光把订阅搬到 Waffo，并不会让中国用户多出微信支付这个选项 ——
 * 要拿到它，得把套餐改成 CNY 计价的一次性积分包。这是产品决策，不是接入细节。
 */

export type BillingProvider = 'creem' | 'waffo';

export function billingProvider(): BillingProvider {
  return process.env.BILLING_PROVIDER === 'waffo' ? 'waffo' : 'creem';
}

/** 测试环境的商品不会出现在生产环境，反之亦然 */
export function waffoTestMode(): boolean {
  return process.env.WAFFO_ENV !== 'prod';
}

export interface WaffoPlanProducts {
  monthly: string;
  annual: string;
}

/**
 * 套餐 → Waffo 商品 id。
 *
 * 走环境变量而不是写死：测试环境和生产环境是两套 id，
 * 而 Creem 那边的常量表是写死的 —— 那套后来出过一次不同步的问题。
 */
export function waffoProductIdFor(plan: Exclude<Plan, 'free'>, period: 'monthly' | 'annual'): string | null {
  const key = `WAFFO_PRODUCT_${plan.toUpperCase()}_${period.toUpperCase()}`;
  return process.env[key] ?? null;
}

let cached: WaffoPancake | null = null;

/** 私钥缺失时返回 null，让调用方回退到 Creem，而不是把结账整个打挂 */
export function waffoClient(): WaffoPancake | null {
  if (cached) return cached;
  const merchantId = process.env.WAFFO_MERCHANT_ID;
  const privateKey = process.env.WAFFO_PRIVATE_KEY;
  if (!merchantId || !privateKey) return null;
  try {
    cached = new WaffoPancake({ merchantId, privateKey });
    return cached;
  } catch (error) {
    // 构造函数在密钥格式错误时会立刻抛错。这属于配置问题，
    // 记下来但不要让用户的结账请求 500。
    console.error('[waffo] invalid_credentials', error);
    return null;
  }
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export async function createWaffoCheckout(opts: {
  plan: Exclude<Plan, 'free'>;
  period: 'monthly' | 'annual';
  userId: string;
  email?: string | undefined;
  successUrl: string;
}): Promise<CheckoutSession | null> {
  const client = waffoClient();
  const productId = waffoProductIdFor(opts.plan, opts.period);
  if (!client || !productId) return null;

  const session = await client.checkout.createSession({
    productId,
    currency: 'USD',
    successUrl: opts.successUrl,
    // userId 必须原样回到 webhook：这是把一笔付款认回某个账号的唯一依据。
    // Creem 那边用的是签名过的查询参数，这里 metadata 是官方通道，更可靠。
    metadata: { userId: opts.userId, plan: opts.plan, period: opts.period },
    // 订单侧也留一份账号标识：webhook 的 metadata 万一没回传，还有第二条线索
    orderMerchantExternalId: opts.userId,
    ...(opts.email ? { buyerEmail: opts.email } : {}),
  });

  return { url: session.checkoutUrl, sessionId: session.sessionId };
}
