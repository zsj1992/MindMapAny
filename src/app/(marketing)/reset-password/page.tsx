import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Logo } from '@/components/site/Logo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Choose a new password for your MindMapAny account.',
  robots: { index: false },
};

export default async function ResetPasswordPage({ searchParams }: PageProps<'/reset-password'>) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : null;
  const error = typeof params.error === 'string' ? params.error : null;

  return (
    <main className="hero-glow relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="card relative w-full max-w-sm p-7 shadow-xl shadow-brand-900/[0.07] dark:shadow-black/40">
        <Logo />

        {token && !error ? (
          <>
            <h1 className="mt-5 text-xl font-semibold tracking-tight">Choose a new password</h1>
            <p className="mt-1.5 text-sm text-text-muted">Enter a new password for your account.</p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <>
            <h1 className="mt-5 text-xl font-semibold tracking-tight">This link is no longer valid</h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Password reset links expire after an hour and can only be used once. Request a new one from the sign-in page.
            </p>
            <Link href="/login" className="btn btn-primary mt-6 h-11 w-full text-sm">
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
