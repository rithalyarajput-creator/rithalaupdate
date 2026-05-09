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
