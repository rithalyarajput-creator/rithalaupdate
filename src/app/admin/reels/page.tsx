import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import ReelsManager from './ReelsManager';

export const dynamic = 'force-dynamic';

export default async function ReelsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let reels: any[] = [];
  try {
    const r = await sql`SELECT * FROM reels ORDER BY display_order ASC, created_at DESC`;
    reels = r.rows;
  } catch {}

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>🎬 Instagram Reels</h1>
      </div>
      <ReelsManager initialReels={reels} />
    </AdminShell>
  );
}
