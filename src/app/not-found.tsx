import Link from 'next/link';
import { Logo } from '@/components/site/Logo';

export default function NotFound() {
  return (
    <main className="hero-glow flex min-h-screen items-center justify-center px-5 py-16">
      <div className="card w-full max-w-lg p-8 text-center sm:p-10">
        <div className="flex justify-center"><Logo /></div>
        <div className="mt-8 text-7xl font-bold tracking-[-0.06em] text-brand-600">404</div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">这个页面走丢了</h1>
        <p className="mt-3 text-sm leading-7 text-text-muted">链接可能已失效，或者页面还没有准备好。你可以回到首页，或直接生成一张新脑图。</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-secondary h-11 px-5">返回首页</Link>
          <Link href="/app/new" className="btn btn-primary h-11 px-5">开始生成</Link>
        </div>
      </div>
    </main>
  );
}
