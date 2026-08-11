const GRANT_EVENTS = new Set(['checkout.completed', 'subscription.active', 'subscription.paid', 'subscription.trialing']);
const REVOKE_EVENTS = new Set(['subscription.paused', 'subscription.canceled', 'refund.created', 'dispute.created']);

export function billingActionFor(eventType: string): 'grant' | 'revoke' | 'ignore' {
  if (GRANT_EVENTS.has(eventType)) return 'grant';
  if (REVOKE_EVENTS.has(eventType)) return 'revoke';
  // subscription.expired is deliberately ignored: Creem can still recover payment in this state.
  return 'ignore';
}
