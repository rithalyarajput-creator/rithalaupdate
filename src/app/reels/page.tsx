import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { getPublishedReels } from '@/lib/db';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Reels — Rithala Update | Bhakti & Rajput Culture Videos',
  description: 'Watch short reels on Bhakti, Rajput culture, Kawad Yatra, and temple moments from Rithala Village, Delhi. Follow Rithala Update on Instagram for more.',
  keywords: 'Rithala reels, Bhakti reels, Rajput culture videos, Kawad Yatra reels, Rithala village videos, temple reels Delhi',
  alternates: { canonical: '/reels/' },
  openGraph: {
    title: 'Reels — Bhakti & Rajput Culture | Rithala Update',
    description: 'Short reels on Bhakti, Rajput culture, Kawad Yatra, and temple moments from Rithala Village, Delhi.',
    url: '/reels/',
    type: 'website',
    images: [{ url: 'https://rithalaupdate.online/og-default.jpg', width: 1200, height: 630, alt: 'Rithala Update Reels' }],
  },
  twitter: { card: 'summary_large_image', title: 'Reels — Rithala Update', description: 'Bhakti, Rajput culture and village reels from Rithala, Delhi.' },
};

export default async function ReelsPage() {
  const reels = await getPublishedReels(50).catch(() => []);

  return (
    <PublicShell>
      <section className="container section">
        <h1 style={{ textAlign: 'center', color: 'var(--color-link)' }}> Reels</h1>
        <p style={{ textAlign: 'center', color: '#5b6573', maxWidth: 600, margin: '0 auto 30px' }}>
          Bhakti, Rajputana culture, and temple moments from Rithala Village.
        </p>

        {reels.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>
            No reels yet. Check back soon!
          </p>
        ) : (
          <div className="reel-public-grid">
            {reels.map((r) => (
              <a key={r.id} href={r.instagram_url} target="_blank" rel="noopener" className="reel-public-card">
                <div className="reel-public-thumb">
                  {r.thumbnail_url ? (
                    <img src={r.thumbnail_url} alt={r.title} />
                  ) : (
                    <div className="reel-placeholder"> Reel</div>
                  )}
                  <div className="reel-play-overlay"></div>
                </div>
                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{r.title}</h3>
                  {r.description && (
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                      {r.description.slice(0, 100)}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
