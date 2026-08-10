'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut, useSession } from '@/lib/auth/client';
import { useHoverMenu } from '@/components/site/useHoverMenu';

/**
 * 营销站页头的登录态。
 *
 * 刻意做成客户端组件：如果在 layout 里服务端读 session，整个落地页就会从静态预渲染
 * 退化成每次请求都渲染 —— 而落地页是我们唯一的 SEO 资产，必须留在边缘缓存里。
 * 页头右上角这一小块延迟一帧出现，代价远小于整页不能静态化。
 */
export function HeaderAuth() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <span className="h-9 w-20 animate-pulse rounded-xl bg-bg-muted sm:w-32" aria-hidden="true" />;
  }

  if (session?.user) {
    return <AccountMenu name={session.user.name ?? null} email={session.user.email ?? null} />;
  }

  return (
    <>
      <Link href="/login" className="btn btn-ghost h-9 whitespace-nowrap px-2 text-xs sm:px-3 sm:text-sm">
        Sign in
      </Link>
      <Link href="/app/new" className="btn btn-primary h-9 whitespace-nowrap px-3 text-xs sm:px-4 sm:text-sm">
        Start free
      </Link>
    </>
  );
}

/**
 * 已登录时的账号下拉框，鼠标悬停展开。
 *
 * 这里刻意不显示积分余额：营销页是静态预渲染的，套餐和余额只有服务端拿得到，
 * 为了页头这一行去多发一次请求不划算。余额在工作台顶栏和 /app 的账号菜单里都有。
 */
function AccountMenu({ name, email }: { name: string | null; email: string | null }) {
  const { open, setOpen, handlers, rootRef } = useHoverMenu();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const displayName = name?.trim() || email?.split('@')[0] || 'Account';
  const initial = displayName.slice(0, 1).toUpperCase();

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative flex items-center gap-2" {...handlers}>
      {/* 主 CTA 保留。下拉是二级动作，不能把「进工作台」这个最高频操作挤成两步 */}
      <Link href="/app/new" className="btn btn-primary h-9 whitespace-nowrap px-3 text-xs sm:px-4 sm:text-sm">
        <span className="sm:hidden">Workbench</span>
        <span className="hidden sm:inline">Open workbench</span>
      </Link>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-transparent px-1 transition-colors hover:border-border-strong hover:bg-bg-subtle"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#102f53] text-[11px] font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[8rem] truncate text-[13px] font-medium text-text-muted lg:block">{displayName}</span>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className={`h-3.5 w-3.5 text-text-subtle transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6.5 8 3.5 3.5L13.5 8" />
        </svg>
      </button>

      {open && (
        // pt 把触发器和面板之间的空隙纳入命中区，避免鼠标下移时穿过死区导致菜单关闭
        <div className="absolute right-0 top-full z-50 pt-[0.55rem]">
          <div
            role="menu"
            className="w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-surface shadow-[0_24px_70px_rgb(18_48_78/0.18)]"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <div className="truncate text-sm font-semibold text-text">{displayName}</div>
              {email && <div className="truncate text-xs text-text-subtle">{email}</div>}
            </div>

            <div className="p-2">
              <MenuLink href="/app/new" label="Quick start" onSelect={() => setOpen(false)} />
              <MenuLink href="/app/maps" label="My mind maps" onSelect={() => setOpen(false)} />
              <MenuLink href="/app/research" label="Deep research" onSelect={() => setOpen(false)} />
              <MenuLink href="/billing" label="Subscription" onSelect={() => setOpen(false)} />
              <MenuLink href="/support" label="Help & feedback" onSelect={() => setOpen(false)} />
            </div>

            <div className="border-t p-2" style={{ borderColor: 'var(--border)' }}>
              <button
                type="button"
                role="menuitem"
                disabled={signingOut}
                onClick={handleSignOut}
                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-text-muted transition-colors hover:bg-bg-subtle hover:text-text disabled:cursor-wait disabled:opacity-60"
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, label, onSelect }: { href: string; label: string; onSelect: () => void }) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="flex h-9 items-center rounded-lg px-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg-subtle hover:text-text"
    >
      {label}
    </Link>
  );
}
