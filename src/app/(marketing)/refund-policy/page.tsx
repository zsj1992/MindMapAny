import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyPage } from '@/components/site/PolicyPage';

export const metadata: Metadata = {
  title: '退款与取消政策',
  description: '了解 MindMapAny 订阅取消、退款资格、申请方式与处理时间。',
  alternates: { canonical: '/refund-policy' },
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage eyebrow="账单保障" title="退款与取消政策" description="我们希望账单清楚、取消简单，并在出现重复扣款或服务问题时及时解决。">
      <h2>1. 随时取消订阅</h2>
      <p>你可以随时进入<Link href="/billing">订阅管理页面</Link>，通过 Creem Customer Portal 取消订阅。除非门户中另有明确说明，取消在当前已付周期结束时生效；在此之前你仍可使用相应套餐，之后不会再次扣款。</p>

      <h2>2. 退款申请期限</h2>
      <ul>
        <li><strong>首次购买：</strong>在首次付款后的 14 天内可以申请退款。</li>
        <li><strong>自动续费：</strong>在续费扣款后的 7 天内可以申请退款。</li>
        <li><strong>重复或错误扣款：</strong>经核实后将全额退还，不受上述期限限制。</li>
      </ul>
      <p>在适用法律允许的范围内，若账户已大量使用服务、存在滥用行为，或请求涉及已消耗的大量计算资源，我们可能拒绝或按比例处理退款。消费者依法享有的强制性权利不受影响。</p>

      <h2>3. 如何申请</h2>
      <p>请从购买时使用的邮箱发送邮件至 <a href="mailto:support@mindmapany.com?subject=MindMapAny%20退款申请">support@mindmapany.com</a>，附上订单号、购买邮箱、申请原因和希望退款的交易。你也可以在 Creem Customer Portal 中查看订单并请求支持。</p>

      <h2>4. 处理时间</h2>
      <p>我们通常会在 3 个工作日内回复。退款批准后由 Creem 按原支付方式处理，到账时间通常为 5–10 个工作日，具体取决于银行、地区和支付方式。</p>

      <h2>5. 套餐变更</h2>
      <p>升级、降级或按比例计费的金额会在确认前显示。若门户暂不支持某项变更，请联系我们处理。</p>

      <h2>6. 支付处理方</h2>
      <p>Creem 作为 Merchant of Record 负责付款处理、账单凭证和适用税费。MindMapAny 负责产品交付、账户支持及退款请求的初步处理。</p>
    </PolicyPage>
  );
}

