import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import BlogFilters from './BlogFilters';
import { sql, getCategories } from '@/lib/db';
import Icon from '@/components/Icon';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog  Rithala Update | Posts by category, author, date',
  description:
    'All blog posts about Rithala village, Rajput heritage, events, temples, and culture. Filter by category, author, and date.',
  alternates: { canonical: '/blog/' },
};

type SP = {
  category?: string;
  author?: string;
  year?: string;
  q?: string;
};

export default async function BlogPage({ searchParams }: { searchParams: SP }) {
  const cat = searchParams.category || '';
  const aut = searchParams.author || '';
  const yr = searchParams.year || '';
  const q = (searchParams.q || '').trim();

  let posts: any[] = [];
  try {
    const r = await sql<any>`
      SELECT DISTINCT p.id, p.slug, p.title, p.excerpt, p.featured_image, p.published_at, p.author_name,
        (SELECT c.name FROM post_categories pc2
         JOIN categories c ON c.id = pc2.category_id
         WHERE pc2.post_id = p.id LIMIT 1) AS primary_category,
        (SELECT c.slug FROM post_categories pc2
         JOIN categories c ON c.id = pc2.category_id
         WHERE pc2.post_id = p.id LIMIT 1) AS primary_category_slug
      FROM posts p
      LEFT JOIN post_categories pc ON pc.post_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      WHERE p.status = 'published'
        AND p.published_at <= NOW()
        AND (${cat || null}::text IS NULL OR c.slug = ${cat || null})
        AND (${aut || null}::text IS NULL OR p.author_name = ${aut || null})
        AND (${yr || null}::text IS NULL OR EXTRACT(YEAR FROM p.published_at)::text = ${yr || null})
        AND (${q || null}::text IS NULL OR p.title ILIKE ${'%' + q + '%'} OR p.excerpt ILIKE ${'%' + q + '%'})
      ORDER BY p.published_at DESC NULLS LAST
      LIMIT 60
    `;
    posts = r.rows;
  } catch {}

  const categories = await getCategories().catch(() => []);

  let authors: string[] = [];
  try {
    const r = await sql<{ name: string }>`
      SELECT DISTINCT author_name AS name FROM posts WHERE author_name IS NOT NULL AND author_name != '' ORDER BY name
    `;
    authors = r.rows.map((row) => row.name);
  } catch {}

  let years: number[] = [];
  try {
    const r = await sql<{ year: string }>`
      SELECT DISTINCT EXTRACT(YEAR FROM published_at)::text AS year
      FROM posts WHERE status = 'published' AND published_at IS NOT NULL
      ORDER BY year DESC
    `;
    years = r.rows.map((row) => Number(row.year));
  } catch {}

  // Only show featured-latest when there are NO active filters
  const hasFilters = cat || aut || yr || q;
  const featured = !hasFilters && posts.length > 0 ? posts[0] : null;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <PublicShell>
      <section className="blog2-hero">
        <div className="container">
          <span className="blog2-hero-eyebrow">Insights & Stories</span>
          <h1 className="blog2-hero-h1">Rithala Insights and Blogs</h1>
          <p className="blog2-hero-lead">
            रिठाला गाँव, राजपूताना heritage, events, temples और culture से जुड़ी सारी कहानियाँ।
            Read insights from experts and stories from our village.
          </p>
        </div>
        <div className="blog2-hero-curve" aria-hidden="true"></div>
      </section>

      {/* Featured latest post */}
      {featured && (
        <section className="blog2-featured-section">
          <div className="container">
            <Link href={`/blog/${(featured.slug||'').replace(/^\d{4}\/\d{2}\/\d{2}\//, '')}/`} className="blog2-featured">
              <div className="blog2-featured-img">
                {featured.featured_image ? (
                  <img src={featured.featured_image} alt={featured.title} loading="eager" fetchPriority="high" />
                ) : (
                  <div className="blog2-featured-placeholder">Rithala</div>
                )}
              </div>
              <div className="blog2-featured-body">
                {featured.primary_category && (
                  <span className="blog2-featured-tag">{featured.primary_category}</span>
                )}
                <h2 className="blog2-featured-title">{featured.title}</h2>
                {featured.excerpt && (
                  <p className="blog2-featured-excerpt">{featured.excerpt}</p>
                )}
                <div className="blog2-featured-meta">
                  <span className="blog2-meta-item">
                    <Icon name="calendar" size={14} />
                    {featured.published_at ? new Date(featured.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </span>
                  {featured.author_name && (
                    <span className="blog2-meta-item">
                      <Icon name="feather" size={14} />
                      {featured.author_name}
                    </span>
                  )}
                </div>
                <span className="blog2-featured-cta">
                  Read Full Article
                  <Icon name="arrow-right" size={14} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="blog2-filter-section">
        <div className="container">
          <div className="blog2-filter-row">
            <BlogFilters
              categories={categories}
              authors={authors}
              years={years}
              current={{ category: cat, author: aut, year: yr, q }}
            />
            <span className="blog2-count">{posts.length} article{posts.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </section>

      <section className="blog2-grid-section">
        <div className="container">
          {rest.length === 0 && !featured ? (
            <div className="blog-empty">
              <Icon name="inbox" size={48} />
              <h3>कोई post नहीं मिली</h3>
              <p>Filters change करके try करें या <Link href="/blog/">सारे posts</Link> देखें।</p>
            </div>
          ) : rest.length === 0 ? null : (
            <div className="bc-grid">
              {rest.map((p) => (
                <Link key={p.id} href={`/blog/${(p.slug||'').replace(/^\d{4}\/\d{2}\/\d{2}\//, '')}/`} className="bc-card">
                  <div className="bc-img-wrap">
                    {p.featured_image ? (
                      <img src={p.featured_image} alt={p.title} loading="lazy" />
                    ) : (
                      <div className="bc-placeholder"><span>Rithala</span></div>
                    )}
                    <div className="bc-overlay" aria-hidden="true" />
                    {p.primary_category && (
                      <span className="bc-tag">{p.primary_category}</span>
                    )}
                  </div>
                  <div className="bc-body">
                    <h3 className="bc-title">{p.title}</h3>
                    <div className="bc-meta">
                      <span className="bc-date">
                        {p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'}
                      </span>
                      <span className="bc-read">
                        पढ़ें <Icon name="arrow-right" size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
