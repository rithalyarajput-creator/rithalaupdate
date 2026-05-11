'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setMsg('');
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus('success');
      setMsg(j.message || '✓ Subscribed!');
      setEmail('');
      setTimeout(() => { setStatus('idle'); setMsg(''); }, 4000);
    } else {
      setStatus('error');
      setMsg(j.error || 'Failed');
      setTimeout(() => { setStatus('idle'); setMsg(''); }, 4000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ftr-newsletter-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        aria-label="Email address"
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? '...' : 'Join →'}
      </button>
      {msg && (
        <p style={{
          gridColumn: '1 / -1',
          margin: '8px 0 0',
          fontSize: '0.78rem',
          color: status === 'success' ? '#4ade80' : '#f87171',
          fontWeight: 600,
        }}>{msg}</p>
      )}
    </form>
  );
}
