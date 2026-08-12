'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function SignupCompletedRedirect({ next, method }: { next: string; method: 'google' | 'github' }) {
  useEffect(() => {
    trackEvent('signup_completed', { method, verification_required: false });
    window.location.replace(next);
  }, [method, next]);

  return (
    <main className="hero-glow flex min-h-[calc(100vh-4rem)] items-center justify-center px-5">
      <p className="text-sm font-medium text-text-muted">Finishing account setup…</p>
    </main>
  );
}
