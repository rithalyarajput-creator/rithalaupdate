import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import UsersManager from './UsersManager';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let users: any[] = [];
  try {
    const r = await sql`SELECT id, email, display_name, role, created_at FROM users ORDER BY created_at`;
    users = r.rows;
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="users" size={22} /> Users</h1>
          <p className="adm-h1-sub">Manage admin users — add new admins or change passwords</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="users" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{users.length}</div>
            <div className="adm-stat-label">Total Admin Users</div>
          </div>
        </div>
      </div>

      <UsersManager initialUsers={users} currentUserEmail={session.email} />
    </AdminShell>
  );
}
