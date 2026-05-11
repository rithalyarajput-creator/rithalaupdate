'use client';

import { useRef, useEffect } from 'react';

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

function youtubeId(url: string): string | null {
  const m =
    url.match(/youtu\.be\/([\w-]+)/) ||
    url.match(/[?&]v=([\w-]+)/) ||
    url.match(/youtube\.com\/shorts\/([\w-]+)/) ||
    url.match(/youtube\.com\/embed\/([\w-]+)/);
  return m ? m[1] : null;
}

function instagramCode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/);
  return m ? m[1] : null;
}

// Build a silent autoplay embed URL (preview only — for full experience user clicks)
function previewSrc(url: string): string | null {
  const kind = detectKind(url);
  if (kind === 'youtube') {
    const id = youtubeId(url);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3`;
  }
  if (kind === 'instagram') {
    const code = instagramCode(url);
    if (!code) return null;
    return `https://www.instagram.com/${url.includes('/p/') ? 'p' : 'reel'}/${code}/embed/?autoplay=1&muted=1`;
  }
  return null;
}

export default function ReelsStrip({ reels }: { reels: Reel[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Slow continuous scroll for marquee feel; pause on hover via CSS
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId: number;
    let lastTime = performance.now();
    const speed = 0.25; // px per ms

    const step = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      if (!track.matches(':hover')) {
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
          track.scrollLeft = 0;
        } else {
          track.scrollLeft += speed * dt;
        }
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  function scrollBy(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  return (
    <section className="reels-strip-section">
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
            const embedSrc = previewSrc(r.instagram_url);

            return (
              <a
                key={r.id}
                href={r.instagram_url}
                target="_blank"
                rel="noopener"
                className="reel-card-strip"
                aria-label={`Open ${r.title} on ${kind}`}
              >
                <div className="reel-card-inner">
                  {embedSrc ? (
                    <>
                      <iframe
                        src={embedSrc}
                        title={r.title}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="lazy"
                        tabIndex={-1}
                      />
                      <span className="reel-tap-overlay" aria-hidden="true"></span>
                    </>
                  ) : (
                    <div className="reel-thumb-fallback">
                      <span className="reel-kind-badge">{kind === 'youtube' ? '▶ YouTube' : '📷 Instagram'}</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.95 }}>{r.title}</span>
                    </div>
                  )}
                  <span className="reel-source-tag">
                    {kind === 'youtube' ? '▶ YT' : kind === 'instagram' ? '📷 IG' : '🔗'}
                  </span>
                </div>
                <div className="reel-card-meta">
                  <h3>{r.title}</h3>
                </div>
              </a>
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
