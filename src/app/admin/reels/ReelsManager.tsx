'use client';

import { useState } from 'react';

type Reel = {
  id: number;
  title: string;
  instagram_url: string;
  thumbnail_url: string | null;
  description: string | null;
  display_order: number;
  is_featured: boolean;
  status: string;
};

export default function ReelsManager({ initialReels }: { initialReels: Reel[] }) {
  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [title, setTitle] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(true);
  const [status, setStatus] = useState('published');
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function reset() {
    setEditing(null);
    setTitle('');
    setInstagramUrl('');
    setThumbnailUrl('');
    setDescription('');
    setDisplayOrder(0);
    setIsFeatured(true);
    setStatus('published');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const body = {
      title,
      instagram_url: instagramUrl,
      thumbnail_url: thumbnailUrl || null,
      description: description || null,
      display_order: displayOrder,
      is_featured: isFeatured,
      status,
    };
    const url = editing ? `/api/reels/${editing.id}` : '/api/reels';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setReels(reels.map((r) => (r.id === editing.id ? { ...editing, ...body } : r)));
      } else {
        setReels([{ id: j.id, ...body } as Reel, ...reels]);
      }
      reset();
      setMsg('✓ Saved. Reel will appear on homepage.');
      setTimeout(() => setMsg(null), 3000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  function startEdit(r: Reel) {
    setEditing(r);
    setTitle(r.title);
    setInstagramUrl(r.instagram_url);
    setThumbnailUrl(r.thumbnail_url || '');
    setDescription(r.description || '');
    setDisplayOrder(r.display_order);
    setIsFeatured(r.is_featured);
    setStatus(r.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this reel?')) return;
    const res = await fetch(`/api/reels/${id}`, { method: 'DELETE' });
    if (res.ok) setReels(reels.filter((r) => r.id !== id));
  }

  return (
    <div>
      {err && <div className="form-error">{err}</div>}
      {msg && <div className="form-success">{msg}</div>}

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>{editing ? '✏️ Edit Reel' : '➕ Add Instagram Reel'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Reel Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kawad Yatra 2025 Highlights"
              required
            />
          </div>
          <div className="form-row">
            <label>Instagram Reel URL</label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              required
            />
            <p className="help">
              Open Instagram → Reel → Share → Copy Link → paste here.
            </p>
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
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div className="form-row" style={{ flex: 1, minWidth: 150 }}>
              <label>Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
              <p className="help">Lower number = shown first.</p>
            </div>
            <div className="form-row" style={{ flex: 1, minWidth: 150 }}>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured on homepage
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn">
              {editing ? 'Update Reel' : 'Add Reel'}
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>All Reels ({reels.length})</h3>
        {reels.length === 0 ? (
          <p style={{ color: '#888' }}>No reels yet. Add the first one above.</p>
        ) : (
          <div className="reel-grid">
            {reels.map((r) => (
              <div key={r.id} className="reel-card">
                {r.thumbnail_url && <img src={r.thumbnail_url} alt={r.title} />}
                <div style={{ padding: 10 }}>
                  <h4 style={{ margin: '4px 0', fontSize: '0.95rem' }}>{r.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: '#666', margin: 0 }}>
                    Order: {r.display_order} · {r.status} {r.is_featured && '· ⭐ Featured'}
                  </p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    <a href={r.instagram_url} target="_blank" rel="noopener" className="btn btn-sm btn-secondary">
                      ▶ Open
                    </a>
                    <button className="btn btn-sm" onClick={() => startEdit(r)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
