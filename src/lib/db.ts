// Wrapper around @vercel/postgres so the rest of the codebase can
// import a single `sql` template tag and a few typed helpers.

import { sql, db } from '@vercel/postgres';

export { sql, db };

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_id: number | null;
  status: string;
  published_at: string;
  legacy_path: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  noindex: boolean | null;
};

export type Media = {
  id: number;
  url: string;
  filename: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: number | null;
  alt_text: string | null;
  caption: string | null;
  title: string | null;
  created_at: string;
};

export type Lead = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  status: string;
  ip_address: string | null;
  user_agent: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Reel = {
  id: number;
  title: string;
  instagram_url: string;
  thumbnail_url: string | null;
  description: string | null;
  display_order: number;
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Page = {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  featured_image: string | null;
  status: string;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
};

export type User = {
  id: number;
  email: string;
  display_name: string | null;
  role: string;
};

export async function getPublishedPosts(limit = 50) {
  const { rows } = await sql<Post>`
    SELECT * FROM posts
    WHERE status = 'published'
    ORDER BY published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows;
}

export async function getPostBySlug(slug: string) {
  const { rows } = await sql<Post>`
    SELECT * FROM posts WHERE slug = ${slug} LIMIT 1
  `;
  return rows[0] || null;
}

export async function getPostByLegacyPath(path: string) {
  const { rows } = await sql<Post>`
    SELECT * FROM posts WHERE legacy_path = ${path} LIMIT 1
  `;
  return rows[0] || null;
}

export async function getPageBySlug(slug: string) {
  const { rows } = await sql<Page>`
    SELECT * FROM pages WHERE slug = ${slug} LIMIT 1
  `;
  return rows[0] || null;
}

export async function getCategories() {
  const { rows } = await sql<Category>`
    SELECT * FROM categories ORDER BY name
  `;
  return rows;
}

export async function getCategoryBySlug(slug: string) {
  const { rows } = await sql<Category>`
    SELECT * FROM categories WHERE slug = ${slug} LIMIT 1
  `;
  return rows[0] || null;
}

export async function getPostsByCategory(categorySlug: string) {
  const { rows } = await sql<Post>`
    SELECT p.* FROM posts p
    JOIN post_categories pc ON pc.post_id = p.id
    JOIN categories c ON c.id = pc.category_id
    WHERE c.slug = ${categorySlug} AND p.status = 'published'
    ORDER BY p.published_at DESC NULLS LAST
  `;
  return rows;
}

export async function getCategoriesForPost(postId: number) {
  const { rows } = await sql<Category>`
    SELECT c.* FROM categories c
    JOIN post_categories pc ON pc.category_id = c.id
    WHERE pc.post_id = ${postId}
  `;
  return rows;
}

export async function getSetting(key: string): Promise<string | null> {
  const { rows } = await sql<{ value: string }>`
    SELECT value FROM settings WHERE key = ${key} LIMIT 1
  `;
  return rows[0]?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const { rows } = await sql<{ key: string; value: string }>`
    SELECT key, value FROM settings
  `;
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getPublishedReels(limit = 12) {
  const { rows } = await sql<Reel>`
    SELECT * FROM reels
    WHERE status = 'published'
    ORDER BY display_order ASC, created_at DESC
    LIMIT ${limit}
  `;
  return rows;
}

export async function getFeaturedReels(limit = 6) {
  const { rows } = await sql<Reel>`
    SELECT * FROM reels
    WHERE status = 'published' AND is_featured = TRUE
    ORDER BY display_order ASC, created_at DESC
    LIMIT ${limit}
  `;
  return rows;
}

export async function getAllMedia(limit = 100) {
  const { rows } = await sql<Media>`
    SELECT * FROM media
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows;
}
