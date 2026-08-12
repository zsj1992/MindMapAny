'use client';

import { useState, type FormEvent } from 'react';
import { authClient, signIn, signUp } from '@/lib/auth/client';
import { trackEvent } from '@/lib/analytics';

type Mode = 'signin' | 'signup' | 'forgot';

const MIN_PASSWORD_LENGTH = 8;

/**
 * 邮箱 + 密码：登录 / 注册 / 找回密码三态共用一个表单。
 *
 * emailVerificationRequired 由服务端传下来，前端不自己猜：
 * 是否需要去邮箱激活取决于 Resend 配没配好，这个只有服务端知道。
 */
export function EmailAuthForm({ next, emailVerificationRequired }: { next: string; emailVerificationRequired: boolean }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (mode === 'forgot') {
      setBusy(true);
      setError(null);
      await authClient.requestPasswordReset({ email: trimmedEmail, redirectTo: '/reset-password' });
      setBusy(false);
      // 无论邮箱是否存在都给同一句话，否则这个接口就成了账号枚举器
      setNotice('If an account exists for that address, a reset link is on its way. It expires in an hour.');
      return;
    }

    if (!password) return;
    if (mode === 'signup' && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setBusy(true);
    setError(null);

    const result = mode === 'signin'
      ? await signIn.email({ email: trimmedEmail, password, callbackURL: next })
      : await signUp.email({
          email: trimmedEmail,
          password,
          name: name.trim() || trimmedEmail.split('@')[0],
          callbackURL: next,
        });

    if (result.error) {
      setBusy(false);
      setError(friendlyError(result.error.code, result.error.message, mode));
      return;
    }

    if (mode === 'signup') {
      trackEvent('signup_completed', {
        method: 'email',
        verification_required: emailVerificationRequired,
      });
    }

    // 需要邮箱验证时注册不会自动登录，这时候跳转过去只会被弹回来
    if (mode === 'signup' && emailVerificationRequired) {
      setBusy(false);
      setNotice(`Almost there — we sent a confirmation link to ${trimmedEmail}. Open it to activate your account, then sign in.`);
      return;
    }

    window.location.assign(next);
  };

  if (notice) {
    return (
      <div className="mt-6">
        <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          {notice}
        </p>
        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setMode('signin');
            setPassword('');
          }}
          className="btn btn-secondary mt-4 h-11 w-full text-sm"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      {mode === 'signup' && (
        <Field
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="How should we call you?"
          autoComplete="name"
        />
      )}

      <Field
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      {mode !== 'forgot' && (
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder={mode === 'signup' ? `At least ${MIN_PASSWORD_LENGTH} characters` : '••••••••'}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
        />
      )}

      {mode === 'signin' && (
        <p className="text-right">
          <button
            type="button"
            onClick={() => {
              setMode('forgot');
              setError(null);
            }}
            className="text-[11px] font-medium text-text-subtle underline-offset-2 hover:text-brand-600 hover:underline"
          >
            Forgot your password?
          </button>
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary h-11 w-full text-sm">
        {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
      </button>

      <p className="pt-1 text-center text-xs text-text-subtle">
        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError(null);
          }}
          className="ml-1.5 font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
        >
          {mode === 'signin' ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </form>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="field mt-1 h-11 w-full px-3 text-sm"
      />
    </label>
  );
}

/** Better Auth 的原始错误码对用户没有意义，这里只翻译成能指导下一步动作的话 */
function friendlyError(code: string | undefined, message: string | undefined, mode: Mode): string {
  switch (code) {
    case 'INVALID_EMAIL_OR_PASSWORD':
      return 'That email and password combination is not correct.';
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return 'An account with this email already exists. Sign in instead, or use the Google button if you originally signed up that way.';
    case 'PASSWORD_TOO_SHORT':
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.';
    case 'RATE_LIMITED':
      return 'Too many attempts from this network. Please wait a while and try again.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Please confirm your email first — check your inbox for the link we sent when you signed up.';
    default:
      return message || (mode === 'signin' ? 'Could not sign you in. Please try again.' : 'Could not create the account. Please try again.');
  }
}
