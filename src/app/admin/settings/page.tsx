import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { getAllSettings } from '@/lib/db';
import SettingsManager from './SettingsManager';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const settings = await getAllSettings().catch(() => ({}));

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>⚙️ Site Settings</h1>
      </div>
      <SettingsManager initialSettings={settings} />
    </AdminShell>
  );
}
