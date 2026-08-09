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

export function paymentLinkFor(productId: string, userId: string): string {
  const url = new URL(`https://www.creem.io/payment/${productId}`);
  url.searchParams.set('metadata[userId]', userId);
  url.searchParams.set('metadata[source]', 'mindmapany-pricing');
  return url.toString();
}
