import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyCreemSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}

export function creemEventDetails(object: Record<string, unknown>, eventType: string) {
  const customer = asRecord(object.customer);
  const subscription = asRecord(object.subscription);
  const product = asRecord(object.product) ?? asRecord(subscription?.product);
  const metadata = asRecord(object.metadata) ?? asRecord(subscription?.metadata);
  return {
    userId: stringValue(metadata?.userId),
    binding: stringValue(metadata?.binding),
    email: stringValue(customer?.email) ?? stringValue(object.customer_email),
    customerId: stringValue(customer?.id) ?? (typeof object.customer === 'string' ? object.customer : null),
    subscriptionId: stringValue(subscription?.id) ?? (typeof object.subscription === 'string' ? object.subscription : eventType.startsWith('subscription.') ? stringValue(object.id) : null),
    productId: stringValue(product?.id) ?? (typeof object.product === 'string' ? object.product : null),
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null;
}
