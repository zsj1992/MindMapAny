'use client';

import { useState } from 'react';
import { getSupabaseBrowser, supabaseEnabled } from '@/lib/db/browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const enabled = supabaseEnabled();

  const sendLink = async () => {
    if (!email.includes('@')) return;
    setStatus('sending');
    const { error } = await getSupabaseBrowser().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('sent');
    }
  };

  const signInWithGoogle = async () => {
    await getSupabaseBrowser().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <main className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-semibold tracking-tight">登录 MapAny</h1>
      <p className="mt-2 text-sm text-text-muted">登录后可保存脑图、生成分享链接，并获得免费额度。</p>

      {!enabled ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          登录功能未配置：请先设置 NEXT_PUBLIC_SUPABASE_URL 与 ANON_KEY。
        </p>
      ) : status === 'sent' ? (
        <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
          登录链接已发送至 {email}，请查收邮件。
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="btn btn-secondary mt-7 h-11 w-full"
          >
            使用 Google 账号登录
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-text-subtle">
            <span className="h-px flex-1" style={{ background: 'var(--border)' }} />或<span className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendLink()}
            placeholder="you@example.com"
            className="field"
          />
          <button
            type="button"
            onClick={sendLink}
            disabled={status === 'sending'}
            className="btn btn-primary mt-3 h-11 w-full"
          >
            {status === 'sending' ? '发送中…' : '发送登录链接'}
          </button>
          {status === 'error' && <p className="mt-3 text-sm text-red-600">{message}</p>}
        </>
      )}
    </main>
  );
}
