import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import { sql } from '@/lib/db';
import Icon from '@/components/Icon';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Photos — Rithala Update | Village photo gallery',
  description: 'Photo gallery of Rithala village — Kawad Yatra, festivals, temples, village life and more.',
  alternates: { canonical: '/photos/' },
};

type SP = { category?: string };

export default async function PhotosPage({ searchParams }: { searchParams: SP }) {
  const cat = searchParams.category || '';

  let photos: any[] = [];
  try {
    if (cat) {
      const r = await sql<any>`
        SELECT p.id, p.title, p.image_url, p.alt_text, p.caption
        FROM photos p
        JOIN photo_photo_categories ppc ON ppc.photo_id = p.id
        JOIN photo_categories c ON c.id = ppc.category_id
        WHERE c.slug = ${cat}
        ORDER BY p.created_at DESC
      `;
      photos = r.rows;
    } else {
      const r = await sql<any>`
        SELECT id, title, image_url, alt_text, caption
        FROM photos
        ORDER BY created_at DESC
      `;
      photos = r.rows;
    }
  } catch {}

  let cats: any[] = [];
  try {
    const r = await sql`
      SELECT c.id, c.slug, c.name,
        (SELECT COUNT(*)::int FROM photo_photo_categories WHERE category_id = c.id) AS n
      FROM photo_categories c
      ORDER BY c.name
    `;
    cats = r.rows;
  } catch {}

  const activeCat = cats.find((c) => c.slug === cat);

  return (
    <PublicShell>
      <section className="ph-hero">
        <div className="container">
          <span className="ph-eyebrow">Photo Gallery</span>
          <h1 className="ph-h1">Rithala Photos</h1>
          <p className="ph-lead">
            Kawad Yatra, festivals, temples, और गाँव की झलकियाँ — हमारे gallery में देखें।
          </p>
        </div>
      </section>

      <section className="ph-filter">
        <div className="container">
          <div className="ph-cat-tabs">
            <Link href="/photos/" className={`ph-cat-tab ${!cat ? 'is-active' : ''}`}>
              All Photos <span>{photos.length}</span>
            </Link>
            {cats.map((c) => (
              <Link
                key={c.id}
                href={`/photos/?category=${c.slug}`}
                className={`ph-cat-tab ${cat === c.slug ? 'is-active' : ''}`}
              >
                {c.name} <span>{c.n}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ph-grid-section">
        <div className="container">
          {activeCat && (
            <div className="ph-active-cat">
              <h2>{activeCat.name}</h2>
              <Link href="/photos/" className="ph-cat-clear">
                <Icon name="close" size={13} /> Clear filter
              </Link>
            </div>
          )}

          {photos.length === 0 ? (
            <div className="ph-empty">
              <Icon name="image" size={48} />
              <h3>No photos yet</h3>
              <p>Photos will appear here once admin uploads them.</p>
            </div>
          ) : (
            <div className="ph-grid">
              {photos.map((p) => (
                <figure key={p.id} className="ph-item">
                  <img src={p.image_url} alt={p.alt_text || p.title || 'Rithala photo'} loading="lazy" />
                  {(p.title || p.caption) && (
                    <figcaption>
                      {p.title && <strong>{p.title}</strong>}
                      {p.caption && <span>{p.caption}</span>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
