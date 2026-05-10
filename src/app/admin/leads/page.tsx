import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import LeadsManager from './LeadsManager';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let leads: any[] = [];
  try {
    const r = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`;
    leads = r.rows;
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>📨 Leads ({leads.length})</h1>
      </div>
      <LeadsManager initialLeads={leads} />
    </AdminShell>
  );
}
