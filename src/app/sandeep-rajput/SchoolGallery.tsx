'use client';
import { useState } from 'react';

const PHOTOS = [
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780126495893-sandeep-rajput-rithalya-rajput-rana-pratap-sarvodaya-school-rithala-delhi.jpg-aOf2OUhgtMt1zncuB5nE4EAvhOsiRU.jpg',
    alt: 'Sandeep Rajput Rithalya Rajput with friends at Rana Pratap Sarvodaya School Rithala Delhi — Birthday Celebration',
    caption: 'Birthday celebration with classmates at Rana Pratap School, Rithala',
  },
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780128070439-Sandeep_Rajput_at_Rana_Pratap_Sarvodaya_School_Rithala_Delhi-HiluKN1YF4KDt9BXsd0w7AQkxNocxX.webp',
    alt: 'Sandeep Rajput Rithalya Rajput at Rana Pratap Sarvodaya Bal Vidyalaya School Rithala Delhi with school friends',
    caption: 'With friends at Rana Pratap School, Rithala, Delhi',
  },
];

export default function SchoolGallery() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <>
      <button className="sr-school-gallery-btn" onClick={() => { setActive(0); setOpen(true); }}>
        📸 School Memories &amp; Photos
      </button>

      {open && (
        <div className="sr-sg-overlay" onClick={() => setOpen(false)}>
          <div className="sr-sg-modal" onClick={e => e.stopPropagation()}>
            <button className="sr-sg-close" onClick={() => setOpen(false)}>✕</button>

            {/* Main image */}
            <div className="sr-sg-main-wrap">
              <img
                src={PHOTOS[active].src}
                alt={PHOTOS[active].alt}
                className="sr-sg-main-img"
              />
              <p className="sr-sg-caption">{PHOTOS[active].caption}</p>
            </div>

            {/* Thumbnails */}
            <div className="sr-sg-thumbs">
              {PHOTOS.map((p, i) => (
                <button
                  key={i}
                  className={`sr-sg-thumb${active === i ? ' sr-sg-thumb--active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <img src={p.src} alt={p.alt} />
                </button>
              ))}
            </div>

            <div className="sr-sg-count">{active + 1} / {PHOTOS.length}</div>
          </div>
        </div>
      )}
    </>
  );
}
