import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let stats = { posts: 0, drafts: 0, pages: 0, categories: 0, leads: 0, newLeads: 0, reels: 0, media: 0 };
  try {
    const [a, b, c, d, e, f, g, h] = await Promise.all([
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'published'`,
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'draft'`,
      sql`SELECT COUNT(*) AS n FROM pages WHERE status = 'published'`,
      sql`SELECT COUNT(*) AS n FROM categories`,
      sql`SELECT COUNT(*) AS n FROM leads`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM leads WHERE status = 'new'`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM reels`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM media`.catch(() => ({ rows: [{ n: 0 }] })),
    ]);
    stats = {
      posts: Number(a.rows[0].n),
      drafts: Number(b.rows[0].n),
      pages: Number(c.rows[0].n),
      categories: Number(d.rows[0].n),
      leads: Number(e.rows[0].n),
      newLeads: Number(f.rows[0].n),
      reels: Number(g.rows[0].n),
      media: Number(h.rows[0].n),
    };
  } catch {}

  let recentPosts: any[] = [];
  try {
    const r = await sql`SELECT id, title, slug, published_at, status FROM posts ORDER BY updated_at DESC LIMIT 5`;
    recentPosts = r.rows;
  } catch {}

  let recentLeads: any[] = [];
  try {
    const r = await sql`SELECT id, name, email, subject, created_at, status FROM leads ORDER BY created_at DESC LIMIT 5`;
    recentLeads = r.rows;
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>📊 Dashboard</h1>
        <Link className="btn btn-sm" href="/admin/posts/new">+ New Post</Link>
      </div>

      <div className="admin-stats">
        <Link href="/admin/posts" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="num">{stats.posts}</div>
          <div className="label">Published Posts</div>
        </Link>
        <Link href="/admin/posts" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="num">{stats.drafts}</div>
          <div className="label">Drafts</div>
        </Link>
        <Link href="/admin/categories" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="num">{stats.categories}</div>
          <div className="label">Categories</div>
        </Link>
        <Link href="/admin/media" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="num">{stats.media}</div>
          <div className="label">Media Files</div>
        </Link>
        <Link href="/admin/reels" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="num">{stats.reels}</div>
          <div className="label">Reels</div>
        </Link>
        <Link href="/admin/leads" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="num">{stats.newLeads}</div>
          <div className="label">New Leads ({stats.leads} total)</div>
        </Link>
      </div>

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr', marginTop: 24 }}>
        <div className="admin-card">
          <h2 style={{ marginTop: 0 }}>📝 Recent Posts</h2>
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
                    <td>
                      <span style={{
                        background: p.status === 'published' ? '#d1fae5' : '#fef3c7',
                        color: '#000', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem',
                      }}>
                        {p.status}
                      </span>
                    </td>
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

        {recentLeads.length > 0 && (
          <div className="admin-card">
            <h2 style={{ marginTop: 0 }}>📨 Recent Leads</h2>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id}>
                    <td><strong>{l.name}</strong></td>
                    <td style={{ fontSize: '0.85rem' }}>{l.email || '—'}</td>
                    <td>{l.subject || '—'}</td>
                    <td>
                      <span style={{
                        background: l.status === 'new' ? '#dbeafe' : '#e5e7eb',
                        padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem',
                      }}>
                        {l.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {new Date(l.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 12 }}>
              <Link href="/admin/leads" className="btn btn-sm btn-secondary">View All Leads →</Link>
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
