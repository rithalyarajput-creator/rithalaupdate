import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import './styles.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Sandeep Rajput Drawings & Paintings | Rithalya Rajput Art Gallery',
  description: 'Pencil drawings, paintings and creative artworks by Sandeep Rajput (Rithalya Rajput) — self-taught artist from Rithala, Delhi. Portraits of Hindu gods, celebrities and original sketches.',
  keywords: 'Sandeep Rajput drawing, Rithalya Rajput art, Sandeep Rajput painting, pencil sketch Rithala Delhi, Maharana Pratap drawing, Krishna painting Sandeep Rajput',
  alternates: { canonical: '/sandeep-rajput-drawings/' },
  openGraph: {
    title: 'Sandeep Rajput Drawings & Art Gallery | Rithalya Rajput',
    description: 'Creative artworks and pencil drawings by Sandeep Rajput Rithalya Rajput from Rithala, Delhi.',
    url: `${SITE}/sandeep-rajput-drawings/`,
  },
};

const ARTWORKS = [
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480852254-rajputs-warrior-art-by-sandeep-rajput-1-EcVAvTjm85N2w0aQvMnINf1q6UJHDc.png', title: 'Maharana Pratap', sub: 'Legendary Rajput Warrior — Color Pencil Drawing', category: 'Historical' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480850386-little-krishna-art-by-sandeep-rajput-My42d3DBHBriELEJVA1mOHJJo1keeD.png', title: 'Little Krishna', sub: 'Color Pencil Drawing by Sandeep Rajput', category: 'Devotional' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480848621-karan-aujla-art-by-sandeep-rajput-lBjClfy7IXQpR7wTAV6B57kMszDu6w.png', title: 'Karan Aujla', sub: 'Pencil Portrait Sketch by Sandeep Rajput', category: 'Celebrity' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480846991-little-ram-art-by-sandeep-rajput-CfC5gcy4UkzhNKrzWUXgaWxdUDXvuC.png', title: 'Little Ram', sub: 'Shri Ram Pencil Art by Sandeep Rajput', category: 'Devotional' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480845194-virat-kholi-art-by-sandeep-rajput-yfvTxR9dqTw0jHTXu8nBNxAQBhWGTN.png', title: 'Virat Kohli', sub: 'Cricket Legend Pencil Portrait', category: 'Celebrity' },
];

export default function DrawingsPage() {
  return (
    <PublicShell>
      <main className="drw-page">
        <section className="drw-hero">
          <div className="drw-container">
            <span className="drw-hero-badge">Self-Taught Artist · Rithala, Delhi</span>
            <h1>Sandeep Rajput — Art &amp; Drawings</h1>
            <p className="drw-hero-sub">Rithalya Rajput — Pencil Sketches, Paintings &amp; Creative Artworks</p>
          </div>
        </section>

        <section className="drw-section">
          <div className="drw-container">
            <div className="drw-gallery-grid">
              {ARTWORKS.map((art, i) => (
                <div key={i} className="drw-card">
                  <div className="drw-card-img-wrap">
                    <img
                      src={art.img}
                      alt={`${art.title} pencil drawing art by Sandeep Rajput Rithalya Rajput Rithala Delhi`}
                      className="drw-card-img"
                      loading="lazy"
                    />
                    <span className="drw-card-cat">{art.category}</span>
                  </div>
                  <div className="drw-card-body">
                    <h2>{art.title}</h2>
                    <p>{art.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="drw-cta">
          <div className="drw-container">
            <h2>About My Art Journey</h2>
            <p>Drawing has always been a natural part of my life. Self-taught, passion-driven — every stroke tells a story.</p>
            <a href="/sandeep-rajput/" className="drw-btn">About Sandeep Rajput</a>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
