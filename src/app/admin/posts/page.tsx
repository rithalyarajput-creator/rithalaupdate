import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import DeletePostButton from './DeletePostButton';

export const dynamic = 'force-dynamic';

export default async function PostsList() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let posts: any[] = [];
  try {
    const r = await sql`
      SELECT id, title, slug, status, published_at, updated_at
      FROM posts ORDER BY COALESCE(published_at, updated_at) DESC
    `;
    posts = r.rows;
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>📝 All Posts ({posts.length})</h1>
        <Link className="btn" href="/admin/posts/new">+ New Post</Link>
      </div>

      <div className="admin-card">
        {posts.length === 0 ? (
          <p>No posts yet. <Link href="/admin/posts/new">Create one</Link>.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Slug</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong>
                  </td>
                  <td><code style={{ fontSize: '0.82rem' }}>{p.slug}</code></td>
                  <td>
                    <span style={{
                      background: p.status === 'published' ? '#d1fae5' : '#fef3c7',
                      color: '#000', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem',
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="actions">
                    <Link className="btn btn-sm" href={`/admin/posts/${p.id}`}>Edit</Link>
                    <Link className="btn btn-sm btn-secondary" href={`/${p.slug}/`} target="_blank">View</Link>
                    <DeletePostButton id={p.id} title={p.title} />
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
