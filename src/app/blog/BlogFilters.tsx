'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  categories: { slug: string; name: string }[];
  authors: string[];
  years: number[];
  current: { category: string; author: string; year: string; q: string };
};

export default function BlogFilters({ categories, authors, years, current }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(current.q);

  function apply(updates: Partial<typeof current>) {
    const next = { ...current, ...updates };
    const params = new URLSearchParams();
    if (next.category) params.set('category', next.category);
    if (next.author) params.set('author', next.author);
    if (next.year) params.set('year', next.year);
    if (next.q) params.set('q', next.q);
    const qs = params.toString();
    router.push(qs ? `/blog/?${qs}` : '/blog/');
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    apply({ q });
  }

  const hasActive = current.category || current.author || current.year || current.q;

  return (
    <div className="bf-bar">
      <form className="bf-search" onSubmit={onSearch}>
        <span className="bf-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search posts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="bf-selects">
        <select
          value={current.category}
          onChange={(e) => apply({ category: e.target.value })}
          aria-label="Filter by category"
        >
          <option value="">📂 All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value={current.author}
          onChange={(e) => apply({ author: e.target.value })}
          aria-label="Filter by author"
        >
          <option value="">✍️ All Authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select
          value={current.year}
          onChange={(e) => apply({ year: e.target.value })}
          aria-label="Filter by year"
        >
          <option value="">📅 All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {hasActive && (
          <button
            type="button"
            className="bf-clear"
            onClick={() => {
              setQ('');
              router.push('/blog/');
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
