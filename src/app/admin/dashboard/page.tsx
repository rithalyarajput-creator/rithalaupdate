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
    contactLeads: 0, blogLeads: 0, newsletterLeads: 0,
    thisMonthPosts: 0, lastMonthPosts: 0,
  };

  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

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
      sql`SELECT COUNT(*) AS n FROM leads WHERE source = 'contact_form'`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM leads WHERE source = 'blog_form'`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM leads WHERE source = 'newsletter'`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'published' AND published_at >= ${thisMonthStart}`.catch(() => ({ rows: [{ n: 0 }] })),
      sql`SELECT COUNT(*) AS n FROM posts WHERE status = 'published' AND published_at >= ${lastMonthStart} AND published_at < ${thisMonthStart}`.catch(() => ({ rows: [{ n: 0 }] })),
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
      contactLeads: Number(queries[9].rows[0].n),
      blogLeads: Number(queries[10].rows[0].n),
      newsletterLeads: Number(queries[11].rows[0].n),
      thisMonthPosts: Number(queries[12].rows[0].n),
      lastMonthPosts: Number(queries[13].rows[0].n),
    };
  } catch {}

  let recentPosts: any[] = [];
  try {
    const r = await sql`SELECT id, title, slug, published_at, status, featured_image, author_name, updated_at FROM posts ORDER BY COALESCE(published_at, updated_at) DESC LIMIT 8`;
    recentPosts = r.rows;
  } catch {}

  let recentLeads: any[] = [];
  try {
    const r = await sql`SELECT id, name, email, subject, source, created_at, status FROM leads ORDER BY created_at DESC LIMIT 5`;
    recentLeads = r.rows;
  } catch {}

  const userName = session.email.split('@')[0];
  const now = new Date();
  const monthName = now.toLocaleString('en-IN', { month: 'long' });
  const postTrend = stats.lastMonthPosts > 0
    ? Math.round(((stats.thisMonthPosts - stats.lastMonthPosts) / stats.lastMonthPosts) * 100)
    : stats.thisMonthPosts > 0 ? 100 : 0;

  const SOURCE_LABEL: Record<string, string> = {
    contact_form: 'Contact Form',
    blog_form: 'Blog Form',
    newsletter: 'Newsletter',
  };

  return (
    <AdminShell email={session.email} newLeads={stats.newLeads}>

      {/*  Page Header  */}
      <div className="dash-header">
        <div>
          <p className="dash-date">{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="dash-title">Welcome back, {userName}</h1>
          <p className="dash-sub">Here is a complete overview of your site activity</p>
        </div>
        <Link href="/admin/posts/new" className="adm-btn-primary">
          <Icon name="plus" size={15} /> New Post
        </Link>
      </div>

      {/*  KPI Row  */}
      <div className="dash-kpi-row">
        <Link href="/admin/posts" className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
            <Icon name="blog" size={20} />
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-num">{stats.posts}</div>
            <div className="dash-kpi-label">Published Posts</div>
            <div className="dash-kpi-sub">{stats.drafts} draft{stats.drafts !== 1 ? 's' : ''} pending</div>
          </div>
        </Link>

        <Link href="/admin/leads" className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            <Icon name="inbox" size={20} />
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-num">{stats.newLeads}</div>
            <div className="dash-kpi-label">New Leads</div>
            <div className="dash-kpi-sub">{stats.leads} total received</div>
          </div>
        </Link>

        <Link href="/admin/media" className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}>
            <Icon name="image" size={20} />
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-num">{stats.media}</div>
            <div className="dash-kpi-label">Media Files</div>
            <div className="dash-kpi-sub">{stats.reels} reels uploaded</div>
          </div>
        </Link>

        <div className="dash-kpi dash-kpi-nolink">
          <div className="dash-kpi-icon" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
            <Icon name="tag" size={20} />
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-num">{stats.thisMonthPosts}</div>
            <div className="dash-kpi-label">Posts in {monthName}</div>
            <div className={`dash-kpi-sub ${postTrend >= 0 ? 'dash-trend-up' : 'dash-trend-down'}`}>
              {postTrend > 0 ? '+' : ''}{postTrend}% vs last month
            </div>
          </div>
        </div>
      </div>

      {/*  Main Grid  */}
      <div className="dash-main-grid">

        {/* Blog Posts Table */}
        <div className="dash-panel dash-panel-wide">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Blog Posts</h2>
              <p className="dash-panel-sub">All posts sorted by latest activity</p>
            </div>
            <Link href="/admin/posts" className="dash-panel-link">View all</Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="dash-empty">
              <Icon name="blog" size={36} />
              <p>No posts yet. <Link href="/admin/posts/new">Create your first post</Link></p>
            </div>
          ) : (
            <div className="dash-posts-table-wrap">
              <table className="dash-posts-table">
                <thead>
                  <tr>
                    <th>Post Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((p) => (
                    <tr key={p.id}>
                      <td className="dash-post-title-cell">
                        {p.featured_image ? (
                          <img src={p.featured_image} alt="" className="dash-post-thumb" />
                        ) : (
                          <div className="dash-post-thumb-empty"><Icon name="image" size={14} /></div>
                        )}
                        <span className="dash-post-name">{p.title}</span>
                      </td>
                      <td className="dash-post-author">{p.author_name || ''}</td>
                      <td>
                        <span className={`dash-status-pill ${p.status === 'published' ? 'dash-status-published' : p.status === 'draft' ? 'dash-status-draft' : 'dash-status-scheduled'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="dash-post-date">
                        {p.published_at
                          ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                      </td>
                      <td>
                        <div className="dash-post-actions">
                          <Link href={`/admin/posts/${p.id}`} className="dash-act-btn" title="Edit">
                            <Icon name="edit" size={14} />
                          </Link>
                          {p.status === 'published' && (
                            <a href={`/blog/${p.slug}/`} target="_blank" rel="noopener" className="dash-act-btn" title="View live">
                              <Icon name="external" size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="dash-right-col">

          {/* Leads Breakdown */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <div>
                <h2 className="dash-panel-title">Leads Breakdown</h2>
                <p className="dash-panel-sub">{stats.leads} total  {stats.newLeads} new</p>
              </div>
              <Link href="/admin/leads" className="dash-panel-link">View all</Link>
            </div>

            <div className="dash-leads-breakdown">
              <Link href="/admin/leads?source=contact_form" className="dash-lead-row">
                <div className="dash-lead-dot" style={{ background: '#3b82f6' }}></div>
                <span className="dash-lead-src">Contact Form</span>
                <span className="dash-lead-count">{stats.contactLeads}</span>
              </Link>
              <Link href="/admin/leads?source=blog_form" className="dash-lead-row">
                <div className="dash-lead-dot" style={{ background: '#8b5cf6' }}></div>
                <span className="dash-lead-src">Blog Form</span>
                <span className="dash-lead-count">{stats.blogLeads}</span>
              </Link>
              <Link href="/admin/leads?source=newsletter" className="dash-lead-row">
                <div className="dash-lead-dot" style={{ background: '#10b981' }}></div>
                <span className="dash-lead-src">Newsletter</span>
                <span className="dash-lead-count">{stats.newsletterLeads}</span>
              </Link>
            </div>

            {recentLeads.length > 0 && (
              <div className="dash-recent-leads">
                <p className="dash-section-label">Recent</p>
                {recentLeads.map((l) => (
                  <div key={l.id} className="dash-lead-item">
                    <div className="dash-lead-avatar">{(l.name || 'A')[0].toUpperCase()}</div>
                    <div className="dash-lead-info">
                      <span className="dash-lead-name">{l.name}</span>
                      <span className="dash-lead-meta">{SOURCE_LABEL[l.source] || l.source} · {new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <span className={`dash-lead-badge ${l.status === 'new' ? 'dash-badge-new' : 'dash-badge-old'}`}>{l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Status */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2 className="dash-panel-title">Content Status</h2>
            </div>
            <div className="dash-content-status">
              <Link href="/admin/posts" className="dash-cs-row">
                <span className="dash-cs-label">Published Posts</span>
                <span className="dash-cs-val dash-cs-green">{stats.posts}</span>
              </Link>
              <Link href="/admin/posts" className="dash-cs-row">
                <span className="dash-cs-label">Drafts</span>
                <span className="dash-cs-val dash-cs-amber">{stats.drafts}</span>
              </Link>
              <Link href="/admin/schedule" className="dash-cs-row">
                <span className="dash-cs-label">Scheduled</span>
                <span className="dash-cs-val dash-cs-blue">{stats.scheduled}</span>
              </Link>
              <Link href="/admin/categories" className="dash-cs-row">
                <span className="dash-cs-label">Categories</span>
                <span className="dash-cs-val">{stats.categories}</span>
              </Link>
              <Link href="/admin/authors" className="dash-cs-row">
                <span className="dash-cs-label">Authors</span>
                <span className="dash-cs-val">{stats.authors}</span>
              </Link>
              <Link href="/admin/reels" className="dash-cs-row">
                <span className="dash-cs-label">Reels</span>
                <span className="dash-cs-val">{stats.reels}</span>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2 className="dash-panel-title">Quick Actions</h2>
            </div>
            <div className="dash-quick-actions">
              <Link href="/admin/posts/new" className="dash-qa-btn">
                <Icon name="plus" size={16} /> New Post
              </Link>
              <Link href="/admin/media" className="dash-qa-btn">
                <Icon name="image" size={16} /> Upload Media
              </Link>
              <Link href="/admin/leads" className="dash-qa-btn">
                <Icon name="inbox" size={16} /> View Leads
              </Link>
              <Link href="/admin/settings" className="dash-qa-btn">
                <Icon name="settings" size={16} /> Settings
              </Link>
            </div>
          </div>

        </div>
      </div>

    </AdminShell>
  );
}
