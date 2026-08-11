import assert from 'node:assert/strict';
import { PLAN_CREDITS } from '@/lib/credits';
import { billingActionFor } from './events';
import { billingBindingFor, paymentLinkFor, planForProduct, productIdFor, verifyBillingBinding, type BillingPeriod, type PaidPlan } from './creem';

/*
 * Creem 后台上线产品的真实 ID 与价格，2026-08-10 逐个页面核对过。
 *
 * 钉在这里的理由：这些是外部标识符，写错一个字符不会有任何编译错误，
 * 只会在真实付款时命中 unknown_product —— 钱收了、套餐发不出去。
 * 改动这张表必须同时去后台核对，测试失败就是在提醒这件事。
 *
 * 价格同时和定价页文案对齐：后台改价而落地页没改，用户会在结账页看到另一个数字。
 */
const LIVE_PRODUCTS: Record<PaidPlan, Record<BillingPeriod, { id: string; price: string }>> = {
  basic: {
    monthly: { id: 'prod_4uplpJymMhEJueMTL7NG7I', price: '$8.99 / month' },
    annual: { id: 'prod_1jkFZhmPjl6X3Gd8DPa9op', price: '$64.68 / year' },
  },
  pro: {
    monthly: { id: 'prod_3307KvJ4iAYdoQWkCPqVK2', price: '$17.99 / month' },
    annual: { id: 'prod_4PdI15etxlhLrz5zeMFnTi', price: '$129.48 / year' },
  },
  unlimited: {
    monthly: { id: 'prod_5yxmblNsnDamKCiu2EP1eu', price: '$26.99 / month' },
    annual: { id: 'prod_1G8rCaLIM78vgXmPWLvToN', price: '$194.28 / year' },
  },
};

/** Creem 产品描述里承诺的每月积分。发放少于承诺，用户第一天就会发现。 */
const PROMISED_CREDITS: Record<PaidPlan, number> = {
  basic: 1000,
  pro: 2000,
  unlimited: Number.POSITIVE_INFINITY,
};

const plans: PaidPlan[] = ['basic', 'pro', 'unlimited'];
const periods: BillingPeriod[] = ['monthly', 'annual'];
const ids = plans.flatMap((plan) => periods.map((period) => productIdFor(plan, period)));

assert.equal(new Set(ids).size, 6, 'every price must map to a unique Creem product');
for (const plan of plans) {
  for (const period of periods) assert.equal(planForProduct(productIdFor(plan, period)), plan);
}
assert.equal(planForProduct('prod_unknown'), null);

const bindingSecret = 'test-binding-secret';
const paymentLink = new URL(paymentLinkFor('prod_test', 'user_1', bindingSecret));
const binding = paymentLink.searchParams.get('metadata[binding]');
assert.equal(binding, billingBindingFor('user_1', bindingSecret));
assert.equal(verifyBillingBinding('user_1', binding, bindingSecret), true);
assert.equal(verifyBillingBinding('user_2', binding, bindingSecret), false, 'a binding cannot be moved to another user');
assert.equal(verifyBillingBinding('user_1', '0'.repeat(64), bindingSecret), false);
assert.equal(billingActionFor('subscription.expired'), 'ignore', 'expired can still recover and must not revoke access');
assert.equal(billingActionFor('subscription.canceled'), 'revoke');

for (const plan of plans) {
  for (const period of periods) {
    assert.equal(
      productIdFor(plan, period),
      LIVE_PRODUCTS[plan][period].id,
      `${plan}/${period} 的产品 ID 与 Creem 后台不符 —— 请去后台核对后再改这张表`,
    );
  }
  assert.equal(PLAN_CREDITS[plan], PROMISED_CREDITS[plan], `${plan} 发放的积分与 Creem 产品描述承诺的不一致`);
}

console.log('✓ Creem product mapping: all cases passed');
