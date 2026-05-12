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

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const newestUser = users.length > 0 ? users[users.length - 1] : null;

  // 24-hour activity proxy: just compute from created_at
  const day = 24 * 60 * 60 * 1000;
  const last24h = users.filter((u) => Date.now() - new Date(u.created_at).getTime() < day).length;

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="users" size={22} /> Users</h1>
          <p className="adm-h1-sub">Manage admin users  add new admins or change passwords</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Icon name="users" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{users.length}</div>
            <div className="adm-stat-label">Total Users</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Icon name="shield" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{adminCount}</div>
            <div className="adm-stat-label">Admins</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="plus" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{last24h}</div>
            <div className="adm-stat-label">Added in last 24h</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Icon name="user" size={20} />
          </div>
          <div>
            <div className="adm-stat-num" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>
              {newestUser?.display_name || newestUser?.email?.split('@')[0] || ''}
            </div>
            <div className="adm-stat-label">Newest user</div>
          </div>
        </div>
      </div>

      <UsersManager initialUsers={users} currentUserEmail={session.email} />
    </AdminShell>
  );
}
