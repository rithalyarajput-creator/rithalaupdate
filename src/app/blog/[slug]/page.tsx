import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicShell from '@/components/PublicShell';
import BlogSidebarForm from './BlogSidebarForm';
import { sql, getPostBySlug, getPublishedPosts, getCategoriesForPost } from '@/lib/db';

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post: any = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return { title: 'Post not found' };
  const title = post.meta_title || post.title;
  const description =
    post.meta_description ||
    (post.excerpt || post.content || '').replace(/<[^>]+>/g, '').slice(0, 160);
  const ogImg = post.og_image || post.featured_image || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}/` },
    robots: post.noindex ? { index: false, follow: false } : { index: true, follow: true },
    keywords: post.focus_keyword || undefined,
    openGraph: {
      title, description,
      images: ogImg ? [ogImg] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: ogImg ? [ogImg] : undefined,
    },
  };
}

export default async function BlogDetail({ params }: Props) {
  const post: any = await getPostBySlug(params.slug).catch(() => null);
  if (!post) notFound();

  const cats = await getCategoriesForPost(post.id).catch(() => []);
  const catIds = cats.map((c) => c.id);

  let related: any[] = [];
  try {
    if (catIds.length > 0) {
      // Use sql.query for array parameter
      const placeholders = catIds.map((_, i) => `$${i + 1}`).join(',');
      const r = await sql.query(
        `SELECT DISTINCT p.id, p.slug, p.title, p.excerpt, p.featured_image, p.published_at, p.author_name
         FROM posts p
         JOIN post_categories pc ON pc.post_id = p.id
         WHERE pc.category_id IN (${placeholders})
           AND p.id != $${catIds.length + 1}
           AND p.status = 'published'
         ORDER BY p.published_at DESC NULLS LAST
         LIMIT 6`,
        [...catIds, post.id]
      );
      related = r.rows;
    }
    if (related.length < 3) {
      const more = await getPublishedPosts(6);
      const seen = new Set(related.map((r) => r.id));
      seen.add(post.id);
      for (const m of more) {
        if (!seen.has(m.id) && related.length < 6) {
          related.push(m);
          seen.add(m.id);
        }
      }
    }
  } catch {}

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.featured_image ? [post.featured_image] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author_name || 'Sandeep Rajput' },
    publisher: {
      '@type': 'Organization',
      name: 'Rithala Update',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    description: post.meta_description || (post.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 200),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}/` },
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <article className="bd-article">
        <div className="container bd-grid">
          <main className="bd-main">
            <div className="bd-breadcrumb">
              <Link href="/">Home</Link> · <Link href="/blog/">Blog</Link>
              {cats[0] && <> · <Link href={`/blog/?category=${cats[0].slug}`}>{cats[0].name}</Link></>}
            </div>

            <h1 className="bd-title">{post.title}</h1>

            <div className="bd-meta">
              <span>📅 {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {post.author_name && <span>· ✍️ <Link href={`/blog/?author=${encodeURIComponent(post.author_name)}`}>{post.author_name}</Link></span>}
              {cats.length > 0 && (
                <span>· 🏷️ {cats.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ', '}
                    <Link href={`/blog/?category=${c.slug}`}>{c.name}</Link>
                  </span>
                ))}</span>
              )}
            </div>

            {post.featured_image && (
              <figure className="bd-hero-img">
                <img src={post.featured_image} alt={post.title} loading="eager" />
              </figure>
            )}

            <div className="bd-content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />

            <div className="bd-share">
              <span>📤 Share:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + SITE + '/blog/' + post.slug + '/')}`} target="_blank" rel="noopener">WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE + '/blog/' + post.slug + '/')}`} target="_blank" rel="noopener">Facebook</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(SITE + '/blog/' + post.slug + '/')}`} target="_blank" rel="noopener">Twitter</a>
            </div>
          </main>

          <aside className="bd-sidebar">
            <div className="bd-sticky">
              <BlogSidebarForm postTitle={post.title} />
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bd-related-section">
          <div className="container">
            <div className="bd-related-head">
              <span className="blog-hero-eyebrow">📚 More to read</span>
              <h2>Related Posts</h2>
            </div>
            <div className="blog-grid-3d">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}/`} className="blog-card-3d">
                  <div className="blog-card-img">
                    {p.featured_image ? (
                      <img src={p.featured_image} alt={p.title} loading="lazy" />
                    ) : (
                      <div className="blog-card-img-placeholder">🚩 Rithala</div>
                    )}
                    <div className="blog-card-glow" aria-hidden="true"></div>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>📅 {p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                    <h3 className="blog-card-title">{p.title}</h3>
                    <span className="blog-card-arrow">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicShell>
  );
}
