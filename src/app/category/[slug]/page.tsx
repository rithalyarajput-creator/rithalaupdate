import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import PostCard from '@/components/PostCard';
import { getCategoryBySlug, getPostsByCategory } from '@/lib/db';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.slug).catch(() => null);
  if (!cat) return { title: 'Category not found' };
  return {
    title: cat.name,
    description: cat.description || `Posts in category ${cat.name}.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const cat = await getCategoryBySlug(params.slug).catch(() => null);
  if (!cat) notFound();
  const posts = await getPostsByCategory(params.slug).catch(() => []);

  return (
    <PublicShell>
      <section className="container section">
        <h1>{cat!.name}</h1>
        {cat!.description && (
          <p style={{ color: '#5b6573' }}>{cat!.description}</p>
        )}
        {posts.length === 0 ? (
          <p>No posts yet in this category.</p>
        ) : (
          <div className="card-grid">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
