'use client';

import { useState, useRef } from 'react';

const LOGO = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401455542-rajputana-heritage-logo-rithala-village.png-JQ1YTLV0RDx0tAyMYICdirpX1RGJa7.png';
const LAUNCH_DATE = '17 May 2025';

export default function ComingSoonClient() {
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadedImgUrl, setUploadedImgUrl] = useState('');
  const [pwModal, setPwModal] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [content, setContent] = useState('');

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/guest-upload', { method: 'POST', body: fd });
      if (r.ok) {
        const j = await r.json();
        setUploadedImgUrl(j.url || '');
      }
    } catch {}
    setUploadingImg(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Apna naam zaroor likhein.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const r = await fetch('/api/guest-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, topic,
          image_url: uploadedImgUrl,
          video_link: videoLink,
          content,
        }),
      });
      if (r.ok) { setStep('done'); }
      else { const j = await r.json(); setError(j.error || 'Kuch error aaya, dobara try karein.'); }
    } catch { setError('Network error. Dobara try karein.'); }
    setSubmitting(false);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwLoading(true);
    try {
      const r = await fetch('/api/site-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        window.location.href = '/';
      } else {
        setPwError('Galat password. Dobara try karein.');
      }
    } catch {
      setPwError('Network error.');
    }
    setPwLoading(false);
  }

  return (
    <div className="cs-page">
      {/* Secret admin button top-right */}
      <button className="cs-admin-btn" onClick={() => setPwModal(true)} aria-label="Site access">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a3 3 0 110 6 3 3 0 010-6zm0 14c-2.67 0-5.01-1.34-6.43-3.38C7.12 14.1 9.44 13 12 13s4.88 1.1 6.43 2.62C16.01 17.66 13.67 19 12 19z"/>
        </svg>
      </button>

      {/* Password modal */}
      {pwModal && (
        <div className="cs-modal-overlay" onClick={() => { setPwModal(false); setPwError(''); setPw(''); }}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cs-modal-close" onClick={() => { setPwModal(false); setPwError(''); setPw(''); }}>×</button>
            <div className="cs-modal-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#dc2626">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <h3>Site Access</h3>
            <p>Password dal kar website open karein</p>
            <form onSubmit={handlePasswordSubmit} className="cs-pw-form">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Password likhein..."
                autoFocus
              />
              {pwError && <span className="cs-pw-error">{pwError}</span>}
              <button type="submit" disabled={pwLoading}>
                {pwLoading ? 'Checking...' : 'Enter Website'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="cs-wrap">
        {/* Logo */}
        <div className="cs-logo-wrap">
          <img src={LOGO} alt="Rajputana Heritage — Rithala Village" className="cs-logo" />
        </div>

        {/* Launch banner */}
        <div className="cs-launch-badge">
          <span className="cs-badge-dot"></span>
          <strong>{LAUNCH_DATE}</strong> ko launch ho raha hai — Rithala Update
        </div>

        <h1 className="cs-title">Rithala Update</h1>
        <p className="cs-subtitle">
          Rithala Village ka official digital platform — Rajputana heritage, culture, events aur community ki sabse badi awaaz.
          <br />Hum bahut jald aa rahe hain!
        </p>

        {/* Social icons */}
        <div className="cs-socials">
          <a href="https://instagram.com/rithala_update" target="_blank" rel="noopener noreferrer" className="cs-social-link" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://youtube.com/@rithala_update" target="_blank" rel="noopener noreferrer" className="cs-social-link" aria-label="YouTube">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="https://facebook.com/rithalyarajput" target="_blank" rel="noopener noreferrer" className="cs-social-link" aria-label="Facebook">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://pinterest.com/rithalyarajput" target="_blank" rel="noopener noreferrer" className="cs-social-link" aria-label="Pinterest">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
          </a>
          <a href="mailto:rithalyarajput@gmail.com" className="cs-social-link" aria-label="Email">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>

        {/* Form */}
        <div className="cs-form-card">
          {step === 'done' ? (
            <div className="cs-done">
              <div className="cs-done-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#16a34a">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2>Shukriya!</h2>
              <p>Aapki details hum tak pahunch gayi hain. Launch hone par hum zaroor batayenge!</p>
            </div>
          ) : (
            <>
              <h2 className="cs-form-title">Launch se pehle register karein</h2>
              <p className="cs-form-sub">Apna naam aur contact dal kar hum se jud jayein. Baaki sab optional hai.</p>
              <form onSubmit={handleSubmit} className="cs-form">
                <div className="cs-field-row">
                  <div className="cs-field">
                    <label>Aapka naam <span className="cs-req">*</span></label>
                    <input type="text" placeholder="Pura naam likhein" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="cs-field">
                    <label>Email</label>
                    <input type="email" placeholder="aap@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="cs-field-row">
                  <div className="cs-field">
                    <label>Phone number</label>
                    <input type="tel" placeholder="10-digit number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="cs-field">
                    <label>Topic / Subject</label>
                    <input type="text" placeholder="Kya share karna chahte hain?" value={topic} onChange={(e) => setTopic(e.target.value)} />
                  </div>
                </div>

                <div className="cs-field">
                  <label>Photo upload karein</label>
                  <div className="cs-upload-box" onClick={() => fileRef.current?.click()}>
                    {uploadedImgUrl ? (
                      <img src={uploadedImgUrl} alt="Uploaded" className="cs-upload-preview" />
                    ) : uploadingImg ? (
                      <span className="cs-upload-hint">Uploading...</span>
                    ) : (
                      <>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="#94a3b8">
                          <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                        </svg>
                        <span className="cs-upload-hint">Photo click karein ya drag karein</span>
                      </>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>

                <div className="cs-field">
                  <label>Video / Reel link</label>
                  <input type="url" placeholder="Instagram, YouTube ya kisi bhi video ka link" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
                </div>

                <div className="cs-field">
                  <label>Kuch kehna chahte hain?</label>
                  <textarea placeholder="Koi bhi baat likh sakte hain — suggestion, story, feedback..." value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
                </div>

                {error && <div className="cs-error">{error}</div>}
                <button type="submit" className="cs-submit-btn" disabled={submitting}>
                  {submitting ? 'Bhej rahe hain...' : 'Submit karein'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
