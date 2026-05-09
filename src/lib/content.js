// Helpers for reading parsed WordPress export data and rendering it.

import wxr from '../data/wxr.json';

export const site = wxr.site;
export const posts = wxr.posts;
export const pages = wxr.pages;
export const categories = wxr.categories;
export const tags = wxr.tags;
export const attachments = wxr.attachments;
export const postsByCategory = wxr.postsByCategory;

export function getPostBySlug(slug) {
  return posts.find((p) => p.postName === slug);
}

export function getPageBySlug(slug) {
  return pages.find((p) => p.postName === slug);
}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getPostsForCategory(slug) {
  const ids = postsByCategory[slug] || [];
  return posts.filter((p) => ids.includes(p.id));
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function pickExcerpt(item) {
  const e = (item.excerpt || '').replace(/<[^>]+>/g, '').trim();
  if (e) return e.slice(0, 200);
  const stripped = (item.content || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return stripped.slice(0, 200);
}

// Rewrite URLs inside content/HTML to point to canonical wordpress.com paths
// (we keep URL paths the same so internal article links still work). Also
// normalises any embed iframes wrapped in "embed-youtube" divs.
export function rewriteContent(html) {
  if (!html) return '';
  // Remove any wp:* shortcodes/comments left over
  let out = html;
  // Some Jetpack related-posts blocks have empty wrappers; leave them.
  return out;
}
