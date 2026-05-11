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
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setName(''); setSlug(''); setDescription('');
    setShowForm(true);
    setErr(null);
  }

  function startEdit(c: Category) {
    setEditing(c);
    setName(c.name); setSlug(c.slug); setDescription(c.description || '');
    setShowForm(true);
    setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setName(''); setSlug(''); setDescription('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    const finalSlug = slug || slugify(name, { lower: true, strict: true });
    const url = editing ? `/api/categories/${editing.id}` : '/api/categories';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug: finalSlug, description }),
    });
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setCats(cats.map((c) => (c.id === editing.id ? { ...editing, name, slug: finalSlug, description } : c)));
      } else {
        setCats([...cats, { id: j.id, name, slug: finalSlug, description, n: 0 }]);
      }
      closeForm();
      setMsg(editing ? 'Category updated' : 'Category added');
      setTimeout(() => setMsg(null), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  async function handleDelete(id: number, n: number) {
    const msg = n > 0
      ? `This category has ${n} post(s). Delete anyway? Posts will be unlinked.`
      : 'Delete this empty category?';
    if (!confirm(msg)) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) setCats(cats.filter((c) => c.id !== id));
  }

  return (
    <>
      {msg && <div className="adm-alert adm-alert-success" style={{ margin: '0 0 16px' }}>{msg}</div>}

      {/* TOP ACTION BAR */}
      <div className="adm-action-bar">
        <button type="button" className="adm-btn-primary" onClick={openAdd}>
          <Icon name="plus" size={14} /> Add Category
        </button>
      </div>

      {/* SLIDE-DOWN FORM (only when adding/editing) */}
      {showForm && (
        <div className="adm-card adm-inline-form">
          <div className="adm-card-head">
            <h3>{editing ? `Edit: ${editing.name}` : 'Add New Category'}</h3>
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>
              <Icon name="close" size={13} /> Cancel
            </button>
          </div>
          {err && <div className="adm-alert adm-alert-error">{err}</div>}
          <form onSubmit={handleSubmit}>
            <div className="adm-grid-form">
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
                  autoFocus
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
            </div>
            <div className="adm-field">
              <label>Description <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</small></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Short description of this category"
              />
            </div>
            <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
              <Icon name={editing ? 'check' : 'plus'} size={14} />
              {editing ? 'Update Category' : 'Add Category'}
            </button>
          </form>
        </div>
      )}

      {/* LIST */}
      <div className="adm-card">
        <div className="adm-card-head">
          <h3>All Categories ({cats.length})</h3>
        </div>
        {cats.length === 0 ? (
          <div className="adm-empty">
            <Icon name="tag" size={40} />
            <h3>No categories yet</h3>
            <p>Click "Add Category" above to create one.</p>
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
    </>
  );
}
