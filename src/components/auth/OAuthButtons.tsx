'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth/client';

const LABEL: Record<string, string> = { google: '使用 Google 登录', github: '使用 GitHub 登录' };

export function OAuthButtons({ providers, next }: { providers: ('google' | 'github')[]; next: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div className="mt-7 space-y-3">
      {providers.map((p) => (
        <button
          key={p}
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            setBusy(p);
            // callbackURL 由 Better Auth 在回调后跳转，这里只传站内相对路径
            await signIn.social({ provider: p, callbackURL: next });
          }}
          className="btn btn-secondary h-11 w-full"
        >
          {busy === p ? '跳转中…' : (LABEL[p] ?? p)}
        </button>
      ))}
    </div>
  );
}
