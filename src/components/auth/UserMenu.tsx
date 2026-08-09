'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/client';
import { PLAN_CREDITS, type Plan } from '@/lib/credits';

interface UserMenuProps {
  name: string | null;
  email: string | null;
  plan: Plan;
  credits: number;
}

const PLAN_NAMES: Record<Plan, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  unlimited: 'Unlimited',
};

export function UserMenu({ name, email, plan, credits }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const displayName = name?.trim() || email?.split('@')[0] || 'MindMapAny user';
  const initial = displayName.slice(0, 1).toUpperCase();
  const creditLimit = PLAN_CREDITS[plan];
  const creditPercent = plan === 'unlimited' ? 100 : Math.min(100, Math.max(0, (credits / creditLimit) * 100));

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="group flex h-10 items-center gap-1.5 rounded-xl border border-transparent px-1.5 transition-colors hover:border-border-strong hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102f53] text-xs font-bold text-white shadow-sm">
          {initial}
        </span>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className={`hidden h-3.5 w-3.5 text-text-subtle transition-transform sm:block ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6.5 8 3.5 3.5L13.5 8" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border bg-surface shadow-[0_24px_70px_rgb(18_48_78/0.2)]"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <div className="flex items-center gap-3 px-4 pb-3 pt-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#102f53] text-sm font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-text">{displayName}</div>
              {email && <div className="truncate text-xs text-text-subtle">{email}</div>}
            </div>
          </div>

          <div className="mx-3 rounded-xl bg-bg-subtle p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-brand-600">{PLAN_NAMES[plan]}</span>
              <span className="font-mono text-xs font-semibold tabular-nums text-text-muted">
                {plan === 'unlimited' ? 'Unlimited credits' : `${credits} credits`}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border-base">
              <div className="h-full rounded-full bg-brand-600 transition-[width] duration-300" style={{ width: `${creditPercent}%` }} />
            </div>
          </div>

          {plan !== 'unlimited' && (
            <div className="px-3 pb-2 pt-3">
              <Link href="/pricing" role="menuitem" onClick={() => setOpen(false)} className="btn btn-primary h-10 w-full text-xs">
                Upgrade plan
              </Link>
            </div>
          )}

          <nav className="p-2" aria-label="Account navigation">
            <MenuLink href="/billing" label="Subscription" icon="card" onSelect={() => setOpen(false)} />
            <MenuLink href="/support" label="Help & feedback" icon="help" onSelect={() => setOpen(false)} />
            <MenuLink href="/#faq" label="FAQ" icon="question" onSelect={() => setOpen(false)} />
          </nav>

          <div className="border-t p-2" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              role="menuitem"
              disabled={signingOut}
              onClick={handleSignOut}
              className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-text-muted transition-colors hover:bg-bg-subtle hover:text-text disabled:cursor-wait disabled:opacity-60"
            >
              <MenuIcon name="logout" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, label, icon, onSelect }: { href: string; label: string; icon: IconName; onSelect: () => void }) {
  return (
    <Link href={href} role="menuitem" onClick={onSelect} className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg-subtle hover:text-text">
      <MenuIcon name={icon} />
      {label}
    </Link>
  );
}

type IconName = 'card' | 'help' | 'question' | 'logout';

function MenuIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18" /></>,
    help: <><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" /><path d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-1 .7-1.7 1.1-1.7 2.5M12 17h.01" /></>,
    question: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v10a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 14.5v-10Z" /><path d="M9.5 8.5a2.6 2.6 0 1 1 4.2 2c-1 .7-1.7 1.1-1.7 2M12 15h.01" /></>,
    logout: <><path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5M14 8l4 4-4 4M8 12h10" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">{paths[name]}</svg>;
}
