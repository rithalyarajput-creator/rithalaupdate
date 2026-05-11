'use client';

import { useState } from 'react';
import slugify from 'slugify';
import Icon from '@/components/Icon';

type Category = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  n?: number;
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
    setErr(null); setMsg(null);
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
        setCats([...cats, { id: j.id, name, slug: finalSlug, description, n: 0 }]);
      }
      setName(''); setSlug(''); setDescription('');
      setEditing(null);
      setMsg('Category saved successfully');
      setTimeout(() => setMsg(null), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  async function handleDelete(id: number, n: number) {
    if (n > 0 && !confirm(`This category has ${n} post(s). Delete anyway? Posts will be unlinked.`)) return;
    if (n === 0 && !confirm('Delete this empty category?')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) setCats(cats.filter((c) => c.id !== id));
  }

  function startEdit(c: Category) {
    setEditing(c);
    setName(c.name); setSlug(c.slug); setDescription(c.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditing(null);
    setName(''); setSlug(''); setDescription('');
  }

  return (
    <div className="adm-grid-2">
      <div className="adm-card">
        <div className="adm-card-head">
          <h3>{editing ? 'Edit Category' : 'Add New Category'}</h3>
          {editing && <button type="button" className="adm-btn-ghost" onClick={cancelEdit}>Cancel</button>}
        </div>

        {err && <div className="adm-alert adm-alert-error">{err}</div>}
        {msg && <div className="adm-alert adm-alert-success">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="adm-field">
            <label>Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editing) setSlug(slugify(e.target.value, { lower: true, strict: true }));
              }}
              required
              placeholder="e.g. Festivals"
            />
          </div>
          <div className="adm-field">
            <label>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated"
            />
            <small>URL: /category/{slug || '...'}/</small>
          </div>
          <div className="adm-field">
            <label>Description <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</small></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short description of this category"
            />
          </div>
          <button type="submit" className="adm-btn-primary" style={{ width: '100%' }}>
            <Icon name={editing ? 'check' : 'plus'} size={14} />
            {editing ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>All Categories ({cats.length})</h3>
        </div>
        {cats.length === 0 ? (
          <div className="adm-empty">
            <Icon name="tag" size={40} />
            <h3>No categories yet</h3>
            <p>Add your first category on the left.</p>
          </div>
        ) : (
          <div className="adm-cat-list">
            {cats.map((c) => {
              const max = Math.max(...cats.map((x) => x.n || 0), 1);
              const pct = ((c.n || 0) / max) * 100;
              return (
                <div key={c.id} className="adm-cat-row">
                  <div className="adm-cat-info">
                    <div className="adm-cat-name">
                      <strong>{c.name}</strong>
                      <code>/{c.slug}/</code>
                    </div>
                    {c.description && <small>{c.description}</small>}
                    <div className="adm-cat-bar-wrap">
                      <div className="adm-cat-bar" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                  <div className="adm-cat-meta">
                    <div className="adm-cat-count">
                      <strong>{c.n || 0}</strong>
                      <small>posts</small>
                    </div>
                    <div className="adm-actions">
                      <button onClick={() => startEdit(c)} className="adm-act-btn adm-act-edit" title="Edit">
                        <Icon name="edit" size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id, c.n || 0)} className="adm-act-btn adm-act-delete" title="Delete">
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
