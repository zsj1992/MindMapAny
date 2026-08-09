import { NextResponse } from 'next/server';
import { claimBillingEvent, grantSubscription, releaseBillingEvent, revokeSubscription } from '@/lib/db/repositories/billing';
import { planForProduct } from '@/lib/billing/creem';
import { creemEventDetails, verifyCreemSignature } from '@/lib/billing/webhook';

export const runtime = 'nodejs';

interface CreemEvent {
  id?: string;
  eventType?: string;
  object?: Record<string, unknown>;
}

const GRANT_EVENTS = new Set(['checkout.completed', 'subscription.active', 'subscription.paid', 'subscription.trialing']);
const REVOKE_EVENTS = new Set(['subscription.paused', 'subscription.expired', 'subscription.canceled', 'refund.created', 'dispute.created']);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('creem-signature');
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[billing] webhook_secret_missing');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  if (!signature || !verifyCreemSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  let event: CreemEvent;
  try {
    event = JSON.parse(rawBody) as CreemEvent;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!event.id || !event.eventType || !event.object) {
    return NextResponse.json({ error: 'invalid_event' }, { status: 400 });
  }
  if (!(await claimBillingEvent(event.id, event.eventType))) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    const details = creemEventDetails(event.object, event.eventType);
    if (GRANT_EVENTS.has(event.eventType)) {
      const plan = details.productId ? planForProduct(details.productId) : null;
      if (!plan) throw new Error(`unknown_product:${details.productId ?? 'missing'}`);
      const granted = await grantSubscription({ ...details, plan, status: event.eventType });
      if (!granted) throw new Error(`profile_not_found:${details.email ?? 'missing_email'}`);
    } else if (REVOKE_EVENTS.has(event.eventType)) {
      const revoked = await revokeSubscription({ ...details, status: event.eventType });
      if (!revoked) throw new Error(`profile_not_found:${details.email ?? 'missing_email'}`);
    }
    console.info('[billing] webhook_processed', { eventId: event.id, eventType: event.eventType });
    return NextResponse.json({ ok: true });
  } catch (error) {
    await releaseBillingEvent(event.id).catch(() => undefined);
    console.error('[billing] webhook_failed', { eventId: event.id, eventType: event.eventType, error });
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
  }
}
