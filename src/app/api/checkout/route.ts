import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { paymentLinkFor, productIdFor } from '@/lib/billing/creem';

const querySchema = z.object({
  plan: z.enum(['basic', 'pro', 'unlimited']),
  period: z.enum(['monthly', 'annual']),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: { code: 'bad_request' } }, { status: 400 });

  const user = await getCurrentUser();
  if (!user) {
    const next = `/api/checkout?plan=${parsed.data.plan}&period=${parsed.data.period}`;
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, url.origin));
  }

  const productId = productIdFor(parsed.data.plan, parsed.data.period);
  const bindingSecret = process.env.BETTER_AUTH_SECRET;
  if (!bindingSecret) return NextResponse.json({ error: { code: 'billing_unavailable' } }, { status: 503 });
  return NextResponse.redirect(paymentLinkFor(productId, user.id, bindingSecret), 303);
}
