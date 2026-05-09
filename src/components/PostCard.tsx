import Link from 'next/link';
import type { Post } from '@/lib/db';

function stripHtml(s: string | null | undefined) {
  if (!s) return '';
  return s.replace(/<[^>]+>/g, '').trim();
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function PostCard({ post }: { post: Post }) {
  const href = `/${post.slug}/`;
  return (
    <article className="card">
      {post.featured_image && (
        <Link href={href} className="thumb">
          <img src={post.featured_image} alt={post.title} loading="lazy" />
        </Link>
      )}
      <div className="card-body">
        <h3><Link href={href}>{post.title}</Link></h3>
        <p className="meta">{formatDate(post.published_at || post.created_at)}</p>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          {stripHtml(post.excerpt || post.content || '').slice(0, 160)}
        </p>
      </div>
    </article>
  );
}
