import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyPage } from '@/components/site/PolicyPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'MindMapAny rules on accounts, content, AI output, subscriptions, acceptable use and liability.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Rules of use"
      title="Terms of Service"
      description="These terms explain how you may use MindMapAny, and what each side is responsible for when it comes to content, subscriptions and the service itself."
    >
      <h2>1. Acceptance of these terms</h2>
      <p>By accessing or using MindMapAny you agree to these terms and to our <Link href="/privacy">Privacy Policy</Link>. If you are using the service on behalf of an organisation, you confirm that you are authorised to accept these terms for that organisation.</p>

      <h2>2. What the service does</h2>
      <p>MindMapAny turns text, documents and web content into editable mind maps. Available features, allowances and support scope are those listed on the current <Link href="/pricing">pricing page</Link>. We may continue to improve or adjust features, but we will not retroactively charge you for anything you have not clearly agreed to.</p>

      <h2>3. Accounts and security</h2>
      <p>You agree to provide accurate account information, keep your credentials secure, and take responsibility for activity in your account. Contact support immediately if you notice unauthorised access. You may not share an account in order to work around plan limits.</p>

      <h2>4. Your content</h2>
      <p>You retain your rights in the content you submit and the mind maps you generate. You grant us a limited licence to host, process, display and transmit that content solely in order to provide, maintain and protect the service. You confirm that you have the right to process the content you submit, and you are responsible for your public sharing settings and their consequences.</p>

      <h2>5. AI output</h2>
      <p>AI-generated results may be incomplete, inaccurate or misinterpreted, and do not constitute legal, medical, financial or other professional advice. Verify important information against the original source before relying on it, publishing it or making decisions based on it.</p>

      <h2>6. Acceptable use</h2>
      <p>You may not use the service to infringe the rights of others, distribute malware, circumvent security measures, commit fraud or harassment, generate unlawful content, gain unauthorised automated access to our systems, or place abnormal load on the service in a way that affects other users. Where these rules are broken we may restrict or terminate the account concerned, and cooperate with the competent authorities where the law requires it.</p>

      <h2>7. Subscriptions and payment</h2>
      <p>Paid plans are prepaid monthly or annually and renew automatically until cancelled. The checkout page shows the currency, taxes, billing period and total due before you pay. Creem acts as Merchant of Record and handles payment, billing and applicable taxes. You can cancel at any time from <Link href="/billing">subscription management</Link>; unless stated otherwise, access continues until the end of the period you have paid for.</p>

      <h2>8. Refunds</h2>
      <p>Refund eligibility, request windows and processing are set out in our <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>. That policy does not limit mandatory consumer rights granted by applicable law.</p>

      <h2>9. Availability and limitation of liability</h2>
      <p>We work to keep the service stable, but we do not guarantee uninterrupted or error-free operation. To the maximum extent permitted by law the service is provided &quot;as is&quot; and &quot;as available&quot;, and we are not liable for indirect, incidental or consequential losses. Our total aggregate liability for all claims arising from the service will not exceed the amount you paid for the service in the 12 months before the claim arose.</p>

      <h2>10. Termination and changes</h2>
      <p>You may stop using the service at any time. We may suspend or terminate access in cases of serious violation, security risk or legal requirement. Where these terms change materially we will give reasonable advance notice; continuing to use the service means you accept the updated terms.</p>

      <h2>11. Contact</h2>
      <p>For questions about these terms, your account or the service, email <a href="mailto:support@mindmapany.com">support@mindmapany.com</a>. We usually reply within 3 business days.</p>
    </PolicyPage>
  );
}
