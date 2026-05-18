import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { getAllSettings } from '@/lib/db';
import AboutPageManager from './AboutPageManager';

export const dynamic = 'force-dynamic';

export default async function AboutPageAdmin() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const settings = await getAllSettings().catch(() => ({}));

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 style={{ margin: 0 }}>About Us Page</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Edit content shown on the /about/ page
          </p>
        </div>
        <a href="/about/" target="_blank" className="adm-btn-ghost" style={{ fontSize: '0.85rem' }}>
          View Live Page ↗
        </a>
      </div>
      <AboutPageManager initialSettings={settings} />
    </AdminShell>
  );
}
