'use client';

import { useState, useRef } from 'react';
import slugify from 'slugify';

type Author = {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  social_url: string | null;
};

export default function AuthorsManager({ initialAuthors }: { initialAuthors: Author[] }) {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
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

  function reset() {
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
      setMsg('✓ Avatar uploaded');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    const finalSlug = slug || slugify(name, { lower: true, strict: true });
    const body = { name, slug: finalSlug, bio, avatar_url: avatar || null, email: authorEmail || null, social_url: social || null };
    const url = editing ? `/api/authors/${editing.id}` : '/api/authors';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setAuthors(authors.map((a) => a.id === editing.id ? { ...editing, ...body } : a));
      } else {
        setAuthors([...authors, { id: j.id, ...body } as Author]);
      }
      reset();
      setMsg('✓ Saved');
      setTimeout(() => setMsg(null), 2000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  function startEdit(a: Author) {
    setEditing(a);
    setName(a.name); setSlug(a.slug); setBio(a.bio || '');
    setAvatar(a.avatar_url || ''); setAuthorEmail(a.email || '');
    setSocial(a.social_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this author?')) return;
    const res = await fetch(`/api/authors/${id}`, { method: 'DELETE' });
    if (res.ok) setAuthors(authors.filter((a) => a.id !== id));
  }

  return (
    <div>
      {err && <div className="form-error">{err}</div>}
      {msg && <div className="form-success">{msg}</div>}

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>{editing ? `✏️ Edit: ${editing.name}` : '➕ Add Author'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Author Name *</label>
            <input
              type="text" value={name} required
              onChange={(e) => {
                setName(e.target.value);
                if (!editing) setSlug(slugify(e.target.value, { lower: true, strict: true }));
              }}
            />
          </div>
          <div className="form-row">
            <label>Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <p className="help">URL: /author/{slug || '...'}/</p>
          </div>
          <div className="form-row">
            <label>Avatar Image</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {avatar && <img src={avatar} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />}
              <div style={{ flex: 1, minWidth: 200 }}>
                <input type="url" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://... or upload" />
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ marginTop: 6 }} />
              </div>
            </div>
          </div>
          <div className="form-row">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ minHeight: 70, fontFamily: 'inherit' }} placeholder="Short bio..." />
          </div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-row">
              <label>Email</label>
              <input type="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Social URL</label>
              <input type="url" value={social} onChange={(e) => setSocial(e.target.value)} placeholder="https://instagram.com/..." />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn">{editing ? 'Update Author' : 'Add Author'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>All Authors ({authors.length})</h3>
        {authors.length === 0 ? (
          <p style={{ color: '#888' }}>No authors yet. Add one above.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Author</th><th>Bio</th><th>Email</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {a.avatar_url ? (
                        <img src={a.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{a.name[0]}</div>
                      )}
                      <div>
                        <strong>{a.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#666' }}>/{a.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#666', maxWidth: 300 }}>{(a.bio || '').slice(0, 80) || '—'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{a.email || '—'}</td>
                  <td className="actions">
                    <button className="btn btn-sm" onClick={() => startEdit(a)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
