'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';

export default function HeaderClient() {
  const { lang, toggle } = useLang();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/blog/?search=${encodeURIComponent(q)}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="header-controls">
      {/* Search */}
      <div className={`header-search-wrap ${open ? 'is-open' : ''}`}>
        {open && (
          <form onSubmit={handleSearch} className="header-search-form">
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'खोजें...' : 'Search...'}
              className="header-search-input"
              aria-label="Search"
            />
            <button type="submit" className="header-search-btn" aria-label="Submit search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </form>
        )}
        <button
          type="button"
          className="header-icon-btn"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close search' : 'Open search'}
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          )}
        </button>
      </div>

      {/* Language Toggle */}
      <button
        type="button"
        onClick={toggle}
        className="lang-toggle-btn"
        aria-label="Toggle language"
        title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
      >
        <span className={`lang-opt ${lang === 'hi' ? 'lang-active' : ''}`}>हिं</span>
        <span className="lang-divider">|</span>
        <span className={`lang-opt ${lang === 'en' ? 'lang-active' : ''}`}>EN</span>
      </button>
    </div>
  );
}
