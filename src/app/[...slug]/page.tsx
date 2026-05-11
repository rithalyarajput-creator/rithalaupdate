// Catch-all route — renders posts (by slug or legacy WordPress path)
// and pages, while preserving SEO of the old WordPress URLs.

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import PostCard from '@/components/PostCard';
import {
  getPostBySlug,
  getPostByLegacyPath,
  getPageBySlug,
  getPublishedPosts,
  getCategories,
  getCategoriesForPost,
} from '@/lib/db';

export const revalidate = 60;

type Props = { params: { slug: string[] } };

async function resolve(slugArr: string[]) {
  // Skip blog paths — they are handled by the dedicated /blog/[slug] route
  if (slugArr[0] === 'blog') return null;

  const joined = '/' + slugArr.join('/') + '/';
  const lastSeg = slugArr[slugArr.length - 1];

  // 1) try legacy path (e.g. /2025/09/14/747/)
  const byLegacy = await getPostByLegacyPath(joined);
  if (byLegacy) return { kind: 'post' as const, item: byLegacy };

  // 2) try post slug (just the last segment)
  const byPostSlug = await getPostBySlug(lastSeg);
  if (byPostSlug) return { kind: 'post' as const, item: byPostSlug };

  // 3) try page slug
  const page = await getPageBySlug(lastSeg);
  if (page) return { kind: 'page' as const, item: page };

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve(params.slug).catch(() => null);
  if (!found) return { title: 'Not found' };
  const item: any = found.item;
  const fallbackDesc = (item.excerpt || item.content || '').replace(/<[^>]+>/g, '').slice(0, 160);
  const title = item.meta_title || item.title;
  const description = item.meta_description || fallbackDesc;
  const ogImg = item.og_image || item.featured_image || undefined;

  return {
    title,
    description,
    alternates: item.canonical_url ? { canonical: item.canonical_url } : undefined,
    robots: item.noindex ? { index: false, follow: false } : { index: true, follow: true },
    keywords: item.focus_keyword || undefined,
    openGraph: {
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
    },
  };
}

export default async function CatchAll({ params }: Props) {
  const found = await resolve(params.slug).catch(() => null);
  if (!found) notFound();

  const item: any = found.item;
  const isPost = found.kind === 'post';

  const sidebarPosts = await getPublishedPosts(6).catch(() => []);
  const categories = await getCategories().catch(() => []);
  const postCats = isPost
    ? await getCategoriesForPost(item.id).catch(() => [])
    : [];

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';
  const articleLd = isPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: item.title,
        image: item.featured_image ? [item.featured_image] : undefined,
        datePublished: item.published_at || item.created_at,
        dateModified: item.updated_at,
        author: { '@type': 'Person', name: 'Sandeep Rajput' },
        publisher: {
          '@type': 'Organization',
          name: 'Rithala Update',
          logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
        },
        description: item.meta_description || (item.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 200),
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/${item.slug}/` },
        keywords: item.focus_keyword || undefined,
      }
    : null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: item.title, item: `${SITE}/${item.slug}/` },
    ],
  };

  return (
    <PublicShell>
      {articleLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article className="article">
        <div className="article-content">
          <h1>{item.title}</h1>
          {isPost && (
            <p className="article-meta">
              {new Date(item.published_at || item.created_at).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
              {postCats.length > 0 && (
                <> · {postCats.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ', '}
                    <Link href={`/category/${c.slug}/`}>{c.name}</Link>
                  </span>
                ))}</>
              )}
            </p>
          )}
          {item.featured_image && (
            <figure>
              <img src={item.featured_image} alt={item.title} loading="eager" />
            </figure>
          )}
          <div dangerouslySetInnerHTML={{ __html: item.content || '' }} />
        </div>

        <aside className="sidebar">
          <h3>Latest Posts</h3>
          <ul>
            {sidebarPosts.map((p) => (
              <li key={p.id}><Link href={`/${p.slug}/`}>{p.title}</Link></li>
            ))}
          </ul>

          {categories.length > 0 && (
            <>
              <h3 style={{ marginTop: 24 }}>Categories</h3>
              <ul>
                {categories.map((c) => (
                  <li key={c.id}><Link href={`/category/${c.slug}/`}>{c.name}</Link></li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </article>

      {isPost && (
        <section className="section" style={{ background: '#fff8e7' }}>
          <div className="container">
            <h2>More like this</h2>
            <div className="card-grid">
              {sidebarPosts.filter((p) => p.id !== item.id).slice(0, 3).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicShell>
  );
}
