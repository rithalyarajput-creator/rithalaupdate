'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

type Slide = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  href?: string;
};

const SLIDES: Slide[] = [
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401739643-rithala-village-990-bus-stand-banner.jpg-2-XLI4otRnMtLUBhErG2AC1lqz3yPUJ4.png',
    alt: 'Rithala Village 990 bus stand banner — historical landmark of Rithala',
    title: 'रिठाला 990 बस स्टैंड',
    subtitle: 'गाँव का ऐतिहासिक landmark',
  },
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401736707-rithala-gaon-krishi-parivartan-1981-2011.jpg-CRr6fnnM9nyWXqF4TN0M14qbBDzhbF.png',
    alt: 'Rithala gaon krishi parivartan 1981 to 2011 — agricultural transformation',
    title: 'कृषि परिवर्तन (1981 - 2011)',
    subtitle: 'रिठाला गाँव की खेती की कहानी',
  },
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401734203-shri-jageshwar-nath-katyayani-dham-rithala-village-history-2002-2013-2025-banner.jpg-p4FKSwgKMCY4IYPWvjYa2G2JHTCHqG.png',
    alt: 'Shri Jageshwar Nath Katyayani Dham Rithala Village — temple history 2002 2013 2025',
    title: 'श्री जागेश्वर नाथ कात्यायनी धाम',
    subtitle: 'मंदिर का इतिहास (2002 · 2013 · 2025)',
  },
];

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  }

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="hero-slider-inner">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`hs-slide ${i === index ? 'active' : ''}`}
            aria-hidden={i !== index}
          >
            <img src={s.src} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="hs-overlay">
              <div className="hs-caption">
                <span className="hs-eyebrow">📜 Rithala Heritage</span>
                <h2 className="hs-title">{s.title}</h2>
                <p className="hs-subtitle">{s.subtitle}</p>
              </div>
            </div>
          </div>
        ))}

        <button
          className="hs-arrow hs-arrow-prev"
          onClick={prev}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          className="hs-arrow hs-arrow-next"
          onClick={next}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="hs-dots" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hs-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>

        <div className="hs-progress">
          <div
            key={index}
            className={`hs-progress-bar ${paused ? 'paused' : ''}`}
            style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
          />
        </div>
      </div>
    </section>
  );
}
