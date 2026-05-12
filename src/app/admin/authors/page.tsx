import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { getSession } from '@/lib/auth';
import { sql, getAuthors } from '@/lib/db';
import AuthorsManager from './AuthorsManager';

export const dynamic = 'force-dynamic';

export default async function AuthorsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const authors = await getAuthors().catch(() => []);

  // Count posts per author by matching author_name to name
  let counts: Record<string, number> = {};
  try {
    const r = await sql<{ name: string; n: number }>`
      SELECT author_name AS name, COUNT(*)::int AS n
      FROM posts
      WHERE author_name IS NOT NULL AND status = 'published'
      GROUP BY author_name
    `;
    counts = Object.fromEntries(r.rows.map((row) => [row.name, row.n]));
  } catch {}

  const withCounts = authors.map((a) => ({ ...a, post_count: counts[a.name] || 0 }));
  const totalPosts = withCounts.reduce((s, a) => s + (a.post_count || 0), 0);
  const activeAuthors = withCounts.filter((a) => (a.post_count || 0) > 0).length;
  const topAuthor = withCounts.reduce<typeof withCounts[number] | null>(
    (top, a) => (!top || (a.post_count || 0) > (top.post_count || 0) ? a : top),
    null,
  );

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="feather" size={22} /> Authors</h1>
          <p className="adm-h1-sub">Manage blog post authors and their bio</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="users" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{authors.length}</div>
            <div className="adm-stat-label">Total Authors</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="check" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{activeAuthors}</div>
            <div className="adm-stat-label">Active (with posts)</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Icon name="blog" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{totalPosts}</div>
            <div className="adm-stat-label">Total Posts</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <Icon name="star" size={20} />
          </div>
          <div>
            <div className="adm-stat-num" style={{ fontSize: '1.05rem', lineHeight: 1.2 }}>
              {topAuthor?.name || ''}
            </div>
            <div className="adm-stat-label">Top Author ({topAuthor?.post_count || 0} posts)</div>
          </div>
        </div>
      </div>

      <AuthorsManager initialAuthors={withCounts} />
    </AdminShell>
  );
}
