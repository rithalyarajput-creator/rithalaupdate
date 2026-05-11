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

  let photos: any[] = [];
  try {
    const r = await sql`
      SELECT p.id, p.title, p.image_url, p.alt_text, p.caption, p.created_at,
        ARRAY(
          SELECT pc.id FROM photo_photo_categories ppc
          JOIN photo_categories pc ON pc.id = ppc.category_id
          WHERE ppc.photo_id = p.id
        ) AS category_ids,
        ARRAY(
          SELECT pc.name FROM photo_photo_categories ppc
          JOIN photo_categories pc ON pc.id = ppc.category_id
          WHERE ppc.photo_id = p.id
        ) AS category_names
      FROM photos p
      ORDER BY p.created_at DESC
    `;
    photos = r.rows;
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

  return (
    <AdminShell email={session.email}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1"><Icon name="photo" size={22} /> Photos</h1>
          <p className="adm-h1-sub">Upload photos with title, categories and alt text. They show on /photos/.</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            <Icon name="image" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{photos.length}</div>
            <div className="adm-stat-label">Total Photos</div>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Icon name="tag" size={20} />
          </div>
          <div>
            <div className="adm-stat-num">{cats.length}</div>
            <div className="adm-stat-label">Photo Categories</div>
          </div>
        </div>
      </div>

      <PhotosManager initialPhotos={photos} initialCategories={cats} />
    </AdminShell>
  );
}
