'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Testimonial = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  message: string;
  rating: number;
  location: string | null;
  status: string;
  created_at: string;
};

export default function TestimonialsManager({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initialItems);
  const [tab, setTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [msg, setMsg] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addBusy, setAddBusy] = useState(false);

  const filtered = items.filter((t) => tab === 'all' ? true : t.status === tab);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddBusy(true);
    const fd = new FormData(e.currentTarget);
    let avatar_url = '';
    const file = fd.get('avatar') as File | null;
    if (file && file.size > 0) {
      const up = new FormData();
      up.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: up });
      if (r.ok) { const j = await r.json(); avatar_url = j.url || ''; }
    }
    const body = {
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || ''),
      location: String(fd.get('location') || ''),
      message: String(fd.get('message') || ''),
      rating: Number(fd.get('rating') || 5),
      avatar_url,
      submitter_session: 'admin-added',
    };
    const res = await fetch('/api/testimonials', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const j = await res.json();
      const newItem = { id: j.id, ...body, status: 'pending', created_at: new Date().toISOString() } as any;
      await fetch(`/api/testimonials/${j.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      newItem.status = 'approved';
      setItems([newItem, ...items]);
      setMsg('Testimonial added and approved');
      setTimeout(() => setMsg(null), 2500);
      setShowAdd(false);
      (e.target as HTMLFormElement).reset();
    }
    setAddBusy(false);
  }

  async function setStatus(id: number, status: string) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setItems(items.map((t) => t.id === id ? { ...t, status } : t));
      setMsg(status === 'approved' ? 'Testimonial approved' : 'Status updated');
      setTimeout(() => setMsg(null), 2500);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this testimonial?')) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) setItems(items.filter((t) => t.id !== id));
  }

  return (
    <>
      {msg && <div className="adm-alert adm-alert-success" style={{ margin: '0 0 16px' }}>{msg}</div>}

      <div className="adm-action-bar">
        <button type="button" className="adm-btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Icon name={showAdd ? 'close' : 'plus'} size={14} /> {showAdd ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {showAdd && (
        <div className="adm-card adm-inline-form">
          <div className="adm-card-head">
            <h3>Add New Testimonial</h3>
          </div>
          <form onSubmit={handleAdd}>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" name="name" required placeholder="Person's full name" />
              </div>
              <div className="adm-field">
                <label>Location</label>
                <input type="text" name="location" placeholder="e.g. Rithala, Delhi" />
              </div>
            </div>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Phone</label>
                <input type="tel" name="phone" placeholder="Optional" />
              </div>
              <div className="adm-field">
                <label>Email</label>
                <input type="email" name="email" placeholder="Optional" />
              </div>
            </div>
            <div className="adm-field">
              <label>Message <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea name="message" rows={4} required placeholder="Their testimonial text..." />
            </div>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Rating</label>
                <select name="rating" defaultValue="5">
                  <option value="5"> (5)</option>
                  <option value="4"> (4)</option>
                  <option value="3"> (3)</option>
                  <option value="2"> (2)</option>
                  <option value="1"> (1)</option>
                </select>
              </div>
              <div className="adm-field">
                <label>Avatar Photo</label>
                <input type="file" name="avatar" accept="image/*" />
              </div>
            </div>
            <button type="submit" disabled={addBusy} className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
              <Icon name="check" size={14} /> {addBusy ? 'Adding' : 'Add & Auto-Approve'}
            </button>
          </form>
        </div>
      )}

      <div className="adm-tabs">
        <button className={tab === 'pending' ? 'is-active' : ''} onClick={() => setTab('pending')}>
          Pending ({items.filter((t) => t.status === 'pending').length})
        </button>
        <button className={tab === 'approved' ? 'is-active' : ''} onClick={() => setTab('approved')}>
          Approved ({items.filter((t) => t.status === 'approved').length})
        </button>
        <button className={tab === 'all' ? 'is-active' : ''} onClick={() => setTab('all')}>
          All ({items.length})
        </button>
      </div>

      <div className="adm-card">
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <Icon name="star" size={40} />
            <h3>No testimonials</h3>
            <p>Nothing in this tab yet.</p>
          </div>
        ) : (
          <ul className="adm-test-list">
            {filtered.map((t) => (
              <li key={t.id} className="adm-test-row">
                <div className="adm-test-avatar">
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.name} /> : <Icon name="user" size={22} />}
                </div>
                <div className="adm-test-body">
                  <div className="adm-test-head">
                    <strong>{t.name}</strong>
                    {t.location && <span className="adm-test-loc">{t.location}</span>}
                    <span className={`adm-badge ${t.status === 'approved' ? 'adm-badge-green' : t.status === 'pending' ? 'adm-badge-amber' : 'adm-badge-gray'}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="adm-test-msg">{t.message}</p>
                  <div className="adm-test-meta">
                    <span>{''.repeat(t.rating)}{''.repeat(5 - t.rating)}</span>
                    {t.phone && <span><Icon name="phone" size={12} /> {t.phone}</span>}
                    {t.email && <span><Icon name="mail" size={12} /> {t.email}</span>}
                    <span>{new Date(t.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="adm-test-actions">
                  {t.status !== 'approved' && (
                    <button className="adm-btn-primary" onClick={() => setStatus(t.id, 'approved')}>
                      <Icon name="check" size={13} /> Approve
                    </button>
                  )}
                  {t.status === 'approved' && (
                    <button className="adm-btn-ghost" onClick={() => setStatus(t.id, 'pending')}>
                      <Icon name="clock" size={13} /> Unapprove
                    </button>
                  )}
                  <button className="adm-act-btn adm-act-delete" onClick={() => handleDelete(t.id)} title="Delete">
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
