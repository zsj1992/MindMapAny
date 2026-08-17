import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { paymentLinkFor, productIdFor } from '@/lib/billing/creem';
import { billingProvider, createWaffoCheckout } from '@/lib/billing/waffo';
import { recordAttempt } from '@/lib/db/repositories/checkout-attempts';

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

  // 记在跳转之前：跳走之后这个请求就结束了，没有第二次机会
  await recordAttempt({ userId: user.id, plan: parsed.data.plan, period: parsed.data.period });

  /*
   * 渠道由 BILLING_PROVIDER 决定。Waffo 那边任何一步没配好都回退到 Creem ——
   * 结账页宁可用旧渠道，也不能因为新渠道配置缺失就把想付钱的人挡在门外。
   */
  if (billingProvider() === 'waffo') {
    try {
      const session = await createWaffoCheckout({
        plan: parsed.data.plan,
        period: parsed.data.period,
        userId: user.id,
        email: user.email ?? undefined,
        successUrl: new URL('/billing/success', url.origin).toString(),
      });
      if (session) return NextResponse.redirect(session.url, 303);
      console.error('[billing] waffo_unconfigured_falling_back', { plan: parsed.data.plan, period: parsed.data.period });
    } catch (error) {
      console.error('[billing] waffo_checkout_failed', error);
    }
  }

  const productId = productIdFor(parsed.data.plan, parsed.data.period);
  const bindingSecret = process.env.BETTER_AUTH_SECRET;
  if (!bindingSecret) return NextResponse.json({ error: { code: 'billing_unavailable' } }, { status: 503 });
  return NextResponse.redirect(paymentLinkFor(productId, user.id, bindingSecret), 303);
}
