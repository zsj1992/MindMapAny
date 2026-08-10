'use client';

import { useState, type FormEvent } from 'react';
import { authClient } from '@/lib/auth/client';

const MIN_PASSWORD_LENGTH = 8;

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setBusy(true);
    setError(null);
    const result = await authClient.resetPassword({ newPassword: password, token });

    if (result.error) {
      setBusy(false);
      setError(result.error.message || 'Could not reset the password. The link may have expired.');
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="mt-6">
        <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          Your password has been updated. You can sign in with it now.
        </p>
        <a href="/login" className="btn btn-primary mt-4 h-11 w-full text-sm">
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <label className="block">
        <span className="text-[11px] font-semibold text-text-muted">New password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          required
          className="field mt-1 h-11 w-full px-3 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-semibold text-text-muted">Confirm password</span>
        <input
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
          required
          className="field mt-1 h-11 w-full px-3 text-sm"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary h-11 w-full text-sm">
        {busy ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
