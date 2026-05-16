'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  show_on_home: boolean;
  status: string;
};

export default function FaqsManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [showOnHome, setShowOnHome] = useState(false);
  const [status, setStatus] = useState('published');
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const published = faqs.filter(f => f.status === 'published').length;
  const onHome = faqs.filter(f => f.show_on_home).length;
  const drafts = faqs.filter(f => f.status === 'draft').length;

  function openAdd() {
    setEditing(null);
    setQuestion(''); setAnswer(''); setCategory('');
    setDisplayOrder(faqs.length); setShowOnHome(false); setStatus('published');
    setShowForm(true); setErr(null);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  function startEdit(f: Faq) {
    setEditing(f);
    setQuestion(f.question); setAnswer(f.answer);
    setCategory(f.category || '');
    setDisplayOrder(f.display_order); setShowOnHome(f.show_on_home);
    setStatus(f.status);
    setShowForm(true); setErr(null);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  function closeForm() { setShowForm(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setSaving(true);
    const body = {
      question, answer, category: category || null,
      display_order: displayOrder, show_on_home: showOnHome, status,
    };
    const url = editing ? `/api/faqs/${editing.id}` : '/api/faqs';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setFaqs(faqs.map((f) => f.id === editing.id ? { ...editing, ...body } : f));
      } else {
        setFaqs([{ id: j.id, ...body } as Faq, ...faqs]);
      }
      closeForm();
      setMsg(editing ? 'FAQ updated successfully' : 'FAQ added successfully');
      setTimeout(() => setMsg(null), 3000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed to save FAQ');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this FAQ?')) return;
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFaqs(faqs.filter((f) => f.id !== id));
      setMsg('FAQ deleted');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function toggleHome(f: Faq) {
    const next = !f.show_on_home;
    const res = await fetch(`/api/faqs/${f.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, show_on_home: next }),
    });
    if (res.ok) setFaqs(faqs.map((x) => x.id === f.id ? { ...x, show_on_home: next } : x));
  }

  async function toggleStatus(f: Faq) {
    const next = f.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/faqs/${f.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, status: next }),
    });
    if (res.ok) setFaqs(faqs.map((x) => x.id === f.id ? { ...x, status: next } : x));
  }

  return (
    <>
      {/* Stats row */}
      <div className="faq-stats-row">
        <div className="faq-stat-card">
          <span className="faq-stat-num">{faqs.length}</span>
          <span className="faq-stat-label">Total FAQs</span>
        </div>
        <div className="faq-stat-card faq-stat-green">
          <span className="faq-stat-num">{published}</span>
          <span className="faq-stat-label">Published</span>
        </div>
        <div className="faq-stat-card faq-stat-blue">
          <span className="faq-stat-num">{onHome}</span>
          <span className="faq-stat-label">On Homepage</span>
        </div>
        <div className="faq-stat-card faq-stat-amber">
          <span className="faq-stat-num">{drafts}</span>
          <span className="faq-stat-label">Drafts</span>
        </div>
      </div>

      {msg && (
        <div className="adm-alert adm-alert-success" style={{ marginBottom: 16 }}>
          <Icon name="check" size={14} /> {msg}
        </div>
      )}

      {/* Form panel */}
      {showForm && (
        <div className="adm-card faq-form-panel">
          <div className="adm-card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="faq-form-icon">
                <Icon name={editing ? 'edit' : 'plus'} size={16} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{editing ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                <small style={{ color: '#94a3b8' }}>{editing ? 'Update the FAQ details below' : 'Fill in the details to add a new FAQ'}</small>
              </div>
            </div>
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>
              <Icon name="close" size={13} /> Cancel
            </button>
          </div>
          {err && <div className="adm-alert adm-alert-error" style={{ margin: '0 22px 12px' }}>{err}</div>}
          <form onSubmit={handleSubmit} style={{ padding: '0 22px 20px' }}>
            <div className="adm-field">
              <label>Question <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text" value={question} required
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. How can I share my photos with Rithala Update?"
              />
            </div>
            <div className="adm-field">
              <label>Answer <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea
                value={answer} required rows={4}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write a clear, helpful answer..."
              />
            </div>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Category <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</small></label>
                <input
                  type="text" value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. General / Submissions"
                />
              </div>
              <div className="adm-field">
                <label>Display Order</label>
                <input
                  type="number" value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />
                <small>Lower number = shown first (0 = top)</small>
              </div>
            </div>
            <div className="faq-form-toggles">
              <div className="faq-toggle-box">
                <label className="faq-toggle-label">
                  <div>
                    <strong>Status</strong>
                    <small>Published FAQs are visible to users</small>
                  </div>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="faq-status-select">
                    <option value="published">✓ Published</option>
                    <option value="draft">⏸ Draft</option>
                  </select>
                </label>
              </div>
              <div className="faq-toggle-box">
                <label className="faq-toggle-label" style={{ cursor: 'pointer' }} onClick={() => setShowOnHome(v => !v)}>
                  <div>
                    <strong>Show on Homepage</strong>
                    <small>Featured FAQs appear in the home FAQ section</small>
                  </div>
                  <div className={`faq-switch ${showOnHome ? 'on' : ''}`}>
                    <span className="faq-switch-knob" />
                  </div>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="submit" className="adm-btn-primary" disabled={saving}>
                <Icon name={editing ? 'check' : 'plus'} size={14} />
                {saving ? 'Saving...' : editing ? 'Update FAQ' : 'Add FAQ'}
              </button>
              <button type="button" className="adm-btn-ghost" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="adm-card">
        <div className="adm-card-head">
          <div>
            <h3 style={{ margin: 0 }}>All FAQs</h3>
            <small style={{ color: '#94a3b8' }}>{faqs.length} total</small>
          </div>
          <button type="button" className="adm-btn-primary" onClick={openAdd}>
            <Icon name="plus" size={14} /> Add FAQ
          </button>
        </div>

        {faqs.length === 0 ? (
          <div className="adm-empty">
            <Icon name="book" size={40} />
            <h3>No FAQs yet</h3>
            <p>Add your first FAQ using the button above.</p>
          </div>
        ) : (
          <div className="faq-table">
            <div className="faq-table-head">
              <span>Question</span>
              <span>Category</span>
              <span>Order</span>
              <span>Status</span>
              <span>Home</span>
              <span>Actions</span>
            </div>
            {faqs.map((f) => (
              <div key={f.id} className="faq-table-row">
                <div className="faq-table-q" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
                  <div className="faq-q-text">
                    <Icon name={expanded === f.id ? 'chevron-down' : 'chevron-right'} size={13} />
                    <strong>{f.question}</strong>
                  </div>
                  {expanded === f.id && (
                    <p className="faq-table-answer">{f.answer}</p>
                  )}
                </div>
                <span className="faq-table-cat">
                  {f.category ? <span className="adm-faq-tag">{f.category}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}
                </span>
                <span className="faq-table-order">{f.display_order}</span>
                <span>
                  <button
                    className={`faq-status-pill ${f.status === 'published' ? 'published' : 'draft'}`}
                    onClick={() => toggleStatus(f)}
                    title="Click to toggle"
                  >
                    {f.status === 'published' ? '● Published' : '⏸ Draft'}
                  </button>
                </span>
                <span>
                  <button
                    className={`faq-home-pill ${f.show_on_home ? 'on' : 'off'}`}
                    onClick={() => toggleHome(f)}
                    title="Toggle homepage visibility"
                  >
                    <Icon name="home" size={12} />
                    {f.show_on_home ? 'On' : 'Off'}
                  </button>
                </span>
                <span className="faq-table-actions">
                  <button onClick={() => startEdit(f)} className="adm-act-btn adm-act-edit" title="Edit">
                    <Icon name="edit" size={14} />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="adm-act-btn adm-act-delete" title="Delete">
                    <Icon name="trash" size={14} />
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
