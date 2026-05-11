import { notFound, redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import { getSession } from '@/lib/auth';
import { sql, getCategories, getCategoriesForPost, getAuthors } from '@/lib/db';
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

  const [categories, postCats, authors] = await Promise.all([
    getCategories(),
    getCategoriesForPost(id),
    getAuthors().catch(() => []),
  ]);
  const selectedCategoryIds = postCats.map((c) => c.id);

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">Edit Blog</h1>
          <p className="adm-h1-sub">Update content, SEO, and publishing options</p>
        </div>
      </div>
      <PostEditor
        post={post}
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        authors={authors}
      />
    </AdminShell>
  );
}
