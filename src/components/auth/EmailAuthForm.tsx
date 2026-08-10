'use client';

import { useState, type FormEvent } from 'react';
import { signIn, signUp } from '@/lib/auth/client';

type Mode = 'signin' | 'signup';

const MIN_PASSWORD_LENGTH = 8;

/**
 * 邮箱 + 密码登录 / 注册。两种模式共用一个表单，只在注册时多一个姓名字段。
 *
 * 没有「忘记密码」入口：重置密码要发邮件，而这个项目还没有邮件服务。
 * 与其放一个点了没反应的链接，不如直接告诉用户可以用 Google 登录同一个邮箱。
 */
export function EmailAuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return;
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

    // autoSignIn 打开时注册成功即已登录，两种模式都直接进目标页
    window.location.assign(next);
  };

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

      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder={mode === 'signup' ? `At least ${MIN_PASSWORD_LENGTH} characters` : '••••••••'}
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        required
      />

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary h-11 w-full text-sm">
        {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
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
    default:
      return message || (mode === 'signin' ? 'Could not sign you in. Please try again.' : 'Could not create the account. Please try again.');
  }
}
