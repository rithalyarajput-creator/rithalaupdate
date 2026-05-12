'use client';

import { useState } from 'react';

export default function SetupForm({ token }: { token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrMsg(null);
    setOkMsg(null);

    const fd = new FormData(e.currentTarget);
    fd.append('token', token);

    const res = await fetch('/api/admin-setup', {
      method: 'POST',
      body: fd,
    });
    const j = await res.json().catch(() => ({}));

    if (res.ok) {
      setOkMsg(' Admin user created/updated. Redirecting to login');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1500);
    } else {
      setErrMsg(j.error || 'Setup failed');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errMsg && <div className="form-error">{errMsg}</div>}
      {okMsg && <div className="form-success">{okMsg}</div>}

      <div className="form-row">
        <label htmlFor="email">Admin Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          defaultValue="rithalyarajput@gmail.com"
        />
      </div>

      <div className="form-row">
        <label htmlFor="password">Admin Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Choose a strong password"
        />
        <p className="help">At least 6 characters. You can change it later.</p>
      </div>

      <div className="form-row">
        <label htmlFor="display_name">Display Name (optional)</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue="Rithalya Rajput"
        />
      </div>

      <button
        type="submit"
        className="btn"
        style={{ width: '100%' }}
        disabled={submitting}
      >
        {submitting ? 'Creating' : 'Create / Reset Admin'}
      </button>
    </form>
  );
}
