'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

const SOURCE_LABEL: Record<string, string> = {
  contact_form: 'Contact Form',
  blog_form: 'Blog Form',
  newsletter: 'Newsletter',
};

export default function LeadsManager({ initialLeads }: { initialLeads: Lead[] }) {
  const searchParams = useSearchParams();
  const sourceFilter = searchParams?.get('source') || 'all';

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const bySource = sourceFilter === 'all' ? leads : leads.filter((l) => l.source === sourceFilter);
  const filtered = statusFilter === 'all' ? bySource : bySource.filter((l) => l.status === statusFilter);

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selected?.id === id) setSelected({ ...selected, status });
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
      setMsg('Notes saved');
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
    <div className="leads-manager">
      {err && <div className="adm-alert adm-alert-err">{err}</div>}
      {msg && <div className="adm-alert adm-alert-ok">{msg}</div>}

      {/* Status filter bar */}
      <div className="leads-filter-bar">
        <button
          className={`leads-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All <span className="leads-filter-count">{bySource.length}</span>
        </button>
        {STATUS_OPTIONS.map((s) => {
          const count = bySource.filter((l) => l.status === s).length;
          return (
            <button
              key={s}
              className={`leads-filter-btn ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="leads-filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="leads-table-wrap">
        {filtered.length === 0 ? (
          <div className="leads-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <p>No leads found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.</p>
          </div>
        ) : (
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Source</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className={l.status === 'new' ? 'leads-row-new' : ''}>
                  <td className="leads-td-name">
                    <div className="leads-avatar">{(l.name || 'A')[0].toUpperCase()}</div>
                    <span>{l.name}</span>
                  </td>
                  <td className="leads-td-contact">
                    {l.email && <div>{l.email}</div>}
                    {l.phone && <div className="leads-phone">{l.phone}</div>}
                  </td>
                  <td className="leads-td-subject">{l.subject || ''}</td>
                  <td>
                    <span className={`leads-source-badge leads-source-${l.source}`}>
                      {SOURCE_LABEL[l.source] || l.source}
                    </span>
                  </td>
                  <td className="leads-td-date">
                    {new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <select
                      className="leads-status-select"
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="leads-view-btn" onClick={() => setSelected(l)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="leads-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="leads-modal">
            <button className="leads-modal-close" onClick={() => setSelected(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="leads-modal-header">
              <div className="leads-modal-avatar">{(selected.name || 'A')[0].toUpperCase()}</div>
              <div>
                <h2 className="leads-modal-name">{selected.name}</h2>
                <p className="leads-modal-meta">
                  {new Date(selected.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  <span className={`leads-source-badge leads-source-${selected.source}`}>{SOURCE_LABEL[selected.source] || selected.source}</span>
                </p>
              </div>
            </div>

            <div className="leads-modal-body">
              {selected.email && (
                <div className="leads-modal-row">
                  <span className="leads-modal-label">Email</span>
                  <a href={`mailto:${selected.email}`} className="leads-modal-val">{selected.email}</a>
                </div>
              )}
              {selected.phone && (
                <div className="leads-modal-row">
                  <span className="leads-modal-label">Phone</span>
                  <a href={`tel:${selected.phone}`} className="leads-modal-val">{selected.phone}</a>
                </div>
              )}
              {selected.subject && (
                <div className="leads-modal-row">
                  <span className="leads-modal-label">Subject</span>
                  <span className="leads-modal-val">{selected.subject}</span>
                </div>
              )}
              <div className="leads-modal-row leads-modal-row-block">
                <span className="leads-modal-label">Message</span>
                <div className="leads-modal-message">{selected.message}</div>
              </div>

              <div className="leads-modal-row">
                <span className="leads-modal-label">Status</span>
                <select
                  className="leads-status-select"
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="leads-modal-row leads-modal-row-block">
                <span className="leads-modal-label">Internal Notes</span>
                <textarea
                  className="leads-notes"
                  defaultValue={selected.notes || ''}
                  rows={3}
                  onBlur={(e) => saveNotes(selected.id, e.target.value)}
                  placeholder="Private notes..."
                />
              </div>
            </div>

            <div className="leads-modal-footer">
              {selected.email && (
                <a href={`mailto:${selected.email}`} className="adm-btn-primary">Reply via Email</a>
              )}
              <button className="adm-btn-danger" onClick={() => deleteLead(selected.id)}>Delete Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
