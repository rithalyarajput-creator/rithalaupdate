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
  folder_id: number | null;
  folder_name?: string | null;
  category_ids: number[];
  category_names: string[];
};

type Cat = {
  id: number;
  slug: string;
  name: string;
  folder_count?: number;
  photo_count?: number;
};

type Folder = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  cover_url: string | null;
  description: string | null;
  photo_count?: number;
  category_name?: string;
};

type Tab = 'folders' | 'categories' | 'photos';

export default function PhotosManager({
  initialPhotos,
  initialCategories,
  initialFolders,
}: {
  initialPhotos: Photo[];
  initialCategories: Cat[];
  initialFolders: Folder[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [cats, setCats] = useState<Cat[]>(initialCategories);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [tab, setTab] = useState<Tab>('folders');

  // Folder view inside Folders tab
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);

  // ===== Photo form =====
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoAlt, setPhotoAlt] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoFolderId, setPhotoFolderId] = useState<number | ''>('');
  const [photoCatIds, setPhotoCatIds] = useState<number[]>([]);
  const photoFileRef = useRef<HTMLInputElement>(null);

  // ===== Folder form =====
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');
  const [folderSlug, setFolderSlug] = useState('');
  const [folderCategoryId, setFolderCategoryId] = useState<number | ''>('');
  const [folderCover, setFolderCover] = useState('');
  const [folderDesc, setFolderDesc] = useState('');
  const folderFileRef = useRef<HTMLInputElement>(null);

  // ===== Category form =====
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');

  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // ==================== PHOTO HANDLERS ====================
  function openAddPhoto(folderId?: number) {
    setEditingPhoto(null);
    setPhotoTitle(''); setPhotoUrl(''); setPhotoAlt(''); setPhotoCaption('');
    setPhotoFolderId(folderId || '');
    if (folderId) {
      const f = folders.find((x) => x.id === folderId);
      setPhotoCatIds(f ? [f.category_id] : []);
    } else {
      setPhotoCatIds([]);
    }
    setShowPhotoForm(true);
    setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function startEditPhoto(p: Photo) {
    setEditingPhoto(p);
    setPhotoTitle(p.title || ''); setPhotoUrl(p.image_url);
    setPhotoAlt(p.alt_text || ''); setPhotoCaption(p.caption || '');
    setPhotoFolderId(p.folder_id || '');
    setPhotoCatIds(p.category_ids);
    setShowPhotoForm(true);
    setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function closePhotoForm() { setShowPhotoForm(false); setEditingPhoto(null); }
  async function uploadPhotoImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    setMsg('Uploading');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      setPhotoUrl(j.url);
      setMsg('Image uploaded');
      setTimeout(() => setMsg(null), 2000);
    }
  }
  async function submitPhoto(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (!photoUrl) { setErr('Image is required'); return; }
    const body = {
      title: photoTitle, image_url: photoUrl, alt_text: photoAlt, caption: photoCaption,
      folder_id: photoFolderId || null,
      category_ids: photoCatIds,
    };
    const url = editingPhoto ? `/api/photos/${editingPhoto.id}` : '/api/photos';
    const method = editingPhoto ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const j = await res.json();
      const catNames = cats.filter((c) => photoCatIds.includes(c.id)).map((c) => c.name);
      const folderName = folders.find((f) => f.id === photoFolderId)?.name || null;
      const newP: Photo = { id: editingPhoto?.id || j.id, title: photoTitle, image_url: photoUrl, alt_text: photoAlt, caption: photoCaption, folder_id: photoFolderId || null, folder_name: folderName, category_ids: photoCatIds, category_names: catNames };
      if (editingPhoto) {
        setPhotos(photos.map((p) => p.id === editingPhoto.id ? newP : p));
      } else {
        setPhotos([newP, ...photos]);
        if (photoFolderId) {
          setFolders(folders.map((f) => f.id === photoFolderId ? { ...f, photo_count: (f.photo_count || 0) + 1 } : f));
        }
      }
      closePhotoForm();
      setMsg(editingPhoto ? 'Photo updated' : 'Photo added');
      setTimeout(() => setMsg(null), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }
  async function deletePhoto(id: number) {
    if (!confirm('Delete this photo?')) return;
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const p = photos.find((x) => x.id === id);
      setPhotos(photos.filter((x) => x.id !== id));
      if (p?.folder_id) setFolders(folders.map((f) => f.id === p.folder_id ? { ...f, photo_count: Math.max(0, (f.photo_count || 0) - 1) } : f));
    }
  }
  function togglePhotoCat(id: number) {
    setPhotoCatIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  // ==================== FOLDER HANDLERS ====================
  function openAddFolder() {
    setEditingFolder(null);
    setFolderName(''); setFolderSlug(''); setFolderCover(''); setFolderDesc('');
    setFolderCategoryId(cats[0]?.id || '');
    setShowFolderForm(true);
    setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function startEditFolder(f: Folder) {
    setEditingFolder(f);
    setFolderName(f.name); setFolderSlug(f.slug);
    setFolderCategoryId(f.category_id);
    setFolderCover(f.cover_url || '');
    setFolderDesc(f.description || '');
    setShowFolderForm(true);
    setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function closeFolderForm() { setShowFolderForm(false); setEditingFolder(null); }
  async function uploadFolderCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    setMsg('Uploading');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      setFolderCover(j.url);
      setMsg('Cover uploaded');
      setTimeout(() => setMsg(null), 2000);
    }
  }
  async function submitFolder(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (!folderCategoryId) { setErr('Pick a category for this folder'); return; }
    const finalSlug = folderSlug || slugify(folderName, { lower: true, strict: true });
    const body = { category_id: folderCategoryId, name: folderName, slug: finalSlug, cover_url: folderCover || null, description: folderDesc || null };
    const url = editingFolder ? `/api/photo-folders/${editingFolder.id}` : '/api/photo-folders';
    const method = editingFolder ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const j = await res.json();
      const catName = cats.find((c) => c.id === folderCategoryId)?.name || '';
      if (editingFolder) {
        setFolders(folders.map((f) => f.id === editingFolder.id ? { ...editingFolder, ...body, category_name: catName } : f));
      } else {
        setFolders([{ id: j.id, ...body, category_name: catName, photo_count: 0 } as Folder, ...folders]);
      }
      closeFolderForm();
      setMsg(editingFolder ? 'Folder updated' : 'Folder added');
      setTimeout(() => setMsg(null), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }
  async function deleteFolder(id: number) {
    if (!confirm('Delete this folder? Photos inside will keep existing but lose their folder link.')) return;
    const res = await fetch(`/api/photo-folders/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFolders(folders.filter((f) => f.id !== id));
      if (openFolderId === id) setOpenFolderId(null);
    }
  }

  // ==================== CATEGORY HANDLERS ====================
  function openAddCat() {
    setEditingCat(null);
    setCatName(''); setCatSlug('');
    setShowCatForm(true);
  }
  function startEditCat(c: Cat) {
    setEditingCat(c);
    setCatName(c.name); setCatSlug(c.slug);
    setShowCatForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function closeCatForm() { setShowCatForm(false); setEditingCat(null); }
  async function submitCat(e: React.FormEvent) {
    e.preventDefault();
    const finalSlug = catSlug || slugify(catName, { lower: true, strict: true });
    const url = editingCat ? `/api/photo-categories/${editingCat.id}` : '/api/photo-categories';
    const method = editingCat ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: catName, slug: finalSlug }) });
    if (res.ok) {
      const j = await res.json();
      if (editingCat) {
        setCats(cats.map((c) => c.id === editingCat.id ? { ...c, name: catName, slug: finalSlug } : c));
      } else {
        setCats([...cats, { id: j.id, slug: finalSlug, name: catName, photo_count: 0, folder_count: 0 }]);
      }
      closeCatForm();
      setMsg(editingCat ? 'Category updated' : 'Category added');
      setTimeout(() => setMsg(null), 2000);
    }
  }
  async function deleteCat(id: number) {
    if (!confirm('Delete this category? Folders inside will be deleted too.')) return;
    const res = await fetch(`/api/photo-categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCats(cats.filter((c) => c.id !== id));
      setFolders(folders.filter((f) => f.category_id !== id));
    }
  }

  // ==================== OPEN FOLDER VIEW ====================
  const openFolder = openFolderId ? folders.find((f) => f.id === openFolderId) : null;
  const photosInOpenFolder = openFolderId ? photos.filter((p) => p.folder_id === openFolderId) : [];

  return (
    <>
      {msg && <div className="adm-alert adm-alert-success" style={{ margin: '0 0 16px' }}>{msg}</div>}

      {/* TABS */}
      <div className="adm-tabs">
        <button
          type="button"
          className={`adm-tab ${tab === 'folders' ? 'is-active' : ''}`}
          onClick={() => { setTab('folders'); setOpenFolderId(null); }}
        >
          <Icon name="book" size={15} /> Folders <span>{folders.length}</span>
        </button>
        <button
          type="button"
          className={`adm-tab ${tab === 'categories' ? 'is-active' : ''}`}
          onClick={() => setTab('categories')}
        >
          <Icon name="tag" size={15} /> Categories <span>{cats.length}</span>
        </button>
        <button
          type="button"
          className={`adm-tab ${tab === 'photos' ? 'is-active' : ''}`}
          onClick={() => setTab('photos')}
        >
          <Icon name="photo" size={15} /> Photos <span>{photos.length}</span>
        </button>
      </div>

      {/* ============ FOLDERS TAB ============ */}
      {tab === 'folders' && !openFolder && (
        <>
          <div className="adm-action-bar">
            <button type="button" className="adm-btn-primary" onClick={openAddFolder}>
              <Icon name="plus" size={14} /> Add Folder
            </button>
          </div>

          {showFolderForm && (
            <div className="adm-card adm-inline-form">
              <div className="adm-card-head">
                <h3>{editingFolder ? 'Edit Folder' : 'Add New Folder'}</h3>
                <button type="button" className="adm-btn-ghost" onClick={closeFolderForm}>
                  <Icon name="close" size={13} /> Cancel
                </button>
              </div>
              {err && <div className="adm-alert adm-alert-error">{err}</div>}
              <form onSubmit={submitFolder}>
                <div className="adm-field">
                  <label>Cover Image</label>
                  {folderCover ? (
                    <div className="adm-img-preview">
                      <img src={folderCover} alt="" />
                      <button type="button" onClick={() => setFolderCover('')} className="adm-img-remove">
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="adm-img-empty">
                      <Icon name="image" size={36} />
                      <small>No cover yet</small>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" className="adm-btn-ghost" onClick={() => folderFileRef.current?.click()} style={{ flex: 1 }}>
                      <Icon name="plus" size={13} /> Upload Cover
                    </button>
                    <input ref={folderFileRef} type="file" accept="image/*" onChange={uploadFolderCover} style={{ display: 'none' }} />
                  </div>
                </div>
                <div className="adm-grid-form">
                  <div className="adm-field">
                    <label>Folder Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text" value={folderName} required
                      onChange={(e) => {
                        setFolderName(e.target.value);
                        if (!editingFolder) setFolderSlug(slugify(e.target.value, { lower: true, strict: true }));
                      }}
                      placeholder="e.g. Holi 2025"
                    />
                  </div>
                  <div className="adm-field">
                    <label>Category <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={folderCategoryId} onChange={(e) => setFolderCategoryId(Number(e.target.value))} required>
                      <option value="">Select a category</option>
                      {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="adm-field">
                  <label>Description <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</small></label>
                  <textarea value={folderDesc} onChange={(e) => setFolderDesc(e.target.value)} rows={2} placeholder="Short description of this folder" />
                </div>
                <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
                  <Icon name={editingFolder ? 'check' : 'plus'} size={14} />
                  {editingFolder ? 'Update Folder' : 'Add Folder'}
                </button>
              </form>
            </div>
          )}

          <div className="adm-card">
            <div className="adm-card-head">
              <h3>All Folders ({folders.length})</h3>
            </div>
            {folders.length === 0 ? (
              <div className="adm-empty">
                <Icon name="book" size={40} />
                <h3>No folders yet</h3>
                <p>Add a folder like &quot;Holi 2025&quot; to start grouping photos.</p>
              </div>
            ) : (
              <div className="adm-folder-grid">
                {folders.map((f) => (
                  <div key={f.id} className="adm-folder-card" onClick={() => setOpenFolderId(f.id)}>
                    <div className="adm-folder-stack" aria-hidden="true"></div>
                    <div className="adm-folder-stack adm-folder-stack-2" aria-hidden="true"></div>
                    <div className="adm-folder-cover">
                      {f.cover_url ? (
                        <img src={f.cover_url} alt={f.name} />
                      ) : (
                        <div className="adm-folder-cover-empty">
                          <Icon name="image" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="adm-folder-body">
                      <strong>{f.name}</strong>
                      <small>{f.category_name} · {f.photo_count || 0} photos</small>
                    </div>
                    <div className="adm-folder-actions" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => startEditFolder(f)} className="adm-act-btn adm-act-edit" title="Edit folder">
                        <Icon name="edit" size={13} />
                      </button>
                      <button onClick={() => deleteFolder(f.id)} className="adm-act-btn adm-act-delete" title="Delete folder">
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ============ FOLDER OPEN VIEW (photos inside) ============ */}
      {tab === 'folders' && openFolder && (
        <>
          <div className="adm-folder-open-head">
            <button type="button" className="adm-btn-ghost" onClick={() => setOpenFolderId(null)}>
              <Icon name="chevron-left" size={14} /> Back to all folders
            </button>
            <div className="adm-folder-open-title">
              <h2>{openFolder.name}</h2>
              <small>{openFolder.category_name} · {photosInOpenFolder.length} photo{photosInOpenFolder.length !== 1 ? 's' : ''}</small>
            </div>
            <button type="button" className="adm-btn-primary" onClick={() => openAddPhoto(openFolder.id)}>
              <Icon name="plus" size={14} /> Add Photo
            </button>
          </div>

          {showPhotoForm && (
            <div className="adm-card adm-inline-form">
              <div className="adm-card-head">
                <h3>{editingPhoto ? 'Edit Photo' : `Add Photo to "${openFolder.name}"`}</h3>
                <button type="button" className="adm-btn-ghost" onClick={closePhotoForm}>
                  <Icon name="close" size={13} /> Cancel
                </button>
              </div>
              {err && <div className="adm-alert adm-alert-error">{err}</div>}
              <form onSubmit={submitPhoto}>
                <div className="adm-field">
                  <label>Photo Image <span style={{ color: '#ef4444' }}>*</span></label>
                  {photoUrl ? (
                    <div className="adm-img-preview">
                      <img src={photoUrl} alt="" />
                      <button type="button" onClick={() => setPhotoUrl('')} className="adm-img-remove">
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="adm-img-empty">
                      <Icon name="image" size={36} />
                      <small>No image yet</small>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" className="adm-btn-ghost" onClick={() => photoFileRef.current?.click()} style={{ flex: 1 }}>
                      <Icon name="plus" size={13} /> Upload from device
                    </button>
                    <input ref={photoFileRef} type="file" accept="image/*" onChange={uploadPhotoImage} style={{ display: 'none' }} />
                  </div>
                </div>
                <div className="adm-grid-form">
                  <div className="adm-field">
                    <label>Title</label>
                    <input type="text" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} placeholder="e.g. Holi colours" />
                  </div>
                  <div className="adm-field">
                    <label>Alt Text</label>
                    <input type="text" value={photoAlt} onChange={(e) => setPhotoAlt(e.target.value)} placeholder="Describe the image" />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Caption <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</small></label>
                  <input type="text" value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} placeholder="Optional caption" />
                </div>
                <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
                  <Icon name={editingPhoto ? 'check' : 'plus'} size={14} />
                  {editingPhoto ? 'Update Photo' : 'Add Photo'}
                </button>
              </form>
            </div>
          )}

          <div className="adm-card">
            <div className="adm-card-head">
              <h3>Photos in this folder ({photosInOpenFolder.length})</h3>
            </div>
            {photosInOpenFolder.length === 0 ? (
              <div className="adm-empty">
                <Icon name="photo" size={40} />
                <h3>No photos in this folder yet</h3>
                <p>Click &quot;Add Photo&quot; above to upload one.</p>
              </div>
            ) : (
              <div className="adm-photo-grid">
                {photosInOpenFolder.map((p) => (
                  <div key={p.id} className="adm-photo-card">
                    <img src={p.image_url} alt={p.alt_text || p.title || ''} />
                    <div className="adm-photo-info">
                      {p.title && <strong>{p.title}</strong>}
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
        </>
      )}

      {/* ============ CATEGORIES TAB ============ */}
      {tab === 'categories' && (
        <>
          <div className="adm-action-bar">
            <button type="button" className="adm-btn-primary" onClick={openAddCat}>
              <Icon name="plus" size={14} /> Add Category
            </button>
          </div>

          {showCatForm && (
            <div className="adm-card adm-inline-form">
              <div className="adm-card-head">
                <h3>{editingCat ? 'Edit Category' : 'Add New Category'}</h3>
                <button type="button" className="adm-btn-ghost" onClick={closeCatForm}>
                  <Icon name="close" size={13} /> Cancel
                </button>
              </div>
              <form onSubmit={submitCat}>
                <div className="adm-grid-form">
                  <div className="adm-field">
                    <label>Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text" value={catName} required autoFocus
                      onChange={(e) => {
                        setCatName(e.target.value);
                        if (!editingCat) setCatSlug(slugify(e.target.value, { lower: true, strict: true }));
                      }}
                      placeholder="e.g. Festivals"
                    />
                  </div>
                  <div className="adm-field">
                    <label>Slug</label>
                    <input type="text" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
                  <Icon name={editingCat ? 'check' : 'plus'} size={14} />
                  {editingCat ? 'Update Category' : 'Add Category'}
                </button>
              </form>
            </div>
          )}

          <div className="adm-card">
            <div className="adm-card-head">
              <h3>All Categories ({cats.length})</h3>
            </div>
            {cats.length === 0 ? (
              <div className="adm-empty">
                <Icon name="tag" size={40} />
                <h3>No categories yet</h3>
                <p>Add a top-level category like Festivals / Temples / Village Life.</p>
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
                      <small>{c.folder_count || 0} folders · {c.photo_count || 0} photos</small>
                      <div className="adm-actions">
                        <button onClick={() => startEditCat(c)} className="adm-act-btn adm-act-edit" title="Edit">
                          <Icon name="edit" size={13} />
                        </button>
                        <button onClick={() => deleteCat(c.id)} className="adm-act-btn adm-act-delete" title="Delete">
                          <Icon name="trash" size={13} />
                        </button>
                      </div>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* ============ PHOTOS TAB ============ */}
      {tab === 'photos' && (
        <>
          <div className="adm-action-bar">
            <button type="button" className="adm-btn-primary" onClick={() => openAddPhoto()}>
              <Icon name="plus" size={14} /> Add Photo
            </button>
          </div>

          {showPhotoForm && (
            <div className="adm-card adm-inline-form">
              <div className="adm-card-head">
                <h3>{editingPhoto ? 'Edit Photo' : 'Add New Photo'}</h3>
                <button type="button" className="adm-btn-ghost" onClick={closePhotoForm}>
                  <Icon name="close" size={13} /> Cancel
                </button>
              </div>
              {err && <div className="adm-alert adm-alert-error">{err}</div>}
              <form onSubmit={submitPhoto}>
                <div className="adm-field">
                  <label>Photo Image <span style={{ color: '#ef4444' }}>*</span></label>
                  {photoUrl ? (
                    <div className="adm-img-preview">
                      <img src={photoUrl} alt="" />
                      <button type="button" onClick={() => setPhotoUrl('')} className="adm-img-remove">
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="adm-img-empty">
                      <Icon name="image" size={36} />
                      <small>No image yet</small>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" className="adm-btn-ghost" onClick={() => photoFileRef.current?.click()} style={{ flex: 1 }}>
                      <Icon name="plus" size={13} /> Upload from device
                    </button>
                    <input ref={photoFileRef} type="file" accept="image/*" onChange={uploadPhotoImage} style={{ display: 'none' }} />
                  </div>
                </div>
                <div className="adm-grid-form">
                  <div className="adm-field">
                    <label>Folder / Album</label>
                    <select value={photoFolderId} onChange={(e) => setPhotoFolderId(Number(e.target.value) || '')}>
                      <option value=""> No folder </option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>{f.category_name} · {f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="adm-field">
                    <label>Title</label>
                    <input type="text" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} placeholder="e.g. Holi colours" />
                  </div>
                </div>
                <div className="adm-grid-form">
                  <div className="adm-field">
                    <label>Alt Text</label>
                    <input type="text" value={photoAlt} onChange={(e) => setPhotoAlt(e.target.value)} placeholder="Describe the image" />
                  </div>
                  <div className="adm-field">
                    <label>Caption</label>
                    <input type="text" value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} placeholder="Optional caption" />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Categories</label>
                  <div className="adm-multicat">
                    {cats.length === 0 ? (
                      <small>No categories yet.</small>
                    ) : cats.map((c) => (
                      <label key={c.id} className={`adm-multicat-chip ${photoCatIds.includes(c.id) ? 'is-active' : ''}`}>
                        <input type="checkbox" checked={photoCatIds.includes(c.id)} onChange={() => togglePhotoCat(c.id)} style={{ display: 'none' }} />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
                  <Icon name={editingPhoto ? 'check' : 'plus'} size={14} />
                  {editingPhoto ? 'Update Photo' : 'Add Photo'}
                </button>
              </form>
            </div>
          )}

          <div className="adm-card">
            <div className="adm-card-head">
              <h3>All Photos ({photos.length})</h3>
            </div>
            {photos.length === 0 ? (
              <div className="adm-empty">
                <Icon name="photo" size={40} />
                <h3>No photos yet</h3>
                <p>Click &quot;Add Photo&quot; above to upload one.</p>
              </div>
            ) : (
              <div className="adm-photo-grid">
                {photos.map((p) => (
                  <div key={p.id} className="adm-photo-card">
                    <img src={p.image_url} alt={p.alt_text || p.title || ''} />
                    <div className="adm-photo-info">
                      {p.title && <strong>{p.title}</strong>}
                      {p.folder_name && (
                        <div className="adm-photo-folder">
                          <Icon name="book" size={11} /> {p.folder_name}
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
        </>
      )}
    </>
  );
}
