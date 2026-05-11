'use client';

import { useState, useRef, useEffect } from 'react';

type Reel = {
  id: number;
  title: string;
  instagram_url: string;
  thumbnail_url: string | null;
  description: string | null;
};

function detectKind(url: string): 'youtube' | 'instagram' | 'other' {
  if (/youtu\.?be/.test(url)) return 'youtube';
  if (/instagram\.com/.test(url)) return 'instagram';
  return 'other';
}

function youtubeEmbed(url: string): string | null {
  // Supports youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/shorts/<id>
  const m =
    url.match(/youtu\.be\/([\w-]+)/) ||
    url.match(/[?&]v=([\w-]+)/) ||
    url.match(/youtube\.com\/shorts\/([\w-]+)/) ||
    url.match(/youtube\.com\/embed\/([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}&controls=1&modestbranding=1&playsinline=1` : null;
}

function instagramEmbed(url: string): string | null {
  // Instagram /reel/<code>/ or /p/<code>/
  const m = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/);
  return m ? `https://www.instagram.com/${url.includes('/p/') ? 'p' : 'reel'}/${m[1]}/embed/` : null;
}

export default function ReelsStrip({ reels }: { reels: Reel[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll the strip horizontally when nothing is playing
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !autoScroll || activeId !== null) return;
    let rafId: number;
    let lastTime = performance.now();
    const speed = 0.4; // px per ms

    const step = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
        track.scrollLeft = 0;
      } else {
        track.scrollLeft += speed * dt;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [autoScroll, activeId]);

  function scrollBy(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  return (
    <section
      className="reels-strip-section"
      onMouseEnter={() => setAutoScroll(false)}
      onMouseLeave={() => setAutoScroll(true)}
    >
      <div className="container">
        <div className="reels-strip-head">
          <div>
            <span className="reels-eyebrow">🎬 ON THE GRAM</span>
            <h2 className="reels-h2">Latest Reels & Shorts</h2>
            <p className="reels-sub">
              Instagram reels और YouTube shorts — हमारे गाँव की झलक
            </p>
          </div>
          <div className="reels-nav">
            <button onClick={() => scrollBy(-1)} aria-label="Scroll left">‹</button>
            <button onClick={() => scrollBy(1)} aria-label="Scroll right">›</button>
          </div>
        </div>

        <div className="reels-strip" ref={trackRef}>
          {reels.map((r) => {
            const kind = detectKind(r.instagram_url);
            const ytSrc = kind === 'youtube' ? youtubeEmbed(r.instagram_url) : null;
            const igSrc = kind === 'instagram' ? instagramEmbed(r.instagram_url) : null;
            const embedSrc = ytSrc || igSrc;
            const isActive = activeId === r.id;

            return (
              <div key={r.id} className={`reel-card-strip ${isActive ? 'is-active' : ''}`}>
                <div className="reel-card-inner">
                  {isActive && embedSrc ? (
                    <iframe
                      src={embedSrc}
                      title={r.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <button
                      className="reel-thumb-btn"
                      onClick={() => {
                        if (embedSrc) {
                          setActiveId(r.id);
                          setAutoScroll(false);
                        } else {
                          window.open(r.instagram_url, '_blank', 'noopener');
                        }
                      }}
                      aria-label={`Play ${r.title}`}
                    >
                      {r.thumbnail_url ? (
                        <img src={r.thumbnail_url} alt={r.title} loading="lazy" />
                      ) : (
                        <div className="reel-thumb-fallback">
                          <span className="reel-kind-badge">{kind === 'youtube' ? '▶ YouTube' : '📷 Instagram'}</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{r.title}</span>
                        </div>
                      )}
                      <div className="reel-play-circle" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                      <span className="reel-source-tag">
                        {kind === 'youtube' ? '▶ YT' : kind === 'instagram' ? '📷 IG' : '🔗'}
                      </span>
                    </button>
                  )}
                </div>
                <div className="reel-card-meta">
                  <h3>{r.title}</h3>
                  {isActive && (
                    <button
                      className="reel-close-btn"
                      onClick={() => setActiveId(null)}
                      aria-label="Close player"
                    >
                      ✕ Close
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="reels-strip-foot">
          <a href="/reels/" className="reels-view-all">View All Reels →</a>
        </div>
      </div>
    </section>
  );
}
