'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

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
      setOkMsg(j.message || ' Thank you! Message received. We will reply soon.');
      (e.target as HTMLFormElement).reset();
    } else {
      setErrMsg(j.error || 'Failed to send. Please try again.');
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="ctf-form">
      {okMsg && <div className="ctf-alert ctf-alert-ok">{okMsg}</div>}
      {errMsg && <div className="ctf-alert ctf-alert-err">{errMsg}</div>}

      <div className="ctf-field">
        <label htmlFor="ct-name">Your Name <span className="ctf-req">*</span></label>
        <div className="ctf-input-wrap">
          <span className="ctf-input-ic"><Icon name="user" size={15} /></span>
          <input id="ct-name" name="name" type="text" placeholder="Enter your full name" required />
        </div>
      </div>

      <div className="ctf-field">
        <label htmlFor="ct-phone">Phone Number</label>
        <div className="ctf-input-wrap">
          <span className="ctf-input-ic"><Icon name="phone" size={15} /></span>
          <input id="ct-phone" name="phone" type="tel" placeholder="Enter your phone number" />
        </div>
      </div>

      <div className="ctf-field">
        <label htmlFor="ct-email">Email Address</label>
        <div className="ctf-input-wrap">
          <span className="ctf-input-ic"><Icon name="mail" size={15} /></span>
          <input id="ct-email" name="email" type="email" placeholder="Enter your email address" />
        </div>
      </div>

      <div className="ctf-field">
        <label htmlFor="ct-subject">Subject</label>
        <div className="ctf-input-wrap">
          <span className="ctf-input-ic"><Icon name="tag" size={15} /></span>
          <input id="ct-subject" name="subject" type="text" placeholder="Enter the subject" />
        </div>
      </div>

      <div className="ctf-field">
        <label htmlFor="ct-message">Message <span className="ctf-req">*</span></label>
        <textarea
          id="ct-message"
          name="message"
          rows={5}
          required
          placeholder="Type your message here..."
        />
      </div>

      <button type="submit" className="ctf-submit" disabled={submitting}>
        {submitting ? 'Sending' : (
          <>
            <Icon name="send" size={15} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
