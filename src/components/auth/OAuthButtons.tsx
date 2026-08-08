'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth/client';

/** 官方品牌标记。用户认的是这个图形，纯文字按钮的点击率明显更差。 */
const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.26-2.09 3.58-5.17 3.58-8.87z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z"
    />
  </svg>
);

const GitHubMark = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true">
    <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.23c-3.34.72-4.04-1.4-4.04-1.4-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3z" />
  </svg>
);

const PROVIDERS = {
  google: { label: '使用 Google 继续', Mark: GoogleMark },
  github: { label: '使用 GitHub 继续', Mark: GitHubMark },
} as const;

export function OAuthButtons({ providers, next }: { providers: ('google' | 'github')[]; next: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div className="mt-8 space-y-3">
      {providers.map((p) => {
        const { label, Mark } = PROVIDERS[p];
        return (
          <button
            key={p}
            type="button"
            disabled={busy !== null}
            onClick={async () => {
              setBusy(p);
              // callbackURL 由 Better Auth 在回调后跳转，只接受站内相对路径
              await signIn.social({ provider: p, callbackURL: next });
            }}
            className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-xl border bg-surface text-[15px] font-medium text-text shadow-sm transition-all hover:border-brand-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            {busy === p ? (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin text-brand-500" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                  <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                正在跳转…
              </>
            ) : (
              <>
                <Mark />
                {label}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
