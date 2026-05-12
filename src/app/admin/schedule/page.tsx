import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ScheduledPostsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let scheduled: any[] = [];
  try {
    const r = await sql`
      SELECT id, title, slug, scheduled_at, status, author_name
      FROM posts
      WHERE scheduled_at IS NOT NULL AND scheduled_at > NOW()
      ORDER BY scheduled_at ASC
    `;
    scheduled = r.rows;
  } catch {}

  let pendingPublish: any[] = [];
  try {
    const r = await sql`
      SELECT id, title, slug, scheduled_at, status, author_name
      FROM posts
      WHERE scheduled_at IS NOT NULL AND scheduled_at <= NOW() AND status = 'draft'
      ORDER BY scheduled_at DESC
    `;
    pendingPublish = r.rows;
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1> Scheduled Blogs ({scheduled.length})</h1>
        <Link className="btn btn-sm" href="/admin/posts/new">+ New Blog</Link>
      </div>

      {pendingPublish.length > 0 && (
        <div className="admin-card" style={{ borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
          <h2 style={{ marginTop: 0, color: '#b45309' }}> Ready to Publish ({pendingPublish.length})</h2>
          <p style={{ color: '#92400e', fontSize: '0.9rem' }}>
            इन posts का schedule date आ चुका है पर status अभी 'draft' है। Edit करके status को 'published' करें।
          </p>
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Was scheduled for</th><th>Action</th></tr>
            </thead>
            <tbody>
              {pendingPublish.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(p.scheduled_at).toLocaleString('en-IN')}</td>
                  <td><Link className="btn btn-sm" href={`/admin/posts/${p.id}`}>Edit & Publish</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Upcoming Scheduled Posts</h2>
        {scheduled.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 30 }}>
            कोई scheduled blog नहीं है। Editor में "Schedule for later" option से date set करें।
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Author</th><th>Scheduled For</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {scheduled.map((p) => {
                const date = new Date(p.scheduled_at);
                const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={p.id}>
                    <td><strong>{p.title}</strong></td>
                    <td style={{ fontSize: '0.85rem' }}>{p.author_name || ''}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>in {days} day{days !== 1 ? 's' : ''}</div>
                    </td>
                    <td>
                      <span style={{ background: p.status === 'published' ? '#d1fae5' : '#fef3c7', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem' }}>{p.status}</span>
                    </td>
                    <td><Link className="btn btn-sm" href={`/admin/posts/${p.id}`}>Edit</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card" style={{ background: '#f9fafb' }}>
        <h3 style={{ marginTop: 0 }}> How scheduling works</h3>
        <ol style={{ margin: 0, paddingLeft: 20, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.8 }}>
          <li>New Blog form में <strong>Schedule date</strong> set करें (future date)</li>
          <li>Status को <strong>draft</strong> रखें</li>
          <li>Date आने पर इस page पर "Ready to Publish" section में दिखेगा</li>
          <li>Click करके edit करें, status को <strong>published</strong> करें  live हो जाएगा</li>
        </ol>
      </div>
    </AdminShell>
  );
}
