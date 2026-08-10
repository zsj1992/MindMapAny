/**
 * 事务邮件模板。
 *
 * 内联样式而不是 <style> 标签：Gmail 会剥掉 <head> 里的样式表。
 * 每封信都同时给 html 和 text —— 只发 HTML 会明显拉高进垃圾箱的概率。
 */

const BRAND = '#102f53';

function shell(opts: { heading: string; body: string; ctaLabel: string; ctaUrl: string; footer: string }): string {
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1b2a3d;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;border:1px solid #e3e8ef;">
    <tr><td style="padding:32px 32px 8px;">
      <div style="font-size:15px;font-weight:700;color:${BRAND};letter-spacing:-0.01em;">MindMapAny</div>
    </td></tr>
    <tr><td style="padding:8px 32px 0;">
      <h1 style="margin:0;font-size:20px;line-height:1.35;font-weight:700;letter-spacing:-0.02em;">${opts.heading}</h1>
      <p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:#4a5a70;">${opts.body}</p>
    </td></tr>
    <tr><td style="padding:24px 32px 8px;">
      <a href="${opts.ctaUrl}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px;">${opts.ctaLabel}</a>
    </td></tr>
    <tr><td style="padding:16px 32px 32px;">
      <p style="margin:0;font-size:12px;line-height:1.7;color:#7b8ba1;">${opts.footer}</p>
      <p style="margin:12px 0 0;font-size:11px;line-height:1.6;color:#9aa8bb;word-break:break-all;">If the button does not work, paste this link into your browser:<br>${opts.ctaUrl}</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function verificationEmail(url: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Confirm your email for MindMapAny',
    html: shell({
      heading: 'Confirm your email address',
      body: 'Click the button below to confirm this address and finish setting up your MindMapAny account.',
      ctaLabel: 'Confirm email',
      ctaUrl: url,
      footer: 'This link expires in 1 hour. If you did not create a MindMapAny account, you can ignore this email — no account will be activated.',
    }),
    text: [
      'Confirm your email address',
      '',
      'Open this link to confirm your address and finish setting up your MindMapAny account:',
      url,
      '',
      'This link expires in 1 hour. If you did not create a MindMapAny account, you can ignore this email.',
    ].join('\n'),
  };
}

export function resetPasswordEmail(url: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Reset your MindMapAny password',
    html: shell({
      heading: 'Reset your password',
      body: 'We received a request to reset the password for this MindMapAny account. Click below to choose a new one.',
      ctaLabel: 'Reset password',
      ctaUrl: url,
      footer: 'This link expires in 1 hour and can only be used once. If you did not request a password reset, you can ignore this email — your current password stays active.',
    }),
    text: [
      'Reset your password',
      '',
      'Open this link to choose a new password for your MindMapAny account:',
      url,
      '',
      'This link expires in 1 hour and can only be used once. If you did not request it, ignore this email — your current password stays active.',
    ].join('\n'),
  };
}
