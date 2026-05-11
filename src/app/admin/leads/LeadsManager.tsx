'use client';

import { useState } from 'react';

type Lead = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed', 'spam'];

export default function LeadsManager({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<string>('all');
  const [sourceTab, setSourceTab] = useState<'all' | 'contact_form' | 'newsletter'>('all');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const bySource = sourceTab === 'all' ? leads : leads.filter((l) => l.source === sourceTab);
  const filtered = filter === 'all' ? bySource : bySource.filter((l) => l.status === filter);

  const contactCount = leads.filter((l) => l.source === 'contact_form').length;
  const newsletterCount = leads.filter((l) => l.source === 'newsletter').length;

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selected && selected.id === id) setSelected({ ...selected, status });
    } else {
      setErr('Update failed');
    }
  }

  async function saveNotes(id: number, notes: string) {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) {
      setLeads(leads.map((l) => (l.id === id ? { ...l, notes } : l)));
      setMsg('✓ Notes saved');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function deleteLead(id: number) {
    if (!confirm('Delete this lead permanently?')) return;
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLeads(leads.filter((l) => l.id !== id));
      setSelected(null);
    }
  }

  return (
    <div>
      {err && <div className="form-error">{err}</div>}
      {msg && <div className="form-success">{msg}</div>}

      <div className="admin-card">
        {/* Source tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, paddingBottom: 14, borderBottom: '2px solid #eee' }}>
          <button
            className={`btn btn-sm ${sourceTab === 'all' ? '' : 'btn-secondary'}`}
            onClick={() => setSourceTab('all')}
          >
            🗂️ All Leads ({leads.length})
          </button>
          <button
            className={`btn btn-sm ${sourceTab === 'contact_form' ? '' : 'btn-secondary'}`}
            onClick={() => setSourceTab('contact_form')}
          >
            📨 Contact Form ({contactCount})
          </button>
          <button
            className={`btn btn-sm ${sourceTab === 'newsletter' ? '' : 'btn-secondary'}`}
            onClick={() => setSourceTab('newsletter')}
          >
            📬 Newsletter ({newsletterCount})
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? '' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({bySource.length})
          </button>
          {STATUS_OPTIONS.map((s) => {
            const count = bySource.filter((l) => l.status === s).length;
            return (
              <button
                key={s}
                className={`btn btn-sm ${filter === s ? '' : 'btn-secondary'}`}
                onClick={() => setFilter(s)}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>
            No leads {filter !== 'all' ? `with status "${filter}"` : 'yet'}. Contact form submissions will appear here.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.name}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {l.email && <div>{l.email}</div>}
                    {l.phone && <div>{l.phone}</div>}
                  </td>
                  <td>{l.subject || '—'}</td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {new Date(l.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="actions">
                    <button className="btn btn-sm" onClick={() => setSelected(l)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div
          className="media-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="media-modal" style={{ maxWidth: 600 }}>
            <button className="media-close" onClick={() => setSelected(null)}>×</button>
            <h2 style={{ marginTop: 0 }}>{selected.name}</h2>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              Submitted: {new Date(selected.created_at).toLocaleString('en-IN')} · Source: {selected.source}
            </p>
            <hr />
            {selected.email && (
              <p><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></p>
            )}
            {selected.phone && (
              <p><strong>Phone:</strong> <a href={`tel:${selected.phone}`}>{selected.phone}</a></p>
            )}
            {selected.subject && <p><strong>Subject:</strong> {selected.subject}</p>}
            <p><strong>Message:</strong></p>
            <div style={{ background: '#f3f4f6', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap' }}>
              {selected.message}
            </div>

            <div className="form-row" style={{ marginTop: 16 }}>
              <label>Internal Notes</label>
              <textarea
                defaultValue={selected.notes || ''}
                rows={3}
                style={{ minHeight: 60, fontFamily: 'inherit' }}
                onBlur={(e) => saveNotes(selected.id, e.target.value)}
                placeholder="Private notes about this lead…"
              />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              <a href={`mailto:${selected.email}`} className="btn">📧 Reply via Email</a>
              <button className="btn-danger" onClick={() => deleteLead(selected.id)}>🗑 Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
