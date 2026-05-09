import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { getCategories } from '@/lib/db';
import PostEditor from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

export default async function NewPost() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const categories = await getCategories().catch(() => []);
  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>➕ New Post</h1>
      </div>
      <PostEditor categories={categories} />
    </AdminShell>
  );
}
