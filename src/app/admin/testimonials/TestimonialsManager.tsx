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

  const filtered = items.filter((t) => tab === 'all' ? true : t.status === tab);

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
                    <span>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
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
