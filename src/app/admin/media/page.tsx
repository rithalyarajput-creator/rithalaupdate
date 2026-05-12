import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { getAllMedia } from '@/lib/db';
import MediaManager from './MediaManager';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const media = await getAllMedia(200).catch(() => []);

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1> Media Library</h1>
      </div>
      <MediaManager initialMedia={media} />
    </AdminShell>
  );
}
