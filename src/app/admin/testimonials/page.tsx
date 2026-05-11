import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import TestimonialsManager from './TestimonialsManager';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let items: any[] = [];
  try {
    const r = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`;
    items = r.rows;
  } catch {}

  const pending = items.filter((t) => t.status === 'pending').length;
  const approved = items.filter((t) => t.status === 'approved').length;

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="star" size={22} /> Testimonials</h1>
          <p className="adm-h1-sub">Review and approve user-submitted testimonials</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Icon name="clock" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{pending}</div>
            <div className="adm-stat-label">Pending review</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="check" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{approved}</div>
            <div className="adm-stat-label">Approved (live)</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="star" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{items.length}</div>
            <div className="adm-stat-label">Total</div>
          </div>
        </div>
      </div>

      <TestimonialsManager initialItems={items} />
    </AdminShell>
  );
}
