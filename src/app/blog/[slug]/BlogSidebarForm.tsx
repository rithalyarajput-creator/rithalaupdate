'use client';

import { useState } from 'react';

export default function BlogSidebarForm({ postTitle }: { postTitle: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrMsg(null);
    setOkMsg(null);

    const fd = new FormData(e.currentTarget);
    fd.append('subject', `[Blog: ${postTitle}]`);
    fd.append('source', 'blog_form');
    const res = await fetch('/api/leads', { method: 'POST', body: fd });
    const j = await res.json().catch(() => ({}));

    if (res.ok) {
      setOkMsg(j.message || ' Thank you! Message received.');
      (e.target as HTMLFormElement).reset();
    } else {
      setErrMsg(j.error || 'Failed to send. Please try again.');
    }
    setSubmitting(false);
  }

  return (
    <div className="bd-sidebar-card">
      <div className="bd-sidebar-head">
        <span className="bd-sidebar-eyebrow"> Got something to say?</span>
        <h3>Ask us anything</h3>
        <p>Photos, stories, or questions — हमें सीधे यहाँ भेजें।</p>
      </div>

      <form onSubmit={handleSubmit}>
        {okMsg && <div className="form-success">{okMsg}</div>}
        {errMsg && <div className="form-error">{errMsg}</div>}

        <div className="form-row">
          <label>Your Name *</label>
          <input name="name" type="text" required placeholder="आपका नाम" />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input name="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label>Phone</label>
          <input name="phone" type="tel" placeholder="+91-9876543210" />
        </div>
        <div className="form-row">
          <label>Message *</label>
          <textarea name="message" rows={4} required placeholder="कुछ भी पूछें..." style={{ minHeight: 90, fontFamily: 'inherit' }}></textarea>
        </div>
        <button type="submit" className="btn" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Sending…' : 'Send Message →'}
        </button>
      </form>

      <div className="bd-sidebar-foot">
        <small>
           Private · We reply within 24-48 hours
        </small>
      </div>
    </div>
  );
}
