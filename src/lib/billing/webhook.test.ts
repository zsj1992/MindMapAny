import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { creemEventDetails, verifyCreemSignature } from './webhook';

const payload = JSON.stringify({ id: 'evt_1', eventType: 'checkout.completed' });
const secret = 'test_webhook_secret';
const signature = createHmac('sha256', secret).update(payload).digest('hex');
assert.equal(verifyCreemSignature(payload, signature, secret), true);
assert.equal(verifyCreemSignature(payload, '0'.repeat(64), secret), false);
assert.equal(verifyCreemSignature(payload, 'bad', secret), false);

assert.deepEqual(
  creemEventDetails({
    customer: { id: 'cust_1', email: 'user@example.com' },
    product: { id: 'prod_1' },
    subscription: { id: 'sub_1' },
    metadata: { userId: 'user_1' },
  }, 'checkout.completed'),
  { userId: 'user_1', binding: null, email: 'user@example.com', customerId: 'cust_1', subscriptionId: 'sub_1', productId: 'prod_1' },
);

/*
 * 真实结账事件里，付款邮箱和账号邮箱常常不是同一个 —— 用私人邮箱或 PayPal 邮箱
 * 付款完全正常。这种事件必须仍然带出 userId，否则匹配不到人，钱收了套餐没发。
 * 之前正是这条链路把一笔付款静默吞掉了。
 */
const paidWithAnotherEmail = creemEventDetails(
  {
    customer: { id: 'cust_2', email: 'personal@gmail.com' },
    product: { id: 'prod_1' },
    metadata: { userId: 'user_1', source: 'mindmapany-pricing' },
  },
  'checkout.completed',
);
assert.equal(paidWithAnotherEmail.userId, 'user_1', '付款邮箱不同也必须保留 userId');
assert.equal(paidWithAnotherEmail.email, 'personal@gmail.com');
assert.equal(paidWithAnotherEmail.customerId, 'cust_2', '兜底匹配要用到 customerId');

// 续费事件通常没有 metadata.userId：这时只能靠 customerId / subscriptionId 认人，
// 两者都必须被解析出来，否则每次自动续费都会掉单。
const renewal = creemEventDetails(
  { id: 'sub_9', customer: 'cust_2', product: 'prod_1' },
  'subscription.paid',
);
assert.equal(renewal.userId, null);
assert.equal(renewal.customerId, 'cust_2', '字符串形式的 customer 也要能取到');
assert.equal(renewal.subscriptionId, 'sub_9', 'subscription.* 事件的 id 就是订阅号');
assert.equal(renewal.productId, 'prod_1');

console.log('✓ Creem webhook verification: all cases passed');
