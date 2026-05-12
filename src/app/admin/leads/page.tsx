import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import Icon from '@/components/Icon';
import LeadsManager from './LeadsManager';

export const dynamic = 'force-dynamic';

const SOURCE_LABEL: Record<string, string> = {
  contact_form: 'Contact Form',
  blog_form: 'Blog Form',
  newsletter: 'Newsletter',
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: { source?: string };
}) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const source = searchParams?.source || 'all';

  let leads: any[] = [];
  try {
    const r = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`;
    leads = r.rows;
  } catch {}

  const filtered = source === 'all' ? leads : leads.filter((l: any) => l.source === source);
  const title = source !== 'all' && SOURCE_LABEL[source] ? SOURCE_LABEL[source] : 'All Leads';

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">
            <Icon name="inbox" size={22} />
            {title}
          </h1>
          <p className="adm-h1-sub">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>
      <LeadsManager initialLeads={leads} />
    </AdminShell>
  );
}
