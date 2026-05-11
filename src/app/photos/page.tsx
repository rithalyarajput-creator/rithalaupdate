import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';
import { sql } from '@/lib/db';
import PhotosBrowser from './PhotosBrowser';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Photos — Rithala Update | Village photo gallery',
  description: 'Photo gallery of Rithala village — Kawad Yatra, festivals, temples, village life. Browse photos by category and album.',
  alternates: { canonical: '/photos/' },
};

type SP = { category?: string; folder?: string };

export default async function PhotosPage({ searchParams }: { searchParams: SP }) {
  const cat = searchParams.category || '';
  const folderSlug = searchParams.folder || '';

  // All categories with counts
  let cats: any[] = [];
  try {
    const r = await sql`
      SELECT c.id, c.slug, c.name,
        (SELECT COUNT(*)::int FROM photo_folders WHERE category_id = c.id) AS folder_count
      FROM photo_categories c
      ORDER BY c.name
    `;
    cats = r.rows;
  } catch {}

  const activeCat = cats.find((c) => c.slug === cat);

  // Folders for current category (or all)
  let folders: any[] = [];
  try {
    if (cat && activeCat) {
      const r = await sql`
        SELECT f.id, f.name, f.slug, f.cover_url, f.description,
          (SELECT COUNT(*)::int FROM photos WHERE folder_id = f.id) AS photo_count,
          f.created_at
        FROM photo_folders f
        WHERE f.category_id = ${activeCat.id}
        ORDER BY f.created_at DESC
      `;
      folders = r.rows;
    } else if (!cat) {
      // All folders grouped by category
      const r = await sql`
        SELECT f.id, f.name, f.slug, f.cover_url, f.description, f.category_id,
          c.name AS category_name, c.slug AS category_slug,
          (SELECT COUNT(*)::int FROM photos WHERE folder_id = f.id) AS photo_count
        FROM photo_folders f
        LEFT JOIN photo_categories c ON c.id = f.category_id
        ORDER BY c.name, f.created_at DESC
      `;
      folders = r.rows;
    }
  } catch {}

  // Photos inside the selected folder
  let photosInFolder: any[] = [];
  let activeFolder: any = null;
  if (folderSlug && activeCat) {
    try {
      const f = await sql`
        SELECT id, name, slug, description FROM photo_folders
        WHERE category_id = ${activeCat.id} AND slug = ${folderSlug} LIMIT 1
      `;
      activeFolder = f.rows[0] || null;
      if (activeFolder) {
        const r = await sql`
          SELECT id, image_url, alt_text, title, caption
          FROM photos WHERE folder_id = ${activeFolder.id}
          ORDER BY created_at DESC
        `;
        photosInFolder = r.rows;
      }
    } catch {}
  }

  return (
    <PublicShell>
      <section className="ph2-hero">
        <div className="container">
          <span className="ph2-eyebrow">Photo Gallery</span>
          <h1 className="ph2-h1">Rithala Photos</h1>
          <p className="ph2-lead">
            Browse photos by category and album — Festivals, Temples, Kawad Yatra, और गाँव की झलकियाँ।
          </p>
        </div>
      </section>

      <section className="ph2-tabs-section">
        <div className="container">
          <div className="ph2-tabs">
            <Link href="/photos/" className={`ph2-tab ${!cat ? 'is-active' : ''}`}>
              All
            </Link>
            {cats.map((c) => (
              <Link
                key={c.id}
                href={`/photos/?category=${c.slug}`}
                className={`ph2-tab ${cat === c.slug ? 'is-active' : ''}`}
              >
                {c.name}
                <span className="ph2-tab-count">{c.folder_count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ph2-body">
        <div className="container">
          {/* Breadcrumb when inside a folder */}
          {activeFolder && activeCat && (
            <nav className="ph2-crumb">
              <Link href="/photos/">All Photos</Link>
              <Icon name="chevron-right" size={12} />
              <Link href={`/photos/?category=${activeCat.slug}`}>{activeCat.name}</Link>
              <Icon name="chevron-right" size={12} />
              <span>{activeFolder.name}</span>
            </nav>
          )}

          {/* Folder is selected → show photo grid with lightbox */}
          {activeFolder ? (
            <>
              <div className="ph2-folder-head">
                <h2>{activeFolder.name}</h2>
                {activeFolder.description && <p>{activeFolder.description}</p>}
                <small>{photosInFolder.length} photo{photosInFolder.length !== 1 ? 's' : ''}</small>
              </div>
              <PhotosBrowser photos={photosInFolder} />
            </>
          ) : folders.length === 0 ? (
            <div className="ph2-empty">
              <Icon name="book" size={48} />
              <h3>No albums yet</h3>
              <p>Photo albums will appear here once admin creates them.</p>
            </div>
          ) : (
            <>
              {/* Header for category mode */}
              {activeCat && (
                <div className="ph2-folder-head">
                  <h2>{activeCat.name}</h2>
                  <small>{folders.length} album{folders.length !== 1 ? 's' : ''}</small>
                </div>
              )}

              {/* Polaroid-style folder cards */}
              <div className="ph2-folder-grid">
                {folders.map((f) => (
                  <Link
                    key={f.id}
                    href={`/photos/?category=${f.category_slug || activeCat?.slug}&folder=${f.slug}`}
                    className="ph2-folder-card"
                  >
                    <div className="ph2-folder-stack ph2-stack-3" aria-hidden="true"></div>
                    <div className="ph2-folder-stack ph2-stack-2" aria-hidden="true"></div>
                    <div className="ph2-folder-stack ph2-stack-1" aria-hidden="true"></div>
                    <figure className="ph2-folder-photo">
                      {f.cover_url ? (
                        <img src={f.cover_url} alt={f.name} loading="lazy" />
                      ) : (
                        <div className="ph2-folder-cover-empty">
                          <Icon name="image" size={28} />
                          <small>No cover</small>
                        </div>
                      )}
                      <figcaption>
                        <strong>{f.name}</strong>
                        <small>
                          {f.category_name && !activeCat ? `${f.category_name} · ` : ''}
                          {f.photo_count} photo{f.photo_count !== 1 ? 's' : ''}
                        </small>
                      </figcaption>
                    </figure>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
