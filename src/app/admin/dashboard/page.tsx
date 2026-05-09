import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let stats = { posts: 0, pages: 0, categories: 0, drafts: 0 };
  try {
    const [a, b, c, d] = await Promise.all([
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'published'`,
      sql`SELECT COUNT(*) AS n FROM pages WHERE status = 'published'`,
      sql`SELECT COUNT(*) AS n FROM categories`,
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'draft'`,
    ]);
    stats = {
      posts: Number(a.rows[0].n),
      pages: Number(b.rows[0].n),
      categories: Number(c.rows[0].n),
      drafts: Number(d.rows[0].n),
    };
  } catch {}

  let recentPosts: any[] = [];
  try {
    const r = await sql`SELECT id, title, slug, published_at, status FROM posts ORDER BY updated_at DESC LIMIT 5`;
    recentPosts = r.rows;
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>📊 Dashboard</h1>
        <Link className="btn btn-sm" href="/admin/posts/new">+ New Post</Link>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="num">{stats.posts}</div>
          <div className="label">Published Posts</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.drafts}</div>
          <div className="label">Drafts</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.pages}</div>
          <div className="label">Pages</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.categories}</div>
          <div className="label">Categories</div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Recent Activity</h2>
        {recentPosts.length === 0 ? (
          <p style={{ color: '#888' }}>
            No posts yet. <Link href="/admin/posts/new">Create your first post →</Link>
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {recentPosts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td><span style={{ background: p.status === 'published' ? '#d1fae5' : '#fef3c7', color: '#000', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem' }}>{p.status}</span></td>
                  <td>{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</td>
                  <td className="actions">
                    <Link className="btn btn-sm" href={`/admin/posts/${p.id}`}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
