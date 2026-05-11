'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Icon from '@/components/Icon';

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
    <div className="bf2-bar">
      <div className="bf2-label">
        <Icon name="settings" size={16} />
        <span>Filters</span>
      </div>

      <select
        className="bf2-select"
        value={current.category}
        onChange={(e) => apply({ category: e.target.value })}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select
        className="bf2-select"
        value={current.author}
        onChange={(e) => apply({ author: e.target.value })}
        aria-label="Filter by author"
      >
        <option value="">All Authors</option>
        {authors.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <select
        className="bf2-select"
        value={current.year}
        onChange={(e) => apply({ year: e.target.value })}
        aria-label="Filter by year"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <form className="bf2-search" onSubmit={onSearch}>
        <Icon name="search" size={14} />
        <input
          type="text"
          placeholder="Search posts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>

      {hasActive && (
        <button
          type="button"
          className="bf2-clear"
          onClick={() => {
            setQ('');
            router.push('/blog/');
          }}
        >
          <Icon name="close" size={13} />
          Clear
        </button>
      )}
    </div>
  );
}
