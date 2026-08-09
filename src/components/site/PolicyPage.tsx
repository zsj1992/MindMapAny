import type { ReactNode } from 'react';

export function PolicyPage({
  eyebrow,
  title,
  description,
  updated = '2026 年 8 月 9 日',
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-bg">
      <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-4xl px-5 py-14 sm:py-18">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-text-muted">{description}</p>
          <p className="mt-4 text-xs text-text-subtle">最后更新：{updated}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <article className="policy-content rounded-2xl border bg-surface p-6 shadow-sm sm:p-10">
          {children}
        </article>
      </div>
    </main>
  );
}

