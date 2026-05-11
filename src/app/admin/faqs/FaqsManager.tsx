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

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [showOnHome, setShowOnHome] = useState(false);
  const [status, setStatus] = useState('published');
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setQuestion(''); setAnswer(''); setCategory('');
    setDisplayOrder(0); setShowOnHome(false); setStatus('published');
    setShowForm(true); setErr(null);
  }

  function startEdit(f: Faq) {
    setEditing(f);
    setQuestion(f.question); setAnswer(f.answer);
    setCategory(f.category || '');
    setDisplayOrder(f.display_order); setShowOnHome(f.show_on_home);
    setStatus(f.status);
    setShowForm(true); setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() { setShowForm(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
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
    if (res.ok) {
      const j = await res.json();
      if (editing) {
        setFaqs(faqs.map((f) => f.id === editing.id ? { ...editing, ...body } : f));
      } else {
        setFaqs([{ id: j.id, ...body } as Faq, ...faqs]);
      }
      closeForm();
      setMsg(editing ? 'FAQ updated' : 'FAQ added');
      setTimeout(() => setMsg(null), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Failed');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this FAQ?')) return;
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    if (res.ok) setFaqs(faqs.filter((f) => f.id !== id));
  }

  async function toggleHome(f: Faq) {
    const next = !f.show_on_home;
    const res = await fetch(`/api/faqs/${f.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, show_on_home: next }),
    });
    if (res.ok) {
      setFaqs(faqs.map((x) => x.id === f.id ? { ...x, show_on_home: next } : x));
    }
  }

  return (
    <>
      {msg && <div className="adm-alert adm-alert-success" style={{ margin: '0 0 16px' }}>{msg}</div>}

      <div className="adm-action-bar">
        <button type="button" className="adm-btn-primary" onClick={openAdd}>
          <Icon name="plus" size={14} /> Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="adm-card adm-inline-form">
          <div className="adm-card-head">
            <h3>{editing ? 'Edit FAQ' : 'Add New FAQ'}</h3>
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>
              <Icon name="close" size={13} /> Cancel
            </button>
          </div>
          {err && <div className="adm-alert adm-alert-error">{err}</div>}
          <form onSubmit={handleSubmit}>
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
                placeholder="Detailed answer..."
              />
            </div>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Category <small style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</small></label>
                <input
                  type="text" value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. General / Submissions / Account"
                />
              </div>
              <div className="adm-field">
                <label>Display Order</label>
                <input
                  type="number" value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />
                <small>Lower number = shown first</small>
              </div>
            </div>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>
              <div className="adm-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                  <input
                    type="checkbox" checked={showOnHome}
                    onChange={(e) => setShowOnHome(e.target.checked)}
                  />
                  Show on Homepage
                </label>
                <small>Featured FAQs appear in the home FAQ section</small>
              </div>
            </div>
            <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
              <Icon name={editing ? 'check' : 'plus'} size={14} />
              {editing ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </form>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>All FAQs ({faqs.length})</h3>
        </div>
        {faqs.length === 0 ? (
          <div className="adm-empty">
            <Icon name="book" size={40} />
            <h3>No FAQs yet</h3>
            <p>Add your first FAQ above.</p>
          </div>
        ) : (
          <ul className="adm-faq-list">
            {faqs.map((f) => (
              <li key={f.id} className="adm-faq-row">
                <div className="adm-faq-body">
                  <strong>{f.question}</strong>
                  <p>{f.answer}</p>
                  <div className="adm-faq-meta">
                    {f.category && <span className="adm-faq-tag">{f.category}</span>}
                    <span className={`adm-badge ${f.status === 'published' ? 'adm-badge-green' : 'adm-badge-amber'}`}>
                      {f.status}
                    </span>
                    <span>Order: {f.display_order}</span>
                  </div>
                </div>
                <div className="adm-faq-actions">
                  <button
                    type="button"
                    onClick={() => toggleHome(f)}
                    className={`adm-faq-home ${f.show_on_home ? 'is-on' : ''}`}
                    title={f.show_on_home ? 'Hide from homepage' : 'Show on homepage'}
                  >
                    <Icon name="home" size={14} />
                    {f.show_on_home ? 'On Home' : 'Off Home'}
                  </button>
                  <div className="adm-actions">
                    <button onClick={() => startEdit(f)} className="adm-act-btn adm-act-edit" title="Edit">
                      <Icon name="edit" size={14} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="adm-act-btn adm-act-delete" title="Delete">
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
