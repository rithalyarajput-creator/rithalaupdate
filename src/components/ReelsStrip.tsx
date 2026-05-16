'use client';

import { useRef } from 'react';

type Reel = {
  id: number;
  title: string;
  instagram_url: string | null;
  video_url?: string | null;
  youtube_url?: string | null;
  click_url?: string | null;
  thumbnail_url: string | null;
  description: string | null;
};

function youtubeId(url: string): string | null {
  const m =
    url.match(/youtu\.be\/([\w-]+)/) ||
    url.match(/[?&]v=([\w-]+)/) ||
    url.match(/youtube\.com\/shorts\/([\w-]+)/) ||
    url.match(/youtube\.com\/embed\/([\w-]+)/);
  return m ? m[1] : null;
}

function youtubeEmbed(url: string): string | null {
  const id = youtubeId(url);
  if (!id) return null;
  // Clean autoplay loop, no controls
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3`;
}

function igEmbed(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/);
  if (!m) return null;
  return `https://www.instagram.com/${url.includes('/p/') ? 'p' : 'reel'}/${m[1]}/embed/`;
}

export default function ReelsStrip({ reels }: { reels: Reel[] }) {
  const trackRef = useRef<HTMLDivElement>(null);


  function scrollBy(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 640, behavior: 'smooth' });
  }

  return (
    <section className="reels-strip-section">
      <div className="container">
        <div className="reels-strip-head">
          <div>
            <span className="reels-eyebrow">ON THE GRAM</span>
            <h2 className="reels-h2">Latest Reels & Shorts</h2>
            <p className="reels-sub">हमारे गाँव की झलकियाँ  videos and shorts</p>
          </div>
          <div className="reels-nav">
            <button onClick={() => scrollBy(-1)} aria-label="Scroll left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Scroll right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="reels-strip" ref={trackRef}>
          {reels.map((r) => {
            const clickHref =
              r.click_url ||
              r.instagram_url ||
              r.youtube_url ||
              r.video_url ||
              '#';

            // Priority: video_url (clean MP4) > youtube > instagram
            const ytEmbed = r.youtube_url ? youtubeEmbed(r.youtube_url) : null;
            const igEmb = !ytEmbed && r.instagram_url ? igEmbed(r.instagram_url) : null;
            const srcKind: 'video' | 'youtube' | 'instagram' | 'image' =
              r.video_url ? 'video' :
              ytEmbed ? 'youtube' :
              igEmb ? 'instagram' :
              'image';

            return (
              <a
                key={r.id}
                href={clickHref}
                target="_blank"
                rel="noopener"
                className="reel-card-strip"
                aria-label={`Open ${r.title}`}
              >
                <div className="reel-card-inner">
                  {srcKind === 'video' && r.video_url && (
                    <>
                      <video
                        src={r.video_url}
                        poster={r.thumbnail_url || undefined}
                        autoPlay muted loop playsInline
                        preload="metadata"
                      />
                      <span className="reel-tap-overlay" aria-hidden="true"></span>
                    </>
                  )}
                  {srcKind === 'youtube' && ytEmbed && (
                    <>
                      <iframe
                        src={ytEmbed}
                        title={r.title}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="lazy"
                        tabIndex={-1}
                      />
                      <span className="reel-tap-overlay" aria-hidden="true"></span>
                    </>
                  )}
                  {srcKind === 'instagram' && igEmb && (
                    <>
                      <iframe
                        src={igEmb}
                        title={r.title}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="lazy"
                        tabIndex={-1}
                      />
                      <span className="reel-tap-overlay" aria-hidden="true"></span>
                    </>
                  )}
                  {srcKind === 'image' && r.thumbnail_url && (
                    <img src={r.thumbnail_url} alt={r.title} loading="lazy" />
                  )}
                  {srcKind === 'image' && !r.thumbnail_url && (
                    <div className="reel-thumb-fallback">
                      <span style={{ fontSize: '0.85rem', opacity: 0.95 }}>{r.title}</span>
                    </div>
                  )}
                  <span className="reel-source-tag">
                    {srcKind === 'video' ? ' HD' :
                     srcKind === 'youtube' ? ' YT' :
                     srcKind === 'instagram' ? 'IG' : ''}
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
          <a href="/reels/" className="reels-view-all">View All Reels </a>
        </div>
      </div>
    </section>
  );
}
