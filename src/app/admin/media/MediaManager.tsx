'use client';

import { useState, useRef } from 'react';
import Icon from '@/components/Icon';

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

function fmtSize(bytes: number | null) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MediaManager({ initialMedia }: { initialMedia: Media[] }) {
  const [media, setMedia] = useState<Media[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Media | null>(null);
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = media.filter(m =>
    !search || (m.filename || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.alt_text || '').toLowerCase().includes(search.toLowerCase())
  );

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;
    setUploading(true); setErr(null); setMsg(null); setUploadProgress(0);
    let done = 0;
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const j = await res.json();
        const newItem: Media = {
          id: j.id || Date.now(),
          url: j.url, filename: file.name,
          mime_type: file.type, size_bytes: file.size,
          alt_text: null, caption: null, title: null,
          created_at: new Date().toISOString(),
        };
        setMedia(m => [newItem, ...m]);
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || 'Upload failed');
      }
      done++;
      setUploadProgress(Math.round((done / files.length) * 100));
    }
    setMsg(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    setTimeout(() => setMsg(null), 3000);
    setTimeout(() => window.location.reload(), 600);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    uploadFiles(Array.from(e.target.files || []));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    uploadFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  }

  async function saveItemMeta(item: Media) {
    const res = await fetch(`/api/media/${item.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt_text: item.alt_text, caption: item.caption, title: item.title }),
    });
    if (res.ok) {
      setMsg('Details saved');
      setMedia(m => m.map(x => x.id === item.id ? item : x));
      setTimeout(() => setMsg(null), 2000);
    } else { setErr('Save failed'); }
  }

  async function deleteItem(id: number) {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
    if (res.ok) { setMedia(m => m.filter(x => x.id !== id)); setSelected(null); }
    else setErr('Delete failed');
  }

  function copyUrl(item: Media) {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setMsg('URL copied to clipboard');
    setTimeout(() => { setMsg(null); setCopiedId(null); }, 2000);
  }

  function copyImgTag(item: Media) {
    navigator.clipboard.writeText(`<img src="${item.url}" alt="${item.alt_text || ''}" />`);
    setMsg('<img> tag copied — paste into post content');
    setTimeout(() => setMsg(null), 2500);
  }

  return (
    <div className="ml-wrap">
      {err && <div className="adm-alert adm-alert-error" style={{ marginBottom: 16 }}>{err}</div>}
      {msg && <div className="adm-alert adm-alert-success" style={{ marginBottom: 16 }}><Icon name="check" size={14} /> {msg}</div>}

      {/* Stats */}
      <div className="faq-stats-row" style={{ marginBottom: 20 }}>
        <div className="faq-stat-card">
          <span className="faq-stat-num">{media.length}</span>
          <span className="faq-stat-label">Total Files</span>
        </div>
        <div className="faq-stat-card faq-stat-green">
          <span className="faq-stat-num">{media.filter(m => m.alt_text).length}</span>
          <span className="faq-stat-label">With Alt Text</span>
        </div>
        <div className="faq-stat-card faq-stat-amber">
          <span className="faq-stat-num">{media.filter(m => !m.alt_text).length}</span>
          <span className="faq-stat-label">Missing Alt</span>
        </div>
        <div className="faq-stat-card faq-stat-blue">
          <span className="faq-stat-num">
            {fmtSize(media.reduce((s, m) => s + (m.size_bytes || 0), 0))}
          </span>
          <span className="faq-stat-label">Total Size</span>
        </div>
      </div>

      {/* Upload zone */}
      <div
        className={`ml-upload-zone${dragOver ? ' drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
        {uploading ? (
          <div className="ml-uploading">
            <div className="ml-progress-bar"><div className="ml-progress-fill" style={{ width: `${uploadProgress}%` }} /></div>
            <p>Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="ml-upload-icon">
              <Icon name="image" size={32} />
            </div>
            <p className="ml-upload-title">Drop images here or <span>click to browse</span></p>
            <p className="ml-upload-sub">Supports JPG, PNG, WebP, GIF — multiple files allowed</p>
          </>
        )}
      </div>

      {/* Library */}
      <div className="adm-card" style={{ marginTop: 20 }}>
        <div className="adm-card-head">
          <div>
            <h3 style={{ margin: 0 }}>Media Library</h3>
            <small style={{ color: '#94a3b8' }}>{filtered.length} of {media.length} items</small>
          </div>
          <div className="ml-search-wrap">
            <Icon name="search" size={14} />
            <input
              type="search"
              placeholder="Search by filename or alt text..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ml-search"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="adm-empty">
            <Icon name="image" size={40} />
            <h3>{search ? 'No results found' : 'No images yet'}</h3>
            <p>{search ? 'Try a different search term' : 'Upload images using the zone above'}</p>
          </div>
        ) : (
          <div className="ml-grid">
            {filtered.map((m) => (
              <div key={m.id} className="ml-card" onClick={() => setSelected(m)}>
                <div className="ml-card-img">
                  <img src={m.url} alt={m.alt_text || ''} loading="lazy" />
                  {!m.alt_text && <span className="ml-no-alt" title="Missing alt text">!</span>}
                  <div className="ml-card-overlay">
                    <span>View Details</span>
                  </div>
                </div>
                <div className="ml-card-body">
                  <p className="ml-card-name" title={m.filename || ''}>{(m.filename || 'untitled').slice(0, 22)}{(m.filename || '').length > 22 ? '…' : ''}</p>
                  <span className="ml-card-size">{fmtSize(m.size_bytes)}</span>
                </div>
                <button
                  className={`ml-copy-btn${copiedId === m.id ? ' copied' : ''}`}
                  onClick={e => { e.stopPropagation(); copyUrl(m); }}
                  title="Copy URL"
                >
                  <Icon name={copiedId === m.id ? 'check' : 'copy'} size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="ml-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="ml-modal">
            <button className="ml-modal-close" onClick={() => setSelected(null)}>
              <Icon name="close" size={16} />
            </button>
            <div className="ml-modal-grid">
              {/* Left: preview */}
              <div className="ml-modal-preview">
                <img src={selected.url} alt={selected.alt_text || ''} />
                <div className="ml-modal-meta">
                  <div className="ml-meta-row"><span>Filename</span><strong>{selected.filename || '—'}</strong></div>
                  <div className="ml-meta-row"><span>Size</span><strong>{fmtSize(selected.size_bytes)}</strong></div>
                  <div className="ml-meta-row"><span>Type</span><strong>{selected.mime_type || '—'}</strong></div>
                  <div className="ml-meta-row"><span>Uploaded</span><strong>{fmtDate(selected.created_at)}</strong></div>
                </div>
                <div className="ml-modal-btns">
                  <button className="adm-btn-primary" onClick={() => copyUrl(selected)}>
                    <Icon name="copy" size={13} /> Copy URL
                  </button>
                  <button className="adm-btn-ghost" onClick={() => copyImgTag(selected)}>
                    <Icon name="code" size={13} /> Copy &lt;img&gt;
                  </button>
                  <button className="adm-btn-danger" onClick={() => deleteItem(selected.id)}>
                    <Icon name="trash" size={13} /> Delete
                  </button>
                </div>
              </div>

              {/* Right: edit */}
              <div className="ml-modal-edit">
                <h3>Edit Details</h3>
                <div className="adm-field">
                  <label>Title</label>
                  <input
                    type="text" value={selected.title || ''}
                    onChange={e => setSelected({ ...selected, title: e.target.value })}
                    placeholder="e.g. Kawad Yatra 2025"
                  />
                </div>
                <div className="adm-field">
                  <label>
                    Alt Text
                    {!selected.alt_text && <span style={{ color: '#ef4444', marginLeft: 6, fontSize: '0.8rem' }}>⚠ Missing — bad for SEO</span>}
                  </label>
                  <input
                    type="text" value={selected.alt_text || ''}
                    onChange={e => setSelected({ ...selected, alt_text: e.target.value })}
                    placeholder="Describe the image for SEO & accessibility"
                  />
                  <small>Important for SEO and screen readers</small>
                </div>
                <div className="adm-field">
                  <label>Caption</label>
                  <textarea
                    value={selected.caption || ''}
                    onChange={e => setSelected({ ...selected, caption: e.target.value })}
                    rows={3} placeholder="Optional caption..."
                  />
                </div>
                <button className="adm-btn-primary" onClick={() => saveItemMeta(selected)}>
                  <Icon name="check" size={14} /> Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
