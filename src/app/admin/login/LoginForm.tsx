'use client';

import { useState } from 'react';

export default function LoginForm({ next, error }: { next?: string; error?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(error || null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrMsg(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: fd,
    });
    if (res.ok) {
      window.location.href = next || '/admin/dashboard';
    } else {
      const j = await res.json().catch(() => ({}));
      setErrMsg(j.error || 'Login failed');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errMsg && <div className="form-error">{errMsg}</div>}
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoFocus />
      </div>
      <div className="form-row">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      <button type="submit" className="btn" style={{ width: '100%' }} disabled={submitting}>
        {submitting ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}
