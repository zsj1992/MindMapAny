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
  { userId: 'user_1', email: 'user@example.com', customerId: 'cust_1', subscriptionId: 'sub_1', productId: 'prod_1' },
);

console.log('✓ Creem webhook verification: all cases passed');
