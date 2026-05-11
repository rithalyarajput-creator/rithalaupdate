import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { getAuthors } from '@/lib/db';
import AuthorsManager from './AuthorsManager';

export const dynamic = 'force-dynamic';

export default async function AuthorsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const authors = await getAuthors().catch(() => []);

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>✍️ Authors</h1>
      </div>
      <AuthorsManager initialAuthors={authors} />
    </AdminShell>
  );
}
