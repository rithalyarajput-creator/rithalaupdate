'use client';

import { useState, useRef } from 'react';
import Icon from '@/components/Icon';

type Reel = {
  id: number;
  title: string;
  instagram_url: string | null;
  video_url?: string | null;
  youtube_url?: string | null;
  click_url?: string | null;
  thumbnail_url: string | null;
  description: string | null;
  display_order: number;
  is_featured: boolean;
  status: string;
};

export default function ReelsManager({ initialReels }: { initialReels: Reel[] }) {
  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [clickUrl, setClickUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(true);
  const [status, setStatus] = useState('published');
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbFileRef = useRef<HTMLInputElement>(null);

  function openAdd() {
    setEditing(null);
    setTitle(''); setVideoUrl(''); setYoutubeUrl(''); setInstagramUrl(''); setClickUrl('');
    setThumbnailUrl(''); setDescription('');
    setDisplayOrder(0); setIsFeatured(true); setStatus('published');
    setShowForm(true); setErr(null);
  }

  function startEdit(r: Reel) {
    setEditing(r);
    setTitle(r.title);
    setVideoUrl(r.video_url || '');
    setYoutubeUrl(r.youtube_url || '');
    setInstagramUrl(r.instagram_url || '');
    setClickUrl(r.click_url || '');
    setThumbnailUrl(r.thumbnail_url || '');
    setDescription(r.description || '');
    setDisplayOrder(r.display_order);
    setIsFeatured(r.is_featured);
    setStatus(r.status);
    setShowForm(true); setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function uploadVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Vercel Blob default limit: 4.5MB for Hobby; warn but allow
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading video (may take a minute)');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      setVideoUrl(j.url);
      setMsg('Video uploaded ');
      setTimeout(() => setMsg(null), 3000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Upload failed');
    }
  }

  async function uploadThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading thumbnail');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      setThumbnailUrl(j.url);
      setMsg('Thumbnail uploaded ');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);

    if (!title.trim()) { setErr('Title is required'); return; }
    if (!videoUrl && !youtubeUrl && !instagramUrl) {
      setErr('Add at least one source  Video file, YouTube URL, or Instagram URL.');
      return;
    }

    const body = {
      title,
      video_url: videoUrl || null,
      youtube_url: youtubeUrl || null,
      instagram_url: instagramUrl || null,
      click_url: clickUrl || null,
      thumbnail_url: thumbnailUrl || null,
      description: description || null,
      display_order: displayOrder,
      is_featured: isFeatured,
      status,
    };
    const url = editing ? `/api/reels/${editing.id}` : '/api/reels';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setReels(reels.map((r) => (r.id === editing.id ? { ...editing, ...body } : r)));
      } else {
        setReels([{ id: j.id, ...body } as Reel, ...reels]);
      }
      closeForm();
      setMsg(editing ? 'Reel updated' : 'Reel added');
      setTimeout(() => setMsg(null), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this reel?')) return;
    const res = await fetch(`/api/reels/${id}`, { method: 'DELETE' });
    if (res.ok) setReels(reels.filter((r) => r.id !== id));
  }

  function detectSource(r: Reel) {
    if (r.video_url) return { label: 'Video', color: '#10b981' };
    if (r.youtube_url) return { label: 'YouTube', color: '#ff0000' };
    if (r.instagram_url) return { label: 'Instagram', color: '#dc2743' };
    return { label: 'Link', color: '#64748b' };
  }

  return (
    <>
      {msg && <div className="adm-alert adm-alert-success" style={{ margin: '0 0 16px' }}>{msg}</div>}

      <div className="adm-action-bar">
        <button type="button" className="adm-btn-primary" onClick={openAdd}>
          <Icon name="plus" size={14} /> Add Reel
        </button>
      </div>

      {showForm && (
        <div className="adm-card adm-inline-form">
          <div className="adm-card-head">
            <h3>{editing ? `Edit: ${editing.title}` : 'Add New Reel'}</h3>
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>
              <Icon name="close" size={13} /> Cancel
            </button>
          </div>
          {err && <div className="adm-alert adm-alert-error">{err}</div>}

          <form onSubmit={handleSubmit}>
            <div className="adm-field">
              <label>Title <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text" value={title} required
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kawad Yatra 2025 Highlights"
              />
            </div>

            {/* SOURCE TABS */}
            <div className="adm-field">
              <label>Video Source <small style={{ color: '#94a3b8', fontWeight: 400 }}>(at least one is required  Video file takes priority)</small></label>

              {/* MP4 upload */}
              <div className="adm-source-card">
                <div className="adm-source-head">
                  <span className="adm-source-tag" style={{ background: '#10b981' }}>Video File</span>
                  <small>Best quality, clean autoplay, no third-party branding</small>
                </div>
                {videoUrl ? (
                  <div className="adm-img-preview">
                    <video src={videoUrl} controls style={{ width: '100%', maxHeight: 300, background: '#000' }} />
                    <button type="button" onClick={() => setVideoUrl('')} className="adm-img-remove">
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="adm-img-empty">
                    <Icon name="video" size={36} />
                    <small>No video uploaded</small>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="button" className="adm-btn-ghost" onClick={() => videoFileRef.current?.click()} style={{ flex: 1 }}>
                    <Icon name="plus" size={13} /> Upload Video (MP4)
                  </button>
                  <input ref={videoFileRef} type="file" accept="video/*" onChange={uploadVideo} style={{ display: 'none' }} />
                </div>
                <input
                  type="url" value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Or paste video URL (.mp4)"
                  style={{ marginTop: 8 }}
                />
              </div>

              {/* YouTube */}
              <div className="adm-source-card">
                <div className="adm-source-head">
                  <span className="adm-source-tag" style={{ background: '#ff0000' }}>YouTube Short</span>
                  <small>Cleaner embed than Instagram, autoplay works</small>
                </div>
                <input
                  type="url" value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                />
              </div>

              {/* Instagram */}
              <div className="adm-source-card">
                <div className="adm-source-head">
                  <span className="adm-source-tag" style={{ background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }}>Instagram Reel</span>
                  <small>Shows Instagram branding + &quot;Watch on Instagram&quot; (platform limitation)</small>
                </div>
                <input
                  type="url" value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                />
              </div>
            </div>

            <div className="adm-field">
              <label>Click-through URL <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional  where user goes when they tap the reel)</small></label>
              <input
                type="url" value={clickUrl}
                onChange={(e) => setClickUrl(e.target.value)}
                placeholder="https://... (defaults to the source URL above)"
              />
            </div>

            <div className="adm-field">
              <label>Thumbnail Image <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional  shown for video files; not needed for YouTube/Instagram)</small></label>
              {thumbnailUrl ? (
                <div className="adm-img-preview">
                  <img src={thumbnailUrl} alt="" />
                  <button type="button" onClick={() => setThumbnailUrl('')} className="adm-img-remove">
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ) : (
                <div className="adm-img-empty">
                  <Icon name="image" size={32} />
                  <small>No thumbnail</small>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" className="adm-btn-ghost" onClick={() => thumbFileRef.current?.click()} style={{ flex: 1 }}>
                  <Icon name="plus" size={13} /> Upload Thumbnail
                </button>
                <input ref={thumbFileRef} type="file" accept="image/*" onChange={uploadThumb} style={{ display: 'none' }} />
              </div>
              <input
                type="url" value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Or paste image URL"
                style={{ marginTop: 8 }}
              />
            </div>

            <div className="adm-field">
              <label>Description <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</small></label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>

            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Display Order</label>
                <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
                <small>Lower number = shown first</small>
              </div>
              <div className="adm-field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="published">Published (visible)</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>
            </div>

            <div className="adm-field">
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600 }}>
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                Featured on homepage
              </label>
            </div>

            <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
              <Icon name={editing ? 'check' : 'plus'} size={14} />
              {editing ? 'Update Reel' : 'Add Reel'}
            </button>
          </form>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>All Reels ({reels.length})</h3>
        </div>
        {reels.length === 0 ? (
          <div className="adm-empty">
            <Icon name="video" size={40} />
            <h3>No reels yet</h3>
            <p>Click &quot;Add Reel&quot; above to add your first reel.</p>
          </div>
        ) : (
          <div className="adm-reel-list-grid">
            {reels.map((r) => {
              const src = detectSource(r);
              return (
                <div key={r.id} className="adm-reel-row">
                  <div className="adm-reel-thumb">
                    {r.thumbnail_url ? (
                      <img src={r.thumbnail_url} alt={r.title} />
                    ) : r.video_url ? (
                      <video src={r.video_url} muted />
                    ) : (
                      <div className="adm-reel-thumb-empty">
                        <Icon name="video" size={24} />
                      </div>
                    )}
                    <span className="adm-reel-src" style={{ background: src.color }}>{src.label}</span>
                  </div>
                  <div className="adm-reel-info">
                    <strong>{r.title}</strong>
                    <small>
                      Order: {r.display_order} · {r.status}
                      {r.is_featured && ' ·  Featured'}
                    </small>
                  </div>
                  <div className="adm-actions">
                    <button onClick={() => startEdit(r)} className="adm-act-btn adm-act-edit" title="Edit">
                      <Icon name="edit" size={13} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="adm-act-btn adm-act-delete" title="Delete">
                      <Icon name="trash" size={13} />
                    </button>
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
