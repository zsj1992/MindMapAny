import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyPage } from '@/components/site/PolicyPage';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'How to cancel a MindMapAny subscription, who qualifies for a refund, how to request one, and how long it takes.',
  alternates: { canonical: '/refund-policy' },
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Billing protection"
      title="Refund & Cancellation Policy"
      description="We want billing to be clear, cancellation to be easy, and duplicate charges or service problems to be resolved quickly."
    >
      <h2>1. Cancel any time</h2>
      <p>You can cancel your subscription at any time from the <Link href="/billing">subscription management page</Link> via the Creem Customer Portal. Unless the portal states otherwise, cancellation takes effect at the end of the billing period you have already paid for. You keep access to your plan until then, and you will not be charged again.</p>

      <h2>2. Refund windows</h2>
      <ul>
        <li><strong>First purchase:</strong> you may request a refund within 14 days of your first payment.</li>
        <li><strong>Renewals:</strong> you may request a refund within 7 days of a renewal charge.</li>
        <li><strong>Duplicate or incorrect charges:</strong> refunded in full once verified, with no time limit.</li>
      </ul>
      <p>To the extent permitted by law, we may decline or pro-rate a refund where an account has consumed a large amount of service, shows signs of abuse, or where the request covers substantial compute already spent. Your mandatory statutory consumer rights are not affected.</p>

      <h2>3. How to request a refund</h2>
      <p>Email <a href="mailto:support@mindmapany.com?subject=MindMapAny%20refund%20request">support@mindmapany.com</a> from the address you used at purchase, including your order number, purchase email, the reason for the request, and which transaction you would like refunded. You can also view your orders and request support from the Creem Customer Portal.</p>

      <h2>4. Processing times</h2>
      <p>We usually reply within 3 business days. Approved refunds are processed by Creem back to your original payment method and typically appear within 5–10 business days, depending on your bank, region and payment method.</p>

      <h2>5. Plan changes</h2>
      <p>Upgrade, downgrade and pro-rated amounts are shown before you confirm. If the portal does not support a change you need, contact us and we will handle it.</p>

      <h2>6. Payment processor</h2>
      <p>Creem acts as Merchant of Record and is responsible for payment processing, billing records and applicable taxes. MindMapAny is responsible for delivering the product, account support, and the initial handling of refund requests.</p>
    </PolicyPage>
  );
}
