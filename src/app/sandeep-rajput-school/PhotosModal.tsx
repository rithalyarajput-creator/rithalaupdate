'use client';
import { useState } from 'react';

type Photo = { src: string; alt: string; caption: string };

export default function PhotosModal({ photos, color }: { photos: Photo[]; color: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <>
      <button
        className="sch-photos-btn"
        style={{ background: color }}
        onClick={() => { setActive(0); setOpen(true); }}
      >
        View School Photos
      </button>

      {open && (
        <div className="sch-modal-overlay" onClick={() => setOpen(false)}>
          <div className="sch-modal" onClick={e => e.stopPropagation()}>
            <button className="sch-modal-close" onClick={() => setOpen(false)}>✕</button>
            <img src={photos[active].src} alt={photos[active].alt} className="sch-modal-img" />
            <p className="sch-modal-caption">{photos[active].caption}</p>
            <div className="sch-modal-thumbs">
              {photos.map((p, i) => (
                <button
                  key={i}
                  className={`sch-modal-thumb${active === i ? ' sch-modal-thumb--active' : ''}`}
                  onClick={() => setActive(i)}
                  style={active === i ? { borderColor: color } : {}}
                >
                  <img src={p.src} alt={p.alt} />
                </button>
              ))}
            </div>
            <div className="sch-modal-count">{active + 1} / {photos.length}</div>
          </div>
        </div>
      )}
    </>
  );
}
