'use client';

import { useState, useRef } from 'react';

type Media = {
  id: number;
  url: string;
  filename: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  caption: string | null;
  title: string | null;
  created_at: string;
};

export default function MediaManager({ initialMedia }: { initialMedia: Media[] }) {
  const [media, setMedia] = useState<Media[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Media | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setErr(null);
    setMsg(null);

    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const j = await res.json();
        const newItem: Media = {
          id: j.id || Date.now(),
          url: j.url,
          filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          alt_text: null,
          caption: null,
          title: null,
          created_at: new Date().toISOString(),
        };
        setMedia((m) => [newItem, ...m]);
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || 'Upload failed');
      }
    }
    setMsg(`✓ ${files.length} file(s) uploaded`);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    setTimeout(() => setMsg(null), 3000);
    // Reload page to get full data with IDs
    setTimeout(() => window.location.reload(), 500);
  }

  async function saveItemMeta(item: Media) {
    const res = await fetch(`/api/media/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alt_text: item.alt_text,
        caption: item.caption,
        title: item.title,
      }),
    });
    if (res.ok) {
      setMsg('✓ Saved');
      setMedia((m) => m.map((x) => (x.id === item.id ? item : x)));
      setTimeout(() => setMsg(null), 2000);
    } else {
      setErr('Save failed');
    }
  }

  async function deleteItem(id: number) {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMedia((m) => m.filter((x) => x.id !== id));
      setSelected(null);
    } else {
      setErr('Delete failed');
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setMsg('✓ URL copied to clipboard');
    setTimeout(() => setMsg(null), 2000);
  }

  function copyImgTag(item: Media) {
    const tag = `<img src="${item.url}" alt="${item.alt_text || ''}" />`;
    navigator.clipboard.writeText(tag);
    setMsg('✓ <img> tag copied — paste into post content');
    setTimeout(() => setMsg(null), 2500);
  }

  return (
    <div>
      {err && <div className="form-error">{err}</div>}
      {msg && <div className="form-success">{msg}</div>}

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Upload Images</h3>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
        <p className="help">
          {uploading ? 'Uploading…' : 'Select multiple images. They will be stored in Vercel Blob.'}
        </p>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Library ({media.length} items)</h3>
        {media.length === 0 ? (
          <p style={{ color: '#888' }}>No images yet. Upload some above.</p>
        ) : (
          <div className="media-grid">
            {media.map((m) => (
              <div key={m.id} className="media-item" onClick={() => setSelected(m)}>
                <img src={m.url} alt={m.alt_text || ''} />
                <div className="media-info">
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>
                    {m.filename || 'untitled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="media-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="media-modal">
            <button className="media-close" onClick={() => setSelected(null)}>×</button>
            <div className="media-modal-grid">
              <div>
                <img src={selected.url} alt={selected.alt_text || ''} style={{ width: '100%', borderRadius: 6 }} />
                <p style={{ fontSize: '0.78rem', color: '#666', wordBreak: 'break-all' }}>
                  {selected.url}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="btn btn-sm" onClick={() => copyUrl(selected.url)}>📋 Copy URL</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => copyImgTag(selected)}>
                    📋 Copy &lt;img&gt; tag
                  </button>
                  <button className="btn-danger" onClick={() => deleteItem(selected.id)}>🗑 Delete</button>
                </div>
              </div>
              <div>
                <div className="form-row">
                  <label>Title</label>
                  <input
                    type="text"
                    value={selected.title || ''}
                    onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>Alt Text (for SEO + accessibility)</label>
                  <input
                    type="text"
                    value={selected.alt_text || ''}
                    onChange={(e) => setSelected({ ...selected, alt_text: e.target.value })}
                    placeholder="Describe the image (Hindi/English)"
                  />
                  <p className="help">Important for SEO and screen readers.</p>
                </div>
                <div className="form-row">
                  <label>Caption</label>
                  <textarea
                    value={selected.caption || ''}
                    onChange={(e) => setSelected({ ...selected, caption: e.target.value })}
                    rows={3}
                    style={{ minHeight: 60, fontFamily: 'inherit' }}
                  />
                </div>
                <button className="btn" onClick={() => saveItemMeta(selected)}>💾 Save Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
