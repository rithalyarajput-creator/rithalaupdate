'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrMsg(null);
    setOkMsg(null);

    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/leads', { method: 'POST', body: fd });
    const j = await res.json().catch(() => ({}));

    if (res.ok) {
      setOkMsg(j.message || '✓ Thank you! Message received.');
      (e.target as HTMLFormElement).reset();
    } else {
      setErrMsg(j.error || 'Failed to send. Please try again.');
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      {okMsg && <div className="form-success">{okMsg}</div>}
      {errMsg && <div className="form-error">{errMsg}</div>}

      <div className="form-row">
        <label htmlFor="name">Your Name *</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
      </div>
      <div className="form-row">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" />
      </div>
      <div className="form-row">
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" type="text" />
      </div>
      <div className="form-row">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          style={{ minHeight: 100, fontFamily: 'inherit' }}
        />
      </div>
      <button type="submit" className="btn" disabled={submitting} style={{ width: '100%' }}>
        {submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
