import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/site/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, SITE_URL } from '@/lib/seo/content';

export const metadata: Metadata = {
  title: 'AI 思维导图指南与方法',
  description: '关于 AI 思维导图、文档内容整理、知识结构和学习方法的实用指南。',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MindMapAny 博客',
    url: `${SITE_URL}/blog`,
    blogPost: BLOG_POSTS.map((post) => ({ '@type': 'BlogPosting', headline: post.title, url: `${SITE_URL}/blog/${post.slug}`, datePublished: post.publishedAt })),
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}><div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20"><span className="eyebrow">指南 · 方法 · 对比</span><h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">把复杂内容真正变成知识</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">不追热点堆文章，专注回答内容理解、结构整理和 AI 思维导图使用中的真实问题。</p></div></section>
        <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-2 lg:px-8 lg:py-20">
          {BLOG_POSTS.map((post, index) => <article key={post.slug} className={`rounded-2xl border bg-surface p-6 shadow-sm ${index === 0 ? 'md:col-span-2 md:grid md:grid-cols-[1fr_0.55fr] md:gap-10 md:p-8' : ''}`} style={{ borderColor: 'var(--border)' }}><div><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">{post.category}</div><h2 className="mt-3 text-2xl font-bold tracking-tight"><Link href={`/blog/${post.slug}`} className="hover:text-brand-600">{post.title}</Link></h2><p className="mt-3 text-sm leading-7 text-text-muted">{post.description}</p></div><div className={`${index === 0 ? 'mt-6 flex flex-col justify-end md:mt-0' : ''}`}><div className="mt-5 text-xs text-text-subtle">{post.publishedAt} · {post.readingMinutes} 分钟阅读</div><Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-600">阅读全文 →</Link></div></article>)}
        </section>
      </main>
      <Footer />
    </>
  );
}
