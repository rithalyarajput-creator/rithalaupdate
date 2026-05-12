'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';

const TYPEWRITER_HINTS = [
  'Rithala kya hai...',
  'History of Rithala...',
  'Rithala brotherhood...',
  'Kawad Yatra 2025...',
  'Rajput heritage...',
  'रिठाला गाँव...',
  'Rithala temple...',
  'Rithala village Delhi...',
];

export default function HeaderSearch() {
  const router = useRouter();
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string; slug: string; excerpt?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  // Typewriter state
  const [placeholder, setPlaceholder] = useState('');
  const [hintIdx, setHintIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
  useEffect(() => {
    const hint = TYPEWRITER_HINTS[hintIdx % TYPEWRITER_HINTS.length];
    const speed = deleting ? 40 : 80;
    const pause = deleting && charIdx === 0 ? 600 : !deleting && charIdx === hint.length ? 1400 : speed;

    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < hint.length) {
          setPlaceholder(hint.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setPlaceholder(hint.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setHintIdx(i => i + 1);
        }
      }
    }, pause);
    return () => clearTimeout(t);
  }, [charIdx, deleting, hintIdx]);

  // Fetch search suggestions from blog API
  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setShowDrop(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?search=${encodeURIComponent(q)}&limit=5&status=published`);
      if (res.ok) {
        const data = await res.json();
        const posts = Array.isArray(data) ? data : (data.posts ?? []);
        setResults(posts.slice(0, 5).map((p: any) => ({ title: p.title, slug: p.slug, excerpt: p.excerpt })));
        setShowDrop(posts.length > 0);
      }
    } catch {}
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(val), 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/blog/?search=${encodeURIComponent(q)}`);
    setQuery(''); setResults([]); setShowDrop(false);
  };

  const handleResultClick = (slug: string) => {
    router.push(`/blog/${slug}/`);
    setQuery(''); setResults([]); setShowDrop(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="hs-wrap" ref={dropRef}>
      <form onSubmit={handleSubmit} className="hs-form" role="search">
        <div className="hs-inner">
          <svg className="hs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setShowDrop(true)}
            placeholder={placeholder}
            className="hs-input"
            aria-label={lang === 'hi' ? 'खोजें' : 'Search'}
            autoComplete="off"
          />
          {loading && <span className="hs-loader" aria-hidden="true" />}
          {query && (
            <button type="submit" className="hs-go" aria-label="Search">
              {lang === 'hi' ? 'खोजें' : 'Go'}
            </button>
          )}
        </div>
      </form>

      {showDrop && results.length > 0 && (
        <div className="hs-dropdown" role="listbox" aria-label="Search suggestions">
          {results.map((r) => (
            <button
              key={r.slug}
              type="button"
              className="hs-result"
              onClick={() => handleResultClick(r.slug)}
              role="option"
            >
              <svg className="hs-result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <div className="hs-result-text">
                <span className="hs-result-title">{r.title}</span>
                {r.excerpt && <span className="hs-result-excerpt">{r.excerpt.slice(0, 70)}...</span>}
              </div>
            </button>
          ))}
          <div className="hs-view-all">
            <button type="button" onClick={handleSubmit as any} className="hs-view-all-btn">
              {lang === 'hi' ? `"${query}" के सभी नतीजे देखें →` : `See all results for "${query}" →`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
