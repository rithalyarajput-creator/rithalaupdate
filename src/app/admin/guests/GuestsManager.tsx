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
  created_at: string;
};

type Props = { submissions: Submission[]; tableExists: boolean };

export default function GuestsManager({ submissions, tableExists }: Props) {
  const [selected, setSelected] = useState<Submission | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrated, setMigrated] = useState(false);

  async function runMigrate() {
    setMigrating(true);
    await fetch('/api/guest-submissions/migrate');
    setMigrated(true);
    setMigrating(false);
    window.location.reload();
  }

  if (!tableExists) {
    return (
      <div className="adm-page">
        <div className="adm-page-head">
          <h1 className="adm-h1">Guests</h1>
        </div>
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <p style={{ marginBottom: 16, color: '#64748b' }}>Database table nahi bani abhi tak.</p>
          <button onClick={runMigrate} disabled={migrating} className="adm-btn-primary">
            {migrating ? 'Creating...' : migrated ? 'Done — Refresh karein' : 'Table banao'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">Guests ({submissions.length})</h1>
          <p className="adm-h1-sub">Coming Soon page se aayi saari submissions</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
          <p>Abhi tak koi submission nahi aayi.</p>
        </div>
      ) : (
        <div className="guests-grid">
          {submissions.map((s) => (
            <div key={s.id} className="guest-card" onClick={() => setSelected(s)}>
              <div className="guest-card-top">
                {s.image_url && (
                  <img src={s.image_url} alt={s.name} className="guest-card-img" />
                )}
                <div className="guest-card-info">
                  <strong className="guest-name">{s.name}</strong>
                  {s.topic && <span className="guest-topic">{s.topic}</span>}
                  <span className="guest-date">
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <div className="guest-card-meta">
                {s.email && <span>{s.email}</span>}
                {s.phone && <span>{s.phone}</span>}
              </div>
              {s.content && <p className="guest-content-preview">{s.content.slice(0, 100)}{s.content.length > 100 ? '...' : ''}</p>}
              <div className="guest-card-badges">
                {s.image_url && <span className="guest-badge">Photo</span>}
                {s.video_link && <span className="guest-badge">Video</span>}
                {s.content && <span className="guest-badge">Content</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="guests-modal-overlay" onClick={() => setSelected(null)}>
          <div className="guests-modal" onClick={(e) => e.stopPropagation()}>
            <button className="guests-modal-close" onClick={() => setSelected(null)}>×</button>
            <h2>{selected.name}</h2>
            <div className="guests-detail-grid">
              {selected.email && <div><label>Email</label><span>{selected.email}</span></div>}
              {selected.phone && <div><label>Phone</label><span>{selected.phone}</span></div>}
              {selected.topic && <div><label>Topic</label><span>{selected.topic}</span></div>}
              <div><label>Submitted</label><span>{new Date(selected.created_at).toLocaleString('en-IN')}</span></div>
            </div>
            {selected.image_url && (
              <div className="guests-detail-section">
                <label>Photo</label>
                <img src={selected.image_url} alt="Submitted photo" className="guests-full-img" />
              </div>
            )}
            {selected.video_link && (
              <div className="guests-detail-section">
                <label>Video Link</label>
                <a href={selected.video_link} target="_blank" rel="noopener noreferrer" className="guests-link">{selected.video_link}</a>
              </div>
            )}
            {selected.content && (
              <div className="guests-detail-section">
                <label>Content</label>
                <p className="guests-full-content">{selected.content}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
