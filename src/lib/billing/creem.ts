import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Plan } from '@/lib/credits';

export type PaidPlan = Exclude<Plan, 'free'>;
export type BillingPeriod = 'monthly' | 'annual';

const PRODUCTS: Record<PaidPlan, Record<BillingPeriod, string>> = {
  basic: {
    monthly: 'prod_4uplpJymMhEJueMTL7NG7I',
    annual: 'prod_1jkFZhmPjl6X3Gd8DPa9op',
  },
  pro: {
    monthly: 'prod_3307KvJ4iAYdoQWkCPqVK2',
    annual: 'prod_4PdI15etxlhLrz5zeMFnTi',
  },
  unlimited: {
    monthly: 'prod_5yxmblNsnDamKCiu2EP1eu',
    annual: 'prod_1G8rCaLIM78vgXmPWLvToN',
  },
};

const PLAN_BY_PRODUCT = new Map(
  Object.entries(PRODUCTS).flatMap(([plan, periods]) =>
    Object.values(periods).map((productId) => [productId, plan as PaidPlan] as const),
  ),
);

export function productIdFor(plan: PaidPlan, period: BillingPeriod): string {
  return PRODUCTS[plan][period];
}

export function planForProduct(productId: string): PaidPlan | null {
  return PLAN_BY_PRODUCT.get(productId) ?? null;
}

export function billingBindingFor(userId: string, secret: string): string {
  return createHmac('sha256', secret).update(`creem-checkout:${userId}`).digest('hex');
}

export function verifyBillingBinding(userId: string | null | undefined, binding: string | null | undefined, secret: string): boolean {
  if (!userId || !binding || !/^[a-f0-9]{64}$/i.test(binding)) return false;
  const expected = billingBindingFor(userId, secret);
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(binding, 'hex'));
}

export function paymentLinkFor(productId: string, userId: string, secret: string): string {
  const url = new URL(`https://www.creem.io/payment/${productId}`);
  url.searchParams.set('metadata[userId]', userId);
  // userId 在浏览器地址栏里可以修改；绑定签名让 Webhook 能辨认它是否由本站签发。
  url.searchParams.set('metadata[binding]', billingBindingFor(userId, secret));
  url.searchParams.set('metadata[source]', 'mindmapany-pricing');
  return url.toString();
}
