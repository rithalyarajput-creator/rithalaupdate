import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { getSession } from '@/lib/auth';
import { getCategories, getAuthors } from '@/lib/db';
import PostEditor from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

export default async function NewPost() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const [categories, authors] = await Promise.all([
    getCategories().catch(() => []),
    getAuthors().catch(() => []),
  ]);
  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="plus" size={22} /> New Blog</h1>
          <p className="adm-h1-sub">Write a new blog post with full SEO and scheduling</p>
        </div>
      </div>
      <PostEditor categories={categories} authors={authors} />
    </AdminShell>
  );
}
