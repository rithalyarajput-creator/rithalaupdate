'use client';

import Link from 'next/link';
import { useState } from 'react';
import Icon from '@/components/Icon';

type Post = {
  id: number;
  title: string;
  slug: string;
  status: string;
  featured_image: string | null;
  published_at: string | null;
  updated_at: string;
  scheduled_at: string | null;
  author_name: string | null;
  category_names: string | null;
};

type Category = { id: number; slug: string; name: string };

export default function PostsTable({
  initialPosts,
  categories,
  authors,
}: {
  initialPosts: Post[];
  categories: Category[];
  authors: string[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = posts.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (authorFilter && p.author_name !== authorFilter) return false;
    if (catFilter) {
      if (!p.category_names) return false;
      const catName = categories.find((c) => c.slug === catFilter)?.name;
      if (!catName || !p.category_names.includes(catName)) return false;
    }
    return true;
  });

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id));
    } else {
      alert('Failed to delete');
    }
    setDeletingId(null);
  }

  function statusBadge(p: Post) {
    if (p.scheduled_at && new Date(p.scheduled_at) > new Date()) {
      return <span className="adm-badge adm-badge-purple">Scheduled</span>;
    }
    if (p.status === 'published') return <span className="adm-badge adm-badge-green">Published</span>;
    if (p.status === 'draft') return <span className="adm-badge adm-badge-amber">Draft</span>;
    return <span className="adm-badge adm-badge-gray">{p.status}</span>;
  }

  return (
    <div className="adm-card">
      <div className="adm-filters">
        <div className="adm-search">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Search blogs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}>
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty">
          <Icon name="blog" size={48} />
          <h3>No blog posts found</h3>
          <p>{posts.length === 0 ? 'Create your first blog post to get started.' : 'Try adjusting your filters.'}</p>
          <Link href="/admin/posts/new" className="adm-btn-primary">
            <Icon name="plus" size={14} /> New Blog
          </Link>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 200, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.featured_image ? (
                      <img src={p.featured_image} alt="" className="adm-thumb" />
                    ) : (
                      <div className="adm-thumb adm-thumb-placeholder">
                        <Icon name="image" size={18} />
                      </div>
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/posts/${p.id}`} className="adm-title-link">
                      {p.title}
                    </Link>
                    <div className="adm-slug">/{p.slug}/</div>
                  </td>
                  <td className="adm-cell-muted">
                    {p.category_names || <span style={{ color: '#cbd5e1' }}>—</span>}
                  </td>
                  <td className="adm-cell-muted">
                    {p.author_name || <span style={{ color: '#cbd5e1' }}>—</span>}
                  </td>
                  <td>{statusBadge(p)}</td>
                  <td className="adm-cell-muted" style={{ fontSize: '0.82rem' }}>
                    {p.scheduled_at && new Date(p.scheduled_at) > new Date()
                      ? new Date(p.scheduled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : p.published_at
                        ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="adm-actions">
                      <Link href={`/admin/posts/${p.id}`} className="adm-act-btn adm-act-edit" title="Edit">
                        <Icon name="edit" size={14} />
                      </Link>
                      <Link href={`/blog/${p.slug}/`} target="_blank" className="adm-act-btn adm-act-view" title="View">
                        <Icon name="eye" size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                        className="adm-act-btn adm-act-delete"
                        title="Delete"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="adm-table-foot">
        <span>{filtered.length} of {posts.length} posts</span>
      </div>
    </div>
  );
}
