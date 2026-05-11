import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { getSession } from '@/lib/auth';
import { getCategoryPostCounts } from '@/lib/db';
import CategoriesManager from './CategoriesManager';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const cats: { id: number; slug: string; name: string; n: number }[] = await getCategoryPostCounts().catch(() => []);
  const totalPosts: number = cats.reduce((s, c) => s + c.n, 0);
  const activeCount: number = cats.filter((c) => c.n > 0).length;
  const topCat = cats.reduce<{ id: number; slug: string; name: string; n: number } | null>(
    (top, c) => (!top || c.n > top.n ? c : top),
    null
  );

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="tag" size={22} /> Categories</h1>
          <p className="adm-h1-sub">Organize blog posts by topic</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="tag" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{cats.length}</div>
            <div className="adm-stat-label">Total Categories</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="check" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{activeCount}</div>
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
              {topCat?.name || '—'}
            </div>
            <div className="adm-stat-label">Top Category ({topCat?.n || 0} posts)</div>
          </div>
        </div>
      </div>

      <CategoriesManager initialCategories={cats} />
    </AdminShell>
  );
}
