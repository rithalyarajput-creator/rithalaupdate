'use client';

import { useState } from 'react';

type Submission = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  topic: string | null;
  image_url: string | null;
  video_link: string | null;
  content: string | null;
  is_read: boolean;
  created_at: string;
};

type Props = { submissions: Submission[]; tableExists: boolean };

function getImages(image_url: string | null): string[] {
  if (!image_url) return [];
  return image_url.split(',').map((u) => u.trim()).filter(Boolean);
}

function fmt(dt: string) {
  return new Date(dt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function isToday(dt: string) {
  const d = new Date(dt);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function GuestsManager({ submissions, tableExists }: Props) {
  const [list, setList] = useState<Submission[]>(submissions);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Analytics
  const total = list.length;
  const unread = list.filter((s) => !s.is_read).length;
  const today = list.filter((s) => isToday(s.created_at)).length;
  const withPhoto = list.filter((s) => s.image_url).length;
  const withVideo = list.filter((s) => s.video_link).length;

  async function markRead(id: number) {
    await fetch('/api/guest-submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setList((prev) => prev.map((s) => s.id === id ? { ...s, is_read: true } : s));
    if (selected?.id === id) setSelected((s) => s ? { ...s, is_read: true } : s);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this submission?')) return;
    setDeleting(id);
    await fetch('/api/guest-submissions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setList((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  }

  function openDetail(s: Submission) {
    setSelected(s);
    if (!s.is_read) markRead(s.id);
  }

  async function runMigrate() {
    setMigrating(true);
    await fetch('/api/guest-submissions/migrate');
    setMigrating(false);
    window.location.reload();
  }

  if (!tableExists) {
    return (
      <div className="adm-page">
        <div className="adm-page-head"><h1 className="adm-h1">Guests</h1></div>
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <p style={{ marginBottom: 16, color: '#64748b' }}>Database table not found.</p>
          <button onClick={runMigrate} disabled={migrating} className="adm-btn-primary">
            {migrating ? 'Creating...' : 'Create Table'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">Guests <span className="gm-count">{total}</span></h1>
          <p className="adm-h1-sub">All submissions from the Coming Soon page</p>
        </div>
      </div>

      {/* Analytics cards */}
      <div className="gm-stats">
        <div className="gm-stat-card">
          <span className="gm-stat-value">{total}</span>
          <span className="gm-stat-label">Total</span>
        </div>
        <div className="gm-stat-card gm-stat-unread">
          <span className="gm-stat-value">{unread}</span>
          <span className="gm-stat-label">Unread</span>
        </div>
        <div className="gm-stat-card gm-stat-today">
          <span className="gm-stat-value">{today}</span>
          <span className="gm-stat-label">Today</span>
        </div>
        <div className="gm-stat-card gm-stat-photo">
          <span className="gm-stat-value">{withPhoto}</span>
          <span className="gm-stat-label">With Photo</span>
        </div>
        <div className="gm-stat-card gm-stat-video">
          <span className="gm-stat-value">{withVideo}</span>
          <span className="gm-stat-label">With Video</span>
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center', color: '#94a3b8' }}>
          <p style={{ fontSize: '1rem' }}>No submissions yet.</p>
        </div>
      ) : (
        <div className="gm-table-wrap">
          <table className="gm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Topic</th>
                <th>Media</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const imgs = getImages(s.image_url);
                return (
                  <tr key={s.id} className={`gm-row${!s.is_read ? ' gm-row-unread' : ''}`} onClick={() => openDetail(s)}>
                    <td>
                      <div className="gm-name-cell">
                        {imgs[0] ? (
                          <img src={imgs[0]} alt={s.name} className="gm-avatar" />
                        ) : (
                          <div className="gm-avatar-placeholder">{s.name[0].toUpperCase()}</div>
                        )}
                        <div>
                          <strong>{s.name}</strong>
                          {!s.is_read && <span className="gm-new-dot">NEW</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="gm-contact">
                        {s.email && <span>{s.email}</span>}
                        {s.phone && <span>{s.phone}</span>}
                      </div>
                    </td>
                    <td><span className="gm-topic">{s.topic || <span className="gm-none">—</span>}</span></td>
                    <td>
                      <div className="gm-badges">
                        {imgs.length > 0 && <span className="gm-badge gm-badge-photo">{imgs.length} Photo{imgs.length > 1 ? 's' : ''}</span>}
                        {s.video_link && <span className="gm-badge gm-badge-video">Video</span>}
                        {s.content && <span className="gm-badge gm-badge-content">Message</span>}
                      </div>
                    </td>
                    <td className="gm-date">{fmt(s.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="gm-view-btn" onClick={(e) => { e.stopPropagation(); openDetail(s); }}>View</button>
                        <button className="gm-del-btn" onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} disabled={deleting === s.id}>
                          {deleting === s.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (() => {
        const imgs = getImages(selected.image_url);
        return (
          <div className="gm-modal-overlay" onClick={() => setSelected(null)}>
            <div className="gm-modal" onClick={(e) => e.stopPropagation()}>
              <button className="gm-del-btn gm-modal-del" onClick={() => handleDelete(selected!.id)}>Delete</button>
              <button className="gm-modal-close" onClick={() => setSelected(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>

              <div className="gm-modal-header">
                {imgs[0] ? (
                  <img src={imgs[0]} alt={selected.name} className="gm-modal-avatar" />
                ) : (
                  <div className="gm-modal-avatar-placeholder">{selected.name[0].toUpperCase()}</div>
                )}
                <div>
                  <h2 className="gm-modal-name">{selected.name}</h2>
                  <span className="gm-modal-date">{fmt(selected.created_at)}</span>
                </div>
              </div>

              <div className="gm-modal-fields">
                {selected.email && (
                  <div className="gm-modal-field">
                    <label>Email</label>
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </div>
                )}
                {selected.phone && (
                  <div className="gm-modal-field">
                    <label>Phone</label>
                    <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                  </div>
                )}
                {selected.topic && (
                  <div className="gm-modal-field gm-modal-field-full">
                    <label>Topic</label>
                    <span>{selected.topic}</span>
                  </div>
                )}
              </div>

              {imgs.length > 0 && (
                <div className="gm-modal-section">
                  <label>Photos ({imgs.length})</label>
                  <div className="gm-modal-imgs">
                    {imgs.map((url, i) => (
                      <img key={i} src={url} alt={`photo ${i + 1}`} className="gm-modal-img" onClick={() => setLightbox(url)} />
                    ))}
                  </div>
                </div>
              )}

              {selected.video_link && (
                <div className="gm-modal-section">
                  <label>Video Link</label>
                  <a href={selected.video_link} target="_blank" rel="noopener noreferrer" className="gm-modal-link">{selected.video_link}</a>
                </div>
              )}

              {selected.content && (
                <div className="gm-modal-section">
                  <label>Message</label>
                  <p className="gm-modal-content">{selected.content}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {lightbox && (
        <div className="gm-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Full size" />
        </div>
      )}
    </div>
  );
}
