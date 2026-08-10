import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/site/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, SITE_URL } from '@/lib/seo/content';

export const metadata: Metadata = {
  title: 'AI mind map guides & methods',
  description: 'Practical guides on AI mind maps, organising document content, knowledge structure and study methods.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The MindMapAny blog',
    url: `${SITE_URL}/blog`,
    blogPost: BLOG_POSTS.map((post) => ({ '@type': 'BlogPosting', headline: post.title, url: `${SITE_URL}/blog/${post.slug}`, datePublished: post.publishedAt })),
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}><div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20"><span className="eyebrow">Guides · How-tos · Comparisons</span><h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Turn complex content into real knowledge</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">No chasing trends for the sake of volume — just real questions about understanding content, organising structure and using AI mind maps.</p></div></section>
        <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-2 lg:px-8 lg:py-20">
          {BLOG_POSTS.map((post, index) => <article key={post.slug} className={`rounded-2xl border bg-surface p-6 shadow-sm ${index === 0 ? 'md:col-span-2 md:grid md:grid-cols-[1fr_0.55fr] md:gap-10 md:p-8' : ''}`} style={{ borderColor: 'var(--border)' }}><div><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">{post.category}</div><h2 className="mt-3 text-2xl font-bold tracking-tight"><Link href={`/blog/${post.slug}`} className="hover:text-brand-600">{post.title}</Link></h2><p className="mt-3 text-sm leading-7 text-text-muted">{post.description}</p></div><div className={`${index === 0 ? 'mt-6 flex flex-col justify-end md:mt-0' : ''}`}><div className="mt-5 text-xs text-text-subtle">{post.publishedAt} · {post.readingMinutes} min read</div><Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-600">Read more →</Link></div></article>)}
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
