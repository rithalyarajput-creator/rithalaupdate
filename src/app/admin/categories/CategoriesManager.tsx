'use client';

import { useState } from 'react';
import slugify from 'slugify';

type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
};

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const finalSlug = slug || slugify(name, { lower: true, strict: true });
    const url = editing ? `/api/categories/${editing.id}` : '/api/categories';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug: finalSlug, description }),
    });
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setCats(cats.map((c) => (c.id === editing.id ? { ...editing, name, slug: finalSlug, description } : c)));
      } else {
        setCats([...cats, { id: j.id, name, slug: finalSlug, description }]);
      }
      setName('');
      setSlug('');
      setDescription('');
      setEditing(null);
      setMsg('✓ Saved');
      setTimeout(() => setMsg(null), 2000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this category? Posts will be unlinked.')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCats(cats.filter((c) => c.id !== id));
    } else {
      setErr('Delete failed');
    }
  }

  function startEdit(c: Category) {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditing(null);
    setName('');
    setSlug('');
    setDescription('');
  }

  return (
    <div>
      {err && <div className="form-error">{err}</div>}
      {msg && <div className="form-success">{msg}</div>}

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>{editing ? `✏️ Edit: ${editing.name}` : '➕ New Category'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editing) setSlug(slugify(e.target.value, { lower: true, strict: true }));
              }}
              required
            />
          </div>
          <div className="form-row">
            <label>Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <p className="help">URL: /category/{slug || '...'}/</p>
          </div>
          <div className="form-row">
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{ minHeight: 60, fontFamily: 'inherit' }}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn">
              {editing ? 'Update Category' : 'Add Category'}
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>All Categories ({cats.length})</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td><code style={{ fontSize: '0.82rem' }}>{c.slug}</code></td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {c.description || '—'}
                </td>
                <td className="actions">
                  <button className="btn btn-sm" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
