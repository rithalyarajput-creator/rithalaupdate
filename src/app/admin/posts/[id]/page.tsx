import { notFound, redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { sql, getCategories, getCategoriesForPost } from '@/lib/db';
import PostEditor from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPost({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const r = await sql`SELECT * FROM posts WHERE id = ${id} LIMIT 1`;
  if (r.rows.length === 0) notFound();
  const post = r.rows[0];

  const [categories, postCats] = await Promise.all([
    getCategories(),
    getCategoriesForPost(id),
  ]);
  const selectedCategoryIds = postCats.map((c) => c.id);

  return (
    <AdminShell email={session.email}>
      <div className="admin-header">
        <h1>✏️ Edit Post</h1>
      </div>
      <PostEditor
        post={post}
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
      />
    </AdminShell>
  );
}
