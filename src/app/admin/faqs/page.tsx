import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import FaqsManager from './FaqsManager';

export const dynamic = 'force-dynamic';

export default async function FaqsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let faqs: any[] = [];
  try {
    const r = await sql`SELECT * FROM faqs ORDER BY display_order ASC, created_at DESC`;
    faqs = r.rows;
  } catch {}

  const homeCount = faqs.filter((f) => f.show_on_home).length;

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="book" size={22} /> FAQs</h1>
          <p className="adm-h1-sub">Frequently asked questions  toggle &quot;Show on Home&quot; to feature on homepage</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="book" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{faqs.length}</div>
            <div className="adm-stat-label">Total FAQs</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="home" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{homeCount}</div>
            <div className="adm-stat-label">On homepage</div>
          </div>
        </div>
      </div>

      <FaqsManager initialFaqs={faqs} />
    </AdminShell>
  );
}
