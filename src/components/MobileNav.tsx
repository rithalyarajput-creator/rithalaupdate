'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type MenuItem = { label: string; url: string; children?: MenuItem[] };

export default function MobileNav({ menu }: { menu: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <button
        className="mob-nav-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        )}
      </button>

      {/* Overlay */}
      {open && <div className="mob-nav-backdrop" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <div className={`mob-nav-drawer ${open ? 'open' : ''}`}>
        <div className="mob-nav-head">
          <span className="mob-nav-title">Menu</span>
          <button className="mob-nav-close" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

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
                      {item.label}
                      <svg className={`mob-nav-chevron ${expandedIdx === i ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    {expandedIdx === i && (
                      <ul className="mob-nav-sub">
                        {item.children!.map((child, j) => (
                          <li key={j}>
                            <Link href={child.url} className="mob-nav-sublink" onClick={() => setOpen(false)}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.url} className="mob-nav-link" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
