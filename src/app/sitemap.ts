import type { MetadataRoute } from 'next';
import { sql } from '@/lib/db';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE}/about/`,             lastModified: new Date(), changeFrequency: 'monthly',  priority: 0.9 },
    { url: `${SITE}/sandeep-rajput/`,    lastModified: new Date(), changeFrequency: 'monthly',  priority: 0.9 },
    { url: `${SITE}/blog/`,              lastModified: new Date(), changeFrequency: 'daily',    priority: 0.8 },
    { url: `${SITE}/photos/`,            lastModified: new Date(), changeFrequency: 'weekly',   priority: 0.8 },
    { url: `${SITE}/reels/`,             lastModified: new Date(), changeFrequency: 'weekly',   priority: 0.7 },
    { url: `${SITE}/contact/`,           lastModified: new Date(), changeFrequency: 'yearly',   priority: 0.6 },
    { url: `${SITE}/faqs/`,              lastModified: new Date(), changeFrequency: 'monthly',  priority: 0.6 },
    { url: `${SITE}/rithala-village-history/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    const posts = await sql<{ slug: string; updated_at: string; legacy_path: string }>`
      SELECT slug, updated_at, legacy_path FROM posts WHERE status = 'published'
    `;
    for (const p of posts.rows) {
      urls.push({
        url: `${SITE}/${p.slug}/`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      // also include the legacy WordPress URL for SEO continuity
      if (p.legacy_path && p.legacy_path !== `/${p.slug}/`) {
        urls.push({
          url: `${SITE}${p.legacy_path}`,
          lastModified: new Date(p.updated_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    const pages = await sql<{ slug: string; updated_at: string }>`
      SELECT slug, updated_at FROM pages WHERE status = 'published'
    `;
    for (const p of pages.rows) {
      urls.push({
        url: `${SITE}/${p.slug}/`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    const cats = await sql<{ slug: string }>`SELECT slug FROM categories`;
    for (const c of cats.rows) {
      urls.push({
        url: `${SITE}/category/${c.slug}/`,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  } catch {}

  return urls;
}
