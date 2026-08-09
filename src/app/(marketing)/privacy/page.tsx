import type { Metadata } from 'next';
import { PolicyPage } from '@/components/site/PolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How MindMapAny collects, uses, stores and protects your personal information and content.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Legal & privacy"
      title="Privacy Policy"
      description="We collect only what the mind mapping service needs, and we try to keep the purpose of that data clear, limited and under your control."
    >
      <h2>1. Scope</h2>
      <p>This policy covers the MindMapAny website, workbench and related services. Using the service means you have read this policy; if you do not agree with it, please stop using the service.</p>

      <h2>2. Information we collect</h2>
      <ul>
        <li><strong>Account information:</strong> login email, display name, avatar, and the identifiers needed for authentication.</li>
        <li><strong>Content you submit:</strong> text, documents or web links, along with the mind maps generated, edited and saved from them.</li>
        <li><strong>Usage and device information:</strong> IP address, browser type, access times, error logs, feature usage and necessary security records.</li>
        <li><strong>Transaction information:</strong> plan, order and subscription status. Full payment card details are handled by payment providers such as Creem; we never store full card numbers.</li>
      </ul>

      <h2>3. How we use information</h2>
      <p>We use this information to provide and improve the service, generate and store mind maps, maintain accounts and credit balances, process subscriptions, prevent fraud and abuse, respond to support requests, and meet our legal obligations. We do not sell your personal information without your explicit consent.</p>

      <h2>4. AI and third-party services</h2>
      <p>To extract, structure and generate content we may send the portions of your content required for the task to trusted AI model, cloud infrastructure, authentication, analytics and payment providers. We require those providers to process the data only for the agreed purpose. Please do not submit passwords, payment card numbers, medical records or other highly sensitive information that the service does not need.</p>

      <h2>5. Cookies and local storage</h2>
      <p>We use essential cookies and local storage to keep you signed in, remember your theme preference, and maintain security and abuse prevention. If we ever use non-essential analytics or advertising cookies, we will provide the corresponding notice and choices in regions where applicable law requires them.</p>

      <h2>6. Retention and security</h2>
      <p>We keep information only as long as needed to provide the service, resolve disputes and meet legal obligations. When you delete content or your account, the related data is deleted or anonymised in our live systems; residual copies may persist for a limited time due to backup rotation, security investigations and statutory retention requirements. We apply reasonable access controls, encrypted transport and monitoring, but no online service can promise absolute security.</p>

      <h2>7. Your rights</h2>
      <p>You may request access to, correction of, export of or deletion of your personal information, and you may object to or restrict certain processing. We handle requests according to your location and applicable law. Please send requests from your account email so we can verify your identity.</p>

      <h2>8. Children&apos;s privacy</h2>
      <p>The service is not directed at children under 13 and we do not knowingly collect their personal information. Minors should use the service with the consent and guidance of a parent or guardian.</p>

      <h2>9. Policy updates and contact</h2>
      <p>We will explain material changes through the website or an account notice. For privacy questions or data rights requests, contact <a href="mailto:support@mindmapany.com">support@mindmapany.com</a>. We usually reply within 3 business days.</p>
    </PolicyPage>
  );
}
