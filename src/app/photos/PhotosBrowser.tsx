'use client';

import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/Icon';

type P = {
  id: number;
  image_url: string;
  alt_text: string | null;
  title: string | null;
  caption: string | null;
};

export default function PhotosBrowser({ photos }: { photos: P[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);
  const prev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    }
    if (openIndex !== null) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, next, prev]);

  if (photos.length === 0) {
    return (
      <div className="ph2-empty">
        <Icon name="photo" size={48} />
        <h3>No photos yet</h3>
        <p>This album is empty.</p>
      </div>
    );
  }

  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="ph2-photo-grid">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="ph2-photo-item"
            onClick={() => setOpenIndex(i)}
            aria-label={p.alt_text || p.title || `Photo ${i + 1}`}
          >
            <img src={p.image_url} alt={p.alt_text || p.title || ''} loading="lazy" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="ph2-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <button className="ph2-lb-close" onClick={close} aria-label="Close">
            <Icon name="close" size={22} />
          </button>
          <button className="ph2-lb-nav ph2-lb-prev" onClick={prev} aria-label="Previous">
            <Icon name="chevron-left" size={28} />
          </button>
          <div className="ph2-lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={active.image_url} alt={active.alt_text || active.title || ''} />
            {(active.title || active.caption) && (
              <div className="ph2-lb-caption">
                {active.title && <strong>{active.title}</strong>}
                {active.caption && <span>{active.caption}</span>}
                <small>{(openIndex! + 1)} / {photos.length}</small>
              </div>
            )}
          </div>
          <button className="ph2-lb-nav ph2-lb-next" onClick={next} aria-label="Next">
            <Icon name="chevron-right" size={28} />
          </button>
        </div>
      )}
    </>
  );
}
