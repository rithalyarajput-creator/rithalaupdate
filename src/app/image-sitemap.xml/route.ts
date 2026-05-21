import { sql } from '@/lib/db';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const dynamic = 'force-dynamic';

export async function GET() {
  let photos: { image_url: string; alt_text: string | null; title: string | null; folder_name: string | null; category_name: string | null; folder_slug: string | null; category_slug: string | null }[] = [];
  let blogImages: { featured_image: string | null; title: string; slug: string }[] = [];

  try {
    const r = await sql`
      SELECT
        p.image_url,
        p.alt_text,
        p.title,
        f.name AS folder_name,
        f.slug AS folder_slug,
        c.name AS category_name,
        c.slug AS category_slug
      FROM photos p
      LEFT JOIN photo_folders f ON f.id = p.folder_id
      LEFT JOIN photo_categories c ON c.id = f.category_id
      WHERE p.image_url IS NOT NULL AND p.image_url != ''
      ORDER BY p.created_at DESC
    `;
    photos = r.rows as any;
  } catch {}

  try {
    const r = await sql`
      SELECT featured_image, title, slug
      FROM posts
      WHERE status = 'published'
        AND featured_image IS NOT NULL
        AND featured_image != ''
      ORDER BY published_at DESC NULLS LAST
    `;
    blogImages = r.rows as any;
  } catch {}

  // Group photos by category page URL
  const categoryMap = new Map<string, { loc: string; images: typeof photos }>();

  for (const p of photos) {
    const pageUrl = p.category_slug && p.folder_slug
      ? `${SITE}/photos/?category=${p.category_slug}&folder=${p.folder_slug}`
      : `${SITE}/photos/`;
    if (!categoryMap.has(pageUrl)) {
      categoryMap.set(pageUrl, { loc: pageUrl, images: [] });
    }
    categoryMap.get(pageUrl)!.images.push(p);
  }

  // Build XML
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Photo gallery pages with images
  for (const [, entry] of categoryMap) {
    xml += `  <url>\n    <loc>${escape(entry.loc)}</loc>\n`;
    for (const img of entry.images.slice(0, 1000)) {
      const caption = img.alt_text || img.title || img.folder_name || 'Rithala Village Photo';
      const title = [img.title || img.folder_name, img.category_name, 'Rithala Village']
        .filter(Boolean).join(' — ');
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escape(img.image_url)}</image:loc>\n`;
      xml += `      <image:caption>${escape(caption)}</image:caption>\n`;
      xml += `      <image:title>${escape(title)}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  // Blog posts with featured images
  for (const post of blogImages) {
    if (!post.featured_image) continue;
    const slug = post.slug.replace(/^\d{4}\/\d{2}\/\d{2}\//, '');
    const loc = `${SITE}/blog/${slug}/`;
    xml += `  <url>\n    <loc>${escape(loc)}</loc>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${escape(post.featured_image)}</image:loc>\n`;
    xml += `      <image:caption>${escape(post.title)} — Rithala Update</image:caption>\n`;
    xml += `      <image:title>${escape(post.title)}</image:title>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  }

  // Main photos page
  xml += `  <url>\n    <loc>${SITE}/photos/</loc>\n  </url>\n`;

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
