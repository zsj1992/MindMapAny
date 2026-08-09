import assert from 'node:assert/strict';
import { planForProduct, productIdFor, type BillingPeriod, type PaidPlan } from './creem';

const plans: PaidPlan[] = ['basic', 'pro', 'unlimited'];
const periods: BillingPeriod[] = ['monthly', 'annual'];
const ids = plans.flatMap((plan) => periods.map((period) => productIdFor(plan, period)));

assert.equal(new Set(ids).size, 6, 'every price must map to a unique Creem product');
for (const plan of plans) {
  for (const period of periods) assert.equal(planForProduct(productIdFor(plan, period)), plan);
}
assert.equal(planForProduct('prod_unknown'), null);

console.log('✓ Creem product mapping: all cases passed');
