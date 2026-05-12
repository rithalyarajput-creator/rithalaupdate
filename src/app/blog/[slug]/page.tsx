import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicShell from '@/components/PublicShell';
import BlogSidebarForm from './BlogSidebarForm';
import Icon from '@/components/Icon';
import { sql, getPostBySlug, getPublishedPosts, getCategoriesForPost, getAllSettings } from '@/lib/db';

export const revalidate = 30;
export const dynamicParams = true;

function prepareContent(raw: string): string {
  if (!raw) return '';
  // Unescape HTML entities first (&lt; -> <, etc.)
  let s = raw
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // If still no real HTML tags, treat as plain text
  if (!/<[a-zA-Z]/.test(s)) {
    return s
      .split(/\n\n+/)
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }
  return s;
}

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
  // Try the slug exactly first, then trimmed/decoded
  const slug = decodeURIComponent(params.slug || '').trim();
  let post: any = await getPostBySlug(slug).catch(() => null);
  if (!post) {
    // Fallback: case-insensitive match
    try {
      const r = await sql<any>`SELECT * FROM posts WHERE LOWER(slug) = LOWER(${slug}) LIMIT 1`;
      post = r.rows[0] || null;
    } catch {}
  }
  if (!post) notFound();

  const cats = await getCategoriesForPost(post.id).catch(() => []);
  const catIds = cats.map((c) => c.id);
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));

  // Try to find author avatar
  let authorAvatar: string | null = null;
  let authorSlug: string | null = null;
  if (post.author_name) {
    try {
      const r = await sql<{ avatar_url: string; slug: string }>`
        SELECT avatar_url, slug FROM authors WHERE name = ${post.author_name} LIMIT 1
      `;
      authorAvatar = r.rows[0]?.avatar_url || null;
      authorSlug = r.rows[0]?.slug || null;
    } catch {}
  }

  let related: any[] = [];
  try {
    if (catIds.length > 0) {
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

  const shareUrl = `${SITE}/blog/${post.slug}/`;
  const shareTitle = encodeURIComponent(post.title);
  const shareLink = encodeURIComponent(shareUrl);

  const primaryCat = cats[0];

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <article className="bd2-article">
        <div className="container bd2-grid">
          {/* MAIN CONTENT */}
          <main className="bd2-main">
            {/* HEADER */}
            <header className="bd2-header">
              {/* Category pill top */}
              {primaryCat && (
                <div className="bd2-top-row">
                  <Link href={`/blog/?category=${primaryCat.slug}`} className="bd2-cat-pill">
                    {primaryCat.name}
                  </Link>
                </div>
              )}

              <h1 className="bd2-title">{post.title}</h1>

              {/* Author + Social icons one row */}
              <div className="bd2-meta-row">
                <div className="bd2-author">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt="" className="bd2-author-avatar" />
                  ) : (
                    <div className="bd2-author-avatar bd2-author-avatar-fallback">
                      {(post.author_name || 'S')[0]}
                    </div>
                  )}
                  <div className="bd2-author-info">
                    <small>Written by</small>
                    {authorSlug ? (
                      <Link href={`/blog/?author=${encodeURIComponent(post.author_name)}`}>
                        <strong>{post.author_name || 'Sandeep Rajput'}</strong>
                      </Link>
                    ) : (
                      <strong>{post.author_name || 'Sandeep Rajput'}</strong>
                    )}
                  </div>
                </div>

                <div className="bd2-share">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                    target="_blank" rel="noopener" aria-label="Share on Facebook"
                    className="bd2-share-btn bd2-share-fb">
                    <Icon name="facebook" size={14} />
                  </a>
                  {settings.social_instagram && (
                    <a href={settings.social_instagram}
                      target="_blank" rel="noopener" aria-label="Instagram"
                      className="bd2-share-btn bd2-share-ig">
                      <Icon name="instagram" size={14} />
                    </a>
                  )}
                  {settings.social_pinterest && (
                    <a href={settings.social_pinterest}
                      target="_blank" rel="noopener" aria-label="Pinterest"
                      className="bd2-share-btn bd2-share-pn">
                      <Icon name="pinterest" size={14} />
                    </a>
                  )}
                  <a href={`mailto:${settings.contact_email || settings.social_email || 'rithalyarajput@gmail.com'}`}
                    aria-label="Email"
                    className="bd2-share-btn bd2-share-em">
                    <Icon name="mail" size={14} />
                  </a>
                </div>
              </div>
            </header>

            {/* FEATURED IMAGE */}
            {post.featured_image && (
              <figure className="bd2-hero-img">
                <img src={post.featured_image} alt={post.title} loading="eager" />
              </figure>
            )}

            {/* CONTENT */}
            <div className="bd2-content" dangerouslySetInnerHTML={{ __html: prepareContent(post.content || '') }} />

            {/* TAGS / CATEGORIES STRIP */}
            {cats.length > 0 && (
              <div className="bd2-tags">
                <span>Filed under:</span>
                {cats.map((c) => (
                  <Link key={c.id} href={`/blog/?category=${c.slug}`} className="bd2-tag">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            {/* AUTHOR CARD */}
            <div className="bd2-author-card">
              {authorAvatar ? (
                <img src={authorAvatar} alt="" />
              ) : (
                <div className="bd2-author-card-fallback">{(post.author_name || 'S')[0]}</div>
              )}
              <div>
                <small>Written by</small>
                <strong>{post.author_name || 'Sandeep Rajput'}</strong>
                <p>Editor at Rithala Update — sharing the heritage, culture, and untold stories of Rithala village.</p>
              </div>
            </div>
          </main>

          {/* RIGHT STICKY FORM */}
          <aside className="bd2-aside">
            <div className="bd2-aside-sticky">
              <BlogSidebarForm postTitle={post.title} />
            </div>
          </aside>
        </div>
      </article>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bd-related-section">
          <div className="container">
            <div className="bd-related-head">
              <h2>You Must Also Read</h2>
            </div>
            <div className="blog-grid-3d">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}/`} className="blog-card-3d">
                  <div className="blog-card-img">
                    {p.featured_image ? (
                      <img src={p.featured_image} alt={p.title} loading="lazy" />
                    ) : (
                      <div className="blog-card-img-placeholder">Rithala</div>
                    )}
                    <div className="blog-card-glow" aria-hidden="true"></div>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <Icon name="calendar" size={12} />
                      <span>{p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
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
