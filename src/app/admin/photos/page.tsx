import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import Icon from '@/components/Icon';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import PhotosManager from './PhotosManager';

export const dynamic = 'force-dynamic';

export default async function PhotosPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let cats: any[] = [];
  try {
    const r = await sql`
      SELECT c.id, c.slug, c.name,
        (SELECT COUNT(*)::int FROM photo_folders WHERE category_id = c.id) AS folder_count,
        (SELECT COUNT(*)::int FROM photos p
           JOIN photo_photo_categories ppc ON ppc.photo_id = p.id
           WHERE ppc.category_id = c.id) AS photo_count
      FROM photo_categories c
      ORDER BY c.name
    `;
    cats = r.rows;
  } catch {}

  let folders: any[] = [];
  try {
    const r = await sql`
      SELECT f.id, f.category_id, f.name, f.slug, f.cover_url, f.description,
        (SELECT COUNT(*)::int FROM photos WHERE folder_id = f.id) AS photo_count,
        c.name AS category_name
      FROM photo_folders f
      LEFT JOIN photo_categories c ON c.id = f.category_id
      ORDER BY f.created_at DESC
    `;
    folders = r.rows;
  } catch {}

  let photos: any[] = [];
  try {
    const r = await sql`
      SELECT p.id, p.title, p.image_url, p.alt_text, p.caption, p.folder_id, p.created_at,
        ARRAY(
          SELECT pc.id FROM photo_photo_categories ppc
          JOIN photo_categories pc ON pc.id = ppc.category_id
          WHERE ppc.photo_id = p.id
        ) AS category_ids,
        ARRAY(
          SELECT pc.name FROM photo_photo_categories ppc
          JOIN photo_categories pc ON pc.id = ppc.category_id
          WHERE ppc.photo_id = p.id
        ) AS category_names,
        (SELECT name FROM photo_folders WHERE id = p.folder_id) AS folder_name
      FROM photos p
      ORDER BY p.created_at DESC
    `;
    photos = r.rows;
  } catch {}

  const totalPhotos = photos.length;
  const totalFolders = folders.length;

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="photo" size={22} /> Photos</h1>
          <p className="adm-h1-sub">Categories → Folders → Photos. Build photo albums by event/year.</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            <Icon name="image" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{totalPhotos}</div>
            <div className="adm-stat-label">Total Photos</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Icon name="book" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{totalFolders}</div>
            <div className="adm-stat-label">Folders / Albums</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Icon name="tag" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{cats.length}</div>
            <div className="adm-stat-label">Categories</div>
          </div>
        </div>
      </div>

      <PhotosManager
        initialPhotos={photos}
        initialCategories={cats}
        initialFolders={folders}
      />
    </AdminShell>
  );
}
