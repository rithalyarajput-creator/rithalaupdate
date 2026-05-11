'use client';

import { useState, useRef } from 'react';
import slugify from 'slugify';
import Icon from '@/components/Icon';

type Photo = {
  id: number;
  title: string | null;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  category_ids: number[];
  category_names: string[];
};

type Cat = { id: number; slug: string; name: string; n?: number };

export default function PhotosManager({
  initialPhotos,
  initialCategories,
}: {
  initialPhotos: Photo[];
  initialCategories: Cat[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [cats, setCats] = useState<Cat[]>(initialCategories);

  // Photo form
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Category form
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');

  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function resetPhoto() {
    setEditingPhoto(null);
    setTitle(''); setImageUrl(''); setAltText(''); setCaption('');
    setSelectedCats([]);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading…');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      setImageUrl(j.url);
      setMsg('Image uploaded');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function handlePhotoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (!imageUrl) { setErr('Image is required'); return; }
    const body = { title, image_url: imageUrl, alt_text: altText, caption, category_ids: selectedCats };
    const url = editingPhoto ? `/api/photos/${editingPhoto.id}` : '/api/photos';
    const method = editingPhoto ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const j = await res.json();
      if (editingPhoto) {
        setPhotos(photos.map((p) => p.id === editingPhoto.id
          ? { ...editingPhoto, title, image_url: imageUrl, alt_text: altText, caption, category_ids: selectedCats, category_names: cats.filter((c) => selectedCats.includes(c.id)).map((c) => c.name) }
          : p
        ));
      } else {
        setPhotos([{ id: j.id, title, image_url: imageUrl, alt_text: altText, caption, category_ids: selectedCats, category_names: cats.filter((c) => selectedCats.includes(c.id)).map((c) => c.name) }, ...photos]);
      }
      resetPhoto();
      setMsg('Photo saved');
      setTimeout(() => setMsg(null), 2000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  function startEditPhoto(p: Photo) {
    setEditingPhoto(p);
    setTitle(p.title || ''); setImageUrl(p.image_url);
    setAltText(p.alt_text || ''); setCaption(p.caption || '');
    setSelectedCats(p.category_ids);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deletePhoto(id: number) {
    if (!confirm('Delete this photo?')) return;
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    if (res.ok) setPhotos(photos.filter((p) => p.id !== id));
  }

  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalSlug = catSlug || slugify(catName, { lower: true, strict: true });
    const res = await fetch('/api/photo-categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: catName, slug: finalSlug }),
    });
    if (res.ok) {
      const j = await res.json();
      setCats([...cats, { id: j.id, slug: finalSlug, name: catName, n: 0 }]);
      setCatName(''); setCatSlug('');
      setMsg('Category added');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function deleteCat(id: number) {
    if (!confirm('Delete this category? Photos will be unlinked from it.')) return;
    const res = await fetch(`/api/photo-categories/${id}`, { method: 'DELETE' });
    if (res.ok) setCats(cats.filter((c) => c.id !== id));
  }

  function toggleCat(id: number) {
    setSelectedCats((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <div>
      {err && <div className="adm-alert adm-alert-error">{err}</div>}
      {msg && <div className="adm-alert adm-alert-success">{msg}</div>}

      <div className="adm-grid-2" style={{ alignItems: 'start' }}>
        {/* Photo upload form */}
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>{editingPhoto ? 'Edit Photo' : 'Add Photo'}</h3>
            {editingPhoto && <button type="button" className="adm-btn-ghost" onClick={resetPhoto}>Cancel</button>}
          </div>
          <form onSubmit={handlePhotoSubmit}>
            <div className="adm-field">
              <label>Photo Image <span style={{ color: '#ef4444' }}>*</span></label>
              {imageUrl ? (
                <div className="adm-img-preview">
                  <img src={imageUrl} alt="" />
                  <button type="button" onClick={() => setImageUrl('')} className="adm-img-remove" aria-label="Remove">
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ) : (
                <div className="adm-img-empty">
                  <Icon name="image" size={36} />
                  <small>No image</small>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" className="adm-btn-ghost" onClick={() => fileRef.current?.click()} style={{ flex: 1 }}>
                  <Icon name="plus" size={13} /> Upload
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
              </div>
              <input
                type="url" value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL"
                style={{ marginTop: 8 }}
              />
            </div>

            <div className="adm-field">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Kawad Yatra start" />
            </div>

            <div className="adm-field">
              <label>Alt Text (for SEO + accessibility)</label>
              <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image" />
            </div>

            <div className="adm-field">
              <label>Caption (optional)</label>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} placeholder="Optional caption shown below the image" />
            </div>

            <div className="adm-field">
              <label>Categories <small style={{ color: '#94a3b8', fontWeight: 400 }}>(select one or more)</small></label>
              <div className="adm-multicat">
                {cats.length === 0 ? (
                  <small>No photo categories yet. Add some on the right.</small>
                ) : cats.map((c) => (
                  <label key={c.id} className={`adm-multicat-chip ${selectedCats.includes(c.id) ? 'is-active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(c.id)}
                      onChange={() => toggleCat(c.id)}
                      style={{ display: 'none' }}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="adm-btn-primary" style={{ width: '100%', margin: '0 22px' }}>
              <Icon name={editingPhoto ? 'check' : 'plus'} size={14} />
              {editingPhoto ? 'Update Photo' : 'Add Photo'}
            </button>
          </form>
        </div>

        {/* Photo categories */}
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Photo Categories ({cats.length})</h3>
          </div>

          <form onSubmit={handleCatSubmit} style={{ padding: '14px 22px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="text" value={catName}
                onChange={(e) => {
                  setCatName(e.target.value);
                  setCatSlug(slugify(e.target.value, { lower: true, strict: true }));
                }}
                placeholder="e.g. Kawad 2026"
                style={{ flex: 1, minWidth: 140, padding: 9, border: '1.5px solid #e2e8f0', borderRadius: 8 }}
                required
              />
              <button type="submit" className="adm-btn-primary" style={{ padding: '9px 18px' }}>
                <Icon name="plus" size={13} /> Add
              </button>
            </div>
          </form>

          {cats.length === 0 ? (
            <div className="adm-empty">
              <Icon name="tag" size={40} />
              <h3>No categories yet</h3>
              <p>Add one above to start organizing photos.</p>
            </div>
          ) : (
            <ul className="adm-photocat-list">
              {cats.map((c) => (
                <li key={c.id}>
                  <span>
                    <strong>{c.name}</strong>
                    <code>/{c.slug}/</code>
                  </span>
                  <span className="adm-photocat-meta">
                    <small>{c.n || 0} photos</small>
                    <button onClick={() => deleteCat(c.id)} className="adm-act-btn adm-act-delete" title="Delete">
                      <Icon name="trash" size={13} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Photo gallery */}
      <div className="adm-card" style={{ marginTop: 20 }}>
        <div className="adm-card-head">
          <h3>Photo Library ({photos.length})</h3>
        </div>
        {photos.length === 0 ? (
          <div className="adm-empty">
            <Icon name="photo" size={40} />
            <h3>No photos yet</h3>
            <p>Upload your first photo above.</p>
          </div>
        ) : (
          <div className="adm-photo-grid">
            {photos.map((p) => (
              <div key={p.id} className="adm-photo-card">
                <img src={p.image_url} alt={p.alt_text || p.title || ''} />
                <div className="adm-photo-info">
                  {p.title && <strong>{p.title}</strong>}
                  {p.category_names.length > 0 && (
                    <div className="adm-photo-cats">
                      {p.category_names.map((n, i) => <span key={i}>{n}</span>)}
                    </div>
                  )}
                </div>
                <div className="adm-photo-actions">
                  <button onClick={() => startEditPhoto(p)} className="adm-act-btn adm-act-edit" title="Edit">
                    <Icon name="edit" size={13} />
                  </button>
                  <button onClick={() => deletePhoto(p.id)} className="adm-act-btn adm-act-delete" title="Delete">
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
