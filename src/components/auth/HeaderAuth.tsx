'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth/client';

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
    return (
      <Link href="/app/new" className="btn btn-primary h-9 whitespace-nowrap px-3 text-xs sm:px-4 sm:text-sm">
        {/* 手机上「Open workbench」会折成两行把顶栏撑变形，窄屏只留核心词 */}
        <span className="sm:hidden">Workbench</span>
        <span className="hidden sm:inline">Open workbench</span>
      </Link>
    );
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
