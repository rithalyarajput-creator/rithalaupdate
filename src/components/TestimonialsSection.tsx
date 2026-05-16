'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

type Testimonial = {
  id: number;
  name: string;
  avatar_url: string | null;
  message: string;
  rating: number;
  location: string | null;
};

type Account = { name: string; phone: string; avatar_url: string; session: string };

const ACCOUNT_KEY = 'rithala_testimonial_account_v1';

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [modal, setModal] = useState<'closed' | 'account' | 'submit' | 'thanks'>('closed');
  const [activeIdx, setActiveIdx] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/testimonials').then((r) => r.json()).then((j) => setItems(j.testimonials || [])).catch(() => {});
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      if (raw) setAccount(JSON.parse(raw));
    } catch {}
  }, []);

  function scrollToIdx(idx: number) {
    const el = railRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setActiveIdx(idx);
  }

  function handleRailScroll() {
    const el = railRef.current;
    if (!el || items.length === 0) return;
    // Find which card is most visible
    let bestIdx = 0;
    let bestOverlap = -1;
    const railLeft = el.scrollLeft;
    const railRight = railLeft + el.clientWidth;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const cLeft = c.offsetLeft;
      const cRight = cLeft + c.offsetWidth;
      const overlap = Math.min(cRight, railRight) - Math.max(cLeft, railLeft);
      if (overlap > bestOverlap) { bestOverlap = overlap; bestIdx = i; }
    });
    setActiveIdx(bestIdx);
  }

  function openShare() {
    if (account) setModal('submit');
    else setModal('account');
  }

  async function createAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const file = fd.get('avatar') as File | null;
    if (!name || !phone) return;

    let avatar_url = '';
    if (file && file.size > 0) {
      const up = new FormData();
      up.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: up });
      if (r.ok) {
        const j = await r.json();
        avatar_url = j.url || '';
      }
    }
    const session = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const acct: Account = { name, phone, avatar_url, session };
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(acct));
    setAccount(acct);
    setModal('submit');
  }

  async function submitTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!account) return;
    const fd = new FormData(e.currentTarget);
    const body = {
      name: account.name,
      phone: account.phone,
      avatar_url: account.avatar_url,
      message: String(fd.get('message') || ''),
      rating: Number(fd.get('rating') || 5),
      location: String(fd.get('location') || ''),
      submitter_session: account.session,
    };
    const res = await fetch('/api/testimonials', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) setModal('thanks');
  }

  function logout() {
    localStorage.removeItem(ACCOUNT_KEY);
    setAccount(null);
    setModal('account');
  }

  return (
    <section className="home-test-section">
      <div className="container">
        <div className="home-test-head">
          <h2>What People Say</h2>
          <p>Stories from our Rithala community</p>
          <button className="home-test-share-btn" onClick={openShare}>
            <Icon name="plus" size={14} /> Share your testimonial
          </button>
        </div>

        {items.length === 0 ? (
          <div className="home-test-empty">
            <Icon name="star" size={36} />
            <p>Be the first to share your testimonial.</p>
          </div>
        ) : (
          <>
            <div className="home-test-rail" ref={railRef} onScroll={handleRailScroll}>
              {items.map((t) => (
                <article key={t.id} className="home-test-card">
                  <div className="home-test-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < t.rating ? '#f59e0b' : 'none'} stroke={i < t.rating ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    ))}
                  </div>
                  <p className="home-test-msg">"{t.message}"</p>
                  <div className="home-test-author">
                    <div className="home-test-avatar">
                      {t.avatar_url ? <img src={t.avatar_url} alt={t.name} /> : <Icon name="user" size={20} />}
                    </div>
                    <div>
                      <strong>{t.name}</strong>
                      {t.location && <small>{t.location}</small>}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Dot navigation */}
            <div className="home-test-dots">
              <button className="home-test-dot-arrow" onClick={() => scrollToIdx(Math.max(0, activeIdx - 1))} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`home-test-dot${i === activeIdx ? ' active' : ''}`}
                  onClick={() => scrollToIdx(i)}
                  aria-label={`Go to ${i + 1}`}
                />
              ))}
              <button className="home-test-dot-arrow" onClick={() => scrollToIdx(Math.min(items.length - 1, activeIdx + 1))} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </>
        )}
      </div>

      {modal !== 'closed' && (
        <div className="home-test-modal" onClick={() => setModal('closed')}>
          <div className="home-test-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="home-test-modal-close" onClick={() => setModal('closed')} aria-label="Close">
              <Icon name="close" size={16} />
            </button>

            {modal === 'account' && (
              <>
                <h3>Create your account</h3>
                <p className="home-test-sub">Add your name, phone and a photo. This is used to display your testimonial after admin approval.</p>
                <form onSubmit={createAccount} className="home-test-form">
                  <label>Your Name *<input name="name" type="text" required placeholder="Full name" /></label>
                  <label>Phone Number *<input name="phone" type="tel" required placeholder="10-digit phone" /></label>
                  <label>Profile Photo<input name="avatar" type="file" accept="image/*" /></label>
                  <button type="submit" className="home-test-submit"><Icon name="check" size={14} /> Create & Continue</button>
                </form>
              </>
            )}

            {modal === 'submit' && account && (
              <>
                <div className="home-test-acct">
                  <div className="home-test-avatar lg">
                    {account.avatar_url ? <img src={account.avatar_url} alt={account.name} /> : <Icon name="user" size={20} />}
                  </div>
                  <div>
                    <strong>{account.name}</strong>
                    <small>{account.phone}</small>
                  </div>
                  <button className="home-test-acct-logout" onClick={logout}>Switch</button>
                </div>
                <h3>Share your testimonial</h3>
                <form onSubmit={submitTestimonial} className="home-test-form">
                  <label>Your message *<textarea name="message" required rows={4} placeholder="Share your experience with Rithala Update..." /></label>
                  <label>Location<input name="location" type="text" placeholder="e.g. Rithala, Delhi" /></label>
                  <label>Rating
                    <select name="rating" defaultValue="5">
                      <option value="5"> Excellent</option>
                      <option value="4"> Very Good</option>
                      <option value="3"> Good</option>
                      <option value="2"> Fair</option>
                      <option value="1"> Poor</option>
                    </select>
                  </label>
                  <button type="submit" className="home-test-submit"><Icon name="send" size={14} /> Submit for review</button>
                </form>
              </>
            )}

            {modal === 'thanks' && (
              <div className="home-test-thanks">
                <Icon name="check" size={48} />
                <h3>Thank you!</h3>
                <p>Your testimonial is pending admin approval. It will appear on the homepage once approved.</p>
                <button className="home-test-submit" onClick={() => setModal('closed')}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
