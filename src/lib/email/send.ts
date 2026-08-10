/**
 * Resend 发信。走 HTTP API 而不是官方 SDK：Workers 上 fetch 本来就有，
 * 引 SDK 只是为了包一层 fetch，不值得多一个依赖和一份打包体积。
 *
 * 没配 RESEND_API_KEY 时不抛错，只返回 skipped。原因是发信失败不该让注册失败 ——
 * 用户已经建号成功了，收不到邮件是可恢复的（可以重发），注册中断不是。
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export type SendResult = { ok: true } | { ok: false; reason: 'unconfigured' | 'failed'; detail?: string };

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(opts: { to: string; subject: string; html: string; text: string }): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return { ok: false, reason: 'unconfigured' };

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });

    if (!response.ok) {
      // 正文里可能带 Resend 的具体原因（域名未验证、from 不合法等），日志里留着好排查
      const detail = await response.text().catch(() => '');
      console.error('[email] resend rejected', response.status, detail.slice(0, 300));
      return { ok: false, reason: 'failed', detail: `${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    console.error('[email] resend request failed', error);
    return { ok: false, reason: 'failed' };
  }
}
