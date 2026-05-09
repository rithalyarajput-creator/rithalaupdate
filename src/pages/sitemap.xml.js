// Custom sitemap.xml — includes home, all posts, all pages and category index pages.
// We URL-encode each path so non-ASCII characters become valid sitemap URIs.

import { posts, pages, categories } from '../lib/content.js';

function encode(href) {
  // Decode first (so already percent-encoded paths from WordPress don't
  // double-encode), then re-encode each path segment.
  return href
    .split('/')
    .map((seg) => {
      if (!seg) return seg;
      let decoded = seg;
      try {
        decoded = decodeURIComponent(seg);
      } catch {}
      return encodeURIComponent(decoded);
    })
    .join('/');
}

function isoDate(s) {
  if (!s) return null;
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

export async function GET({ site }) {
  const base = site.toString().replace(/\/$/, '');

  const urlMap = new Map();
  function add(path, lastmod) {
    if (!path) return;
    const cur = urlMap.get(path);
    if (!cur || (lastmod && lastmod > cur)) urlMap.set(path, lastmod || cur);
  }

  const today = isoDate(new Date());
  add('/', today);

  for (const p of posts) {
    const dt = isoDate(p.postModified || p.postDateGmt || p.postDate) || today;
    if (p.path) add(p.path, dt);
    if (p.postName) add(`/${p.postName}/`, dt);
  }
  for (const p of pages) {
    const dt = isoDate(p.postModified || p.postDateGmt || p.postDate) || today;
    if (p.path) add(p.path, dt);
    if (p.postName) add(`/${p.postName}/`, dt);
  }
  for (const c of categories) {
    if (c.slug && c.slug !== 'uncategorized') add(`/category/${c.slug}/`, today);
  }

  const items = [...urlMap.entries()]
    .map(
      ([u, dt]) =>
        `  <url><loc>${base}${encode(u)}</loc><lastmod>${dt || today}</lastmod></url>`
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
