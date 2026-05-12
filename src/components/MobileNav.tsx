'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type MenuItem = { label: string; url: string; children?: MenuItem[] };

export default function MobileNav({
  menu,
  settings,
}: {
  menu: MenuItem[];
  settings: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button className="mob-nav-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>

      {open && <div className="mob-nav-backdrop" onClick={close} />}

      <div className={`mob-nav-drawer ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="mob-nav-head">
          <span className="mob-nav-title">Navigation</span>
          <button className="mob-nav-close" onClick={close} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <ul className="mob-nav-list">
          {menu.map((item, i) => {
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            return (
              <li key={i} className="mob-nav-item">
                {hasChildren ? (
                  <>
                    <button
                      className="mob-nav-link mob-nav-parent"
                      onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`mob-nav-chevron ${expandedIdx === i ? 'rotated' : ''}`}
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5"
                      >
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                    {expandedIdx === i && (
                      <ul className="mob-nav-sub">
                        {item.children!.map((child, j) => (
                          <li key={j}>
                            <Link href={child.url} className="mob-nav-sublink" onClick={close}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.url} className="mob-nav-link" onClick={close}>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Social icons at bottom */}
        <div className="mob-nav-social">
          <p className="mob-nav-social-label">Connect With Us</p>
          <div className="mob-nav-social-icons">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="mob-soc-btn mob-soc-ig">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3c-2.7 0-5 2.3-5 5s2.3 5 5 5 5-2.3 5-5-2.3-5-5-5zm0 8.2c-1.8 0-3.2-1.4-3.2-3.2S10.2 8.8 12 8.8s3.2 1.4 3.2 3.2-1.4 3.2-3.2 3.2zm6.4-8.4c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2z"/></svg>
              </a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="mob-soc-btn mob-soc-fb">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/></svg>
              </a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="mob-soc-btn mob-soc-yt">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.5.5c-1 .3-1.8 1-2 2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.5c1-.3 1.8-1 2-2 .5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
              </a>
            )}
            {settings.social_pinterest && (
              <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest" className="mob-soc-btn mob-soc-pn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.1 9.4 7.6 11.2-.1-.9-.2-2.4 0-3.5.2-.9 1.4-5.7 1.4-5.7s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-5-5.1-5-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2.2.9 2.8.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.4 3 7.4 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1 2.5-1.5 3.4 1.1.4 2.3.5 3.5.5 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
