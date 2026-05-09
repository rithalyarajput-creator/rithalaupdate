// POST /api/posts — create a new post
// GET  /api/posts  — list (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const slugRaw = String(body.slug || '').trim() || slugify(title, { lower: true, strict: true });
  // Avoid slug collisions
  let slug = slugRaw;
  let n = 1;
  while ((await sql`SELECT 1 FROM posts WHERE slug = ${slug} LIMIT 1`).rows.length > 0) {
    n++; slug = `${slugRaw}-${n}`;
  }

  const status = body.status === 'draft' ? 'draft' : 'published';
  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  const r = await sql`
    INSERT INTO posts (slug, title, excerpt, content, featured_image, author_id, status, published_at)
    VALUES (
      ${slug}, ${title}, ${body.excerpt || null}, ${body.content || null},
      ${body.featured_image || null}, ${session.userId}, ${status}, ${publishedAt}
    )
    RETURNING id, slug
  `;
  const id = r.rows[0].id;

  // Categories
  const catIds: number[] = Array.isArray(body.category_ids) ? body.category_ids : [];
  for (const cid of catIds) {
    await sql`INSERT INTO post_categories (post_id, category_id) VALUES (${id}, ${cid}) ON CONFLICT DO NOTHING`;
  }

  // Revalidate public paths
  revalidatePath('/');
  revalidatePath(`/${slug}/`);
  return NextResponse.json({ id, slug });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const r = await sql`SELECT id, slug, title, status, published_at FROM posts ORDER BY updated_at DESC`;
  return NextResponse.json({ posts: r.rows });
}
