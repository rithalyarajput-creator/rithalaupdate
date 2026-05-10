import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { getCategories } from '@/lib/db';
import CategoriesManager from './CategoriesManager';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const categories = await getCategories().catch(() => []);

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>🏷️ Categories</h1>
      </div>
      <CategoriesManager initialCategories={categories} />
    </AdminShell>
  );
}
