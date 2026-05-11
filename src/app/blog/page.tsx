import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import BlogFilters from './BlogFilters';
import { sql, getCategories } from '@/lib/db';
import Icon from '@/components/Icon';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog — Rithala Update | Posts by category, author, date',
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
      SELECT DISTINCT p.id, p.slug, p.title, p.excerpt, p.featured_image, p.published_at, p.author_name
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

  // Authors (distinct names from posts)
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

  return (
    <PublicShell>
      <section className="blog-hero">
        <div className="container">
          <span className="blog-hero-eyebrow">Blog</span>
          <h1 className="blog-hero-h1">All Blog Posts</h1>
          <p className="blog-hero-lead">
            रिठाला गाँव, राजपूताना heritage, events, temples और culture से जुड़ी सारी कहानियाँ।
          </p>
        </div>
      </section>

      <section className="blog-filter-section">
        <div className="container">
          <BlogFilters
            categories={categories}
            authors={authors}
            years={years}
            current={{ category: cat, author: aut, year: yr, q }}
          />
        </div>
      </section>

      <section className="blog-grid-section">
        <div className="container">
          {posts.length === 0 ? (
            <div className="blog-empty">
              <Icon name="inbox" size={48} />
              <h3>कोई post नहीं मिली</h3>
              <p>Filters change करके try करें या <Link href="/blog/">सारे posts</Link> देखें।</p>
            </div>
          ) : (
            <div className="blog-grid-3d">
              {posts.map((p) => (
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
                      <span className="bc-meta-item">
                        <Icon name="calendar" size={12} />
                        {p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'}
                      </span>
                      {p.author_name && (
                        <span className="bc-meta-item">
                          <Icon name="feather" size={12} />
                          {p.author_name}
                        </span>
                      )}
                    </div>
                    <h3 className="blog-card-title">{p.title}</h3>
                    <span className="blog-card-arrow">Read more →</span>
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
