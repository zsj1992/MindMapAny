import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/site/Footer';
import { BLOG_POSTS, getBlogPost, SITE_URL } from '@/lib/seo/content';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return BLOG_POSTS.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.description, keywords: [post.primaryKeyword], alternates: { canonical: `/blog/${post.slug}` }, openGraph: { type: 'article', title: post.title, description: post.description, publishedTime: post.publishedAt, modifiedTime: post.updatedAt, url: `/blog/${post.slug}` } };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${post.slug}`;
  const relatedPosts = BLOG_POSTS.filter((candidate) => candidate.slug !== post.slug).slice(0, 2);
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: url, image: `${SITE_URL}/og.png`, author: { '@type': 'Organization', name: post.author, url: SITE_URL }, publisher: { '@type': 'Organization', name: 'MindMapAny', url: SITE_URL } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` }, { '@type': 'ListItem', position: 3, name: post.title, item: url }] },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <article className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
          <header className="mt-10 border-b pb-10" style={{ borderColor: 'var(--border)' }}><div className="text-xs font-bold text-brand-600">{post.category}</div><h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">{post.title}</h1><p className="mt-5 text-lg leading-8 text-text-muted">{post.description}</p><div className="mt-6 flex flex-wrap gap-3 text-xs text-text-subtle"><span>{post.author}</span><span>·</span><time dateTime={post.publishedAt}>{post.publishedAt}</time><span>·</span><span>{post.readingMinutes} min read</span></div></header>
          <div className="mt-10 grid gap-10 lg:grid-cols-[180px_1fr]">
            <aside><div className="sticky top-24 rounded-xl border bg-bg-subtle p-4" style={{ borderColor: 'var(--border)' }}><div className="text-xs font-bold">Contents</div><ol className="mt-3 space-y-2">{post.sections.map((section) => <li key={section.id}><Link href={`#${section.id}`} className="text-xs leading-5 text-text-muted hover:text-brand-600">{section.title}</Link></li>)}</ol></div></aside>
            <div className="space-y-12">{post.sections.map((section) => <section key={section.id} id={section.id} className="scroll-mt-24"><h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-[15px] leading-8 text-text-muted">{paragraph}</p>)}{section.bullets && <ul className="mt-5 space-y-3 rounded-xl border bg-bg-subtle p-5" style={{ borderColor: 'var(--border)' }}>{section.bullets.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-text-muted"><span className="text-accent-500">✓</span>{item}</li>)}</ul>}</section>)}</div>
          </div>
          <div className="mt-14 rounded-2xl bg-[#102f53] px-6 py-10 text-center text-white"><h2 className="text-2xl font-bold">Try it on your own content</h2><p className="mt-3 text-sm text-blue-100/80">Generate an editable map from real text, a document or a web page.</p><Link href={post.relatedTool} className="btn mt-6 h-11 bg-white px-6 text-[#102f53]">Open the related tool →</Link></div>
          <aside className="mt-12 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-bold">Keep reading</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((candidate) => (
                <Link key={candidate.slug} href={`/blog/${candidate.slug}`} className="rounded-xl border bg-surface p-5 transition-colors hover:border-brand-300" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-xs font-bold text-brand-600">{candidate.category}</div>
                  <div className="mt-2 font-semibold leading-6">{candidate.title}</div>
                </Link>
              ))}
            </div>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
