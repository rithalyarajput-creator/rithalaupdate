import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let stats = {
    posts: 0, drafts: 0, scheduled: 0, categories: 0,
    leads: 0, newLeads: 0, reels: 0, media: 0, authors: 0,
  };
  try {
    const queries = await Promise.all([
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'published'`,
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'draft'`,
      sql`SELECT COUNT(*) AS n FROM posts WHERE scheduled_at IS NOT NULL AND scheduled_at > NOW()`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM categories`,
      sql`SELECT COUNT(*) AS n FROM leads`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM leads WHERE status = 'new'`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM reels`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM media`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM authors`.catch(() => ({ rows: [{ n: 0 }] })),
    ]);
    stats = {
      posts: Number(queries[0].rows[0].n),
      drafts: Number(queries[1].rows[0].n),
      scheduled: Number(queries[2].rows[0].n),
      categories: Number(queries[3].rows[0].n),
      leads: Number(queries[4].rows[0].n),
      newLeads: Number(queries[5].rows[0].n),
      reels: Number(queries[6].rows[0].n),
      media: Number(queries[7].rows[0].n),
      authors: Number(queries[8].rows[0].n),
    };
  } catch {}

  let recentPosts: any[] = [];
  try {
    const r = await sql`SELECT id, title, slug, published_at, status, featured_image, author_name FROM posts ORDER BY updated_at DESC LIMIT 5`;
    recentPosts = r.rows;
  } catch {}

  let recentLeads: any[] = [];
  try {
    const r = await sql`SELECT id, name, email, subject, source, created_at, status FROM leads ORDER BY created_at DESC LIMIT 5`;
    recentLeads = r.rows;
  } catch {}

  const userName = session.email.split('@')[0];

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">
            <Icon name="dashboard" size={22} />
            Welcome back, {userName}
          </h1>
          <p className="adm-h1-sub">Here is what's happening with your site today</p>
        </div>
      </div>

      <div className="adm-stats">
        <Link href="/admin/posts" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="blog" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.posts}</div>
            <div className="adm-stat-label">Published Posts</div>
          </div>
        </Link>
        <Link href="/admin/posts" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Icon name="edit" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.drafts}</div>
            <div className="adm-stat-label">Drafts</div>
          </div>
        </Link>
        <Link href="/admin/schedule" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <Icon name="clock" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.scheduled}</div>
            <div className="adm-stat-label">Scheduled</div>
          </div>
        </Link>
        <Link href="/admin/leads" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="inbox" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.newLeads}</div>
            <div className="adm-stat-label">New Leads ({stats.leads} total)</div>
          </div>
        </Link>
        <Link href="/admin/media" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            <Icon name="image" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.media}</div>
            <div className="adm-stat-label">Media Files</div>
          </div>
        </Link>
        <Link href="/admin/reels" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #f43f5e, #be123c)' }}>
            <Icon name="video" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.reels}</div>
            <div className="adm-stat-label">Reels</div>
          </div>
        </Link>
        <Link href="/admin/categories" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Icon name="tag" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.categories}</div>
            <div className="adm-stat-label">Categories</div>
          </div>
        </Link>
        <Link href="/admin/authors" className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
            <Icon name="feather" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{stats.authors}</div>
            <div className="adm-stat-label">Authors</div>
          </div>
        </Link>
      </div>

      <div className="adm-dash-grid">
        <div className="adm-card">
          <div className="adm-card-head">
            <h3><Icon name="blog" size={16} /> Recent Posts</h3>
            <Link href="/admin/posts" className="adm-btn-ghost">View all</Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="adm-empty">
              <Icon name="blog" size={40} />
              <h3>No posts yet</h3>
              <p>Create your first blog post to get started.</p>
            </div>
          ) : (
            <ul className="adm-activity">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  {p.featured_image ? (
                    <img src={p.featured_image} alt="" className="adm-activity-thumb" />
                  ) : (
                    <div className="adm-activity-thumb adm-activity-thumb-empty">
                      <Icon name="image" size={16} />
                    </div>
                  )}
                  <div className="adm-activity-body">
                    <Link href={`/admin/posts/${p.id}`} className="adm-activity-title">
                      {p.title}
                    </Link>
                    <div className="adm-activity-meta">
                      <span className={`adm-badge ${p.status === 'published' ? 'adm-badge-green' : 'adm-badge-amber'}`}>
                        {p.status}
                      </span>
                      {p.author_name && <span>{p.author_name}</span>}
                      {p.published_at && <span>{new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                    </div>
                  </div>
                  <Link href={`/admin/posts/${p.id}`} className="adm-act-btn adm-act-edit" title="Edit">
                    <Icon name="edit" size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <h3><Icon name="inbox" size={16} /> Recent Leads</h3>
            <Link href="/admin/leads" className="adm-btn-ghost">View all</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="adm-empty">
              <Icon name="inbox" size={40} />
              <h3>No leads yet</h3>
              <p>Messages from the contact form and newsletter will appear here.</p>
            </div>
          ) : (
            <ul className="adm-activity">
              {recentLeads.map((l) => (
                <li key={l.id}>
                  <div className="adm-activity-avatar">
                    {(l.name || 'A')[0].toUpperCase()}
                  </div>
                  <div className="adm-activity-body">
                    <div className="adm-activity-title">{l.name}</div>
                    <div className="adm-activity-meta">
                      <span className={`adm-badge ${l.status === 'new' ? 'adm-badge-blue' : 'adm-badge-gray'}`}>
                        {l.source === 'newsletter' ? 'newsletter' : l.status}
                      </span>
                      {l.email && <span>{l.email}</span>}
                      <span>{new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
