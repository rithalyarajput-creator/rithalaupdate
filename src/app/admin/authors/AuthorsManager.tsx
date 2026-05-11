'use client';

import { useState, useRef } from 'react';
import slugify from 'slugify';
import Icon from '@/components/Icon';

type Author = {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  social_url: string | null;
  post_count?: number;
};

export default function AuthorsManager({ initialAuthors }: { initialAuthors: Author[] }) {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Author | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [social, setSocial] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function openAdd() {
    setEditing(null);
    setName(''); setSlug(''); setBio('');
    setAvatar(''); setAuthorEmail(''); setSocial('');
    setShowForm(true);
    setErr(null);
  }

  function startEdit(a: Author) {
    setEditing(a);
    setName(a.name); setSlug(a.slug); setBio(a.bio || '');
    setAvatar(a.avatar_url || ''); setAuthorEmail(a.email || '');
    setSocial(a.social_url || '');
    setShowForm(true);
    setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setName(''); setSlug(''); setBio('');
    setAvatar(''); setAuthorEmail(''); setSocial('');
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading…');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      setAvatar(j.url);
      setMsg('Avatar uploaded');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    const finalSlug = slug || slugify(name, { lower: true, strict: true });
    const body = {
      name, slug: finalSlug, bio,
      avatar_url: avatar || null,
      email: authorEmail || null,
      social_url: social || null,
    };
    const url = editing ? `/api/authors/${editing.id}` : '/api/authors';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setAuthors(authors.map((a) => a.id === editing.id ? { ...editing, ...body } : a));
      } else {
        setAuthors([...authors, { id: j.id, ...body, post_count: 0 } as Author]);
      }
      closeForm();
      setMsg(editing ? 'Author updated' : 'Author added');
      setTimeout(() => setMsg(null), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this author? Posts written by them will keep their author name as text.')) return;
    const res = await fetch(`/api/authors/${id}`, { method: 'DELETE' });
    if (res.ok) setAuthors(authors.filter((a) => a.id !== id));
  }

  return (
    <>
      {msg && <div className="adm-alert adm-alert-success" style={{ margin: '0 0 16px' }}>{msg}</div>}

      <div className="adm-action-bar">
        <button type="button" className="adm-btn-primary" onClick={openAdd}>
          <Icon name="plus" size={14} /> Add Author
        </button>
      </div>

      {showForm && (
        <div className="adm-card adm-inline-form">
          <div className="adm-card-head">
            <h3>{editing ? `Edit: ${editing.name}` : 'Add New Author'}</h3>
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>
              <Icon name="close" size={13} /> Cancel
            </button>
          </div>
          {err && <div className="adm-alert adm-alert-error">{err}</div>}
          <form onSubmit={handleSubmit}>
            <div className="adm-field">
              <label>Avatar Image</label>
              <div className="adm-avatar-picker">
                {avatar ? (
                  <img src={avatar} alt="" className="adm-avatar-preview" />
                ) : (
                  <div className="adm-avatar-preview adm-avatar-empty">
                    <Icon name="user" size={32} />
                  </div>
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="url" value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://... or upload"
                  />
                  <button type="button" className="adm-btn-ghost" onClick={() => fileRef.current?.click()}>
                    <Icon name="plus" size={13} /> Upload Photo
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                </div>
              </div>
            </div>

            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text" value={name} required
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editing) setSlug(slugify(e.target.value, { lower: true, strict: true }));
                  }}
                  placeholder="e.g. Sandeep Rajput"
                />
              </div>
              <div className="adm-field">
                <label>Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
                <small>URL: /blog/?author={slug || '...'}</small>
              </div>
            </div>

            <div className="adm-field">
              <label>Description / Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Short bio shown on blog posts and author page..." />
            </div>

            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Email</label>
                <input type="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Social URL</label>
                <input type="url" value={social} onChange={(e) => setSocial(e.target.value)} placeholder="https://instagram.com/..." />
              </div>
            </div>

            <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
              <Icon name={editing ? 'check' : 'plus'} size={14} />
              {editing ? 'Update Author' : 'Add Author'}
            </button>
          </form>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>All Authors ({authors.length})</h3>
        </div>
        {authors.length === 0 ? (
          <div className="adm-empty">
            <Icon name="feather" size={40} />
            <h3>No authors yet</h3>
            <p>Click "Add Author" above to add one.</p>
          </div>
        ) : (
          <div className="adm-author-list">
            {authors.map((a) => {
              const max = Math.max(...authors.map((x) => x.post_count || 0), 1);
              const pct = ((a.post_count || 0) / max) * 100;
              return (
                <div key={a.id} className="adm-author-row">
                  {a.avatar_url ? (
                    <img src={a.avatar_url} alt="" className="adm-author-avatar" />
                  ) : (
                    <div className="adm-author-avatar adm-author-avatar-fallback">
                      {a.name[0]}
                    </div>
                  )}
                  <div className="adm-author-info">
                    <div className="adm-author-name">
                      <strong>{a.name}</strong>
                      <code>/{a.slug}/</code>
                    </div>
                    {a.bio && <small className="adm-author-bio">{a.bio.slice(0, 100)}</small>}
                    <div className="adm-cat-bar-wrap">
                      <div className="adm-cat-bar" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                  <div className="adm-cat-meta">
                    <div className="adm-cat-count">
                      <strong>{a.post_count || 0}</strong>
                      <small>posts</small>
                    </div>
                    <div className="adm-actions">
                      <button onClick={() => startEdit(a)} className="adm-act-btn adm-act-edit" title="Edit">
                        <Icon name="edit" size={14} />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="adm-act-btn adm-act-delete" title="Delete">
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
