import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import PostsTable from './PostsTable';

export const dynamic = 'force-dynamic';

export default async function PostsList() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let posts: any[] = [];
  let stats = { total: 0, published: 0, draft: 0, scheduled: 0 };
  let categories: any[] = [];
  let authors: string[] = [];

  try {
    const r = await sql`
      SELECT p.id, p.title, p.slug, p.status, p.featured_image, p.published_at,
             p.updated_at, p.scheduled_at, p.author_name,
             (SELECT string_agg(c.name, ', ')
                FROM post_categories pc
                JOIN categories c ON c.id = pc.category_id
                WHERE pc.post_id = p.id) AS category_names
      FROM posts p
      ORDER BY COALESCE(p.scheduled_at, p.published_at, p.updated_at) DESC
    `;
    posts = r.rows;
  } catch {}

  try {
    const [t, p, d, s] = await Promise.all([
      sql`SELECT COUNT(*) AS n FROM posts`,
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'published' AND (published_at IS NULL OR published_at <= NOW())`,
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'draft'`,
      sql`SELECT COUNT(*) AS n FROM posts WHERE scheduled_at IS NOT NULL AND scheduled_at > NOW()`,
    ]);
    stats = {
      total: Number(t.rows[0].n),
      published: Number(p.rows[0].n),
      draft: Number(d.rows[0].n),
      scheduled: Number(s.rows[0].n),
    };
  } catch {}

  try {
    const r = await sql`SELECT id, slug, name FROM categories ORDER BY name`;
    categories = r.rows;
  } catch {}

  try {
    const r = await sql<{ name: string }>`
      SELECT DISTINCT author_name AS name FROM posts WHERE author_name IS NOT NULL AND author_name != '' ORDER BY name
    `;
    authors = r.rows.map((row) => row.name);
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="blog" size={22} /> Blog Posts</h1>
          <p className="adm-h1-sub">Manage all your blog posts and articles</p>
        </div>
        <Link className="adm-btn-primary" href="/admin/posts/new">
          <Icon name="plus" size={16} /> New Blog
        </Link>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="blog" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.total}</div>
            <div className="adm-stat-label">Total Posts</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="eye" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.published}</div>
            <div className="adm-stat-label">Published</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Icon name="edit" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.draft}</div>
            <div className="adm-stat-label">Drafts</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <Icon name="clock" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.scheduled}</div>
            <div className="adm-stat-label">Scheduled</div>
          </div>
        </div>
      </div>

      <PostsTable initialPosts={posts} categories={categories} authors={authors} />
    </AdminShell>
  );
}
