// PUT    /api/posts/:id — update
// DELETE /api/posts/:id — remove

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const status = body.status === 'draft' ? 'draft' : 'published';
  const slug = String(body.slug || '').trim();

  const oldR = await sql`SELECT slug FROM posts WHERE id = ${id} LIMIT 1`;
  const oldSlug = oldR.rows[0]?.slug;

  await sql`
    UPDATE posts SET
      title = ${title},
      slug = ${slug},
      excerpt = ${body.excerpt || null},
      content = ${body.content || null},
      featured_image = ${body.featured_image || null},
      status = ${status},
      published_at = COALESCE(published_at, ${status === 'published' ? new Date().toISOString() : null}),
      meta_title = ${body.meta_title || null},
      meta_description = ${body.meta_description || null},
      og_image = ${body.og_image || null},
      focus_keyword = ${body.focus_keyword || null},
      canonical_url = ${body.canonical_url || null},
      noindex = ${!!body.noindex},
      author_name = ${body.author_name || null},
      scheduled_at = ${body.scheduled_at || null},
      updated_at = NOW()
    WHERE id = ${id}
  `;

  await sql`DELETE FROM post_categories WHERE post_id = ${id}`;
  const catIds: number[] = Array.isArray(body.category_ids) ? body.category_ids : [];
  for (const cid of catIds) {
    await sql`INSERT INTO post_categories (post_id, category_id) VALUES (${id}, ${cid}) ON CONFLICT DO NOTHING`;
  }

  revalidatePath('/');
  if (oldSlug) revalidatePath(`/${oldSlug}/`);
  revalidatePath(`/${slug}/`);

  return NextResponse.json({ ok: true, id, slug });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const oldR = await sql`SELECT slug FROM posts WHERE id = ${id} LIMIT 1`;
  await sql`DELETE FROM posts WHERE id = ${id}`;
  revalidatePath('/');
  if (oldR.rows[0]?.slug) revalidatePath(`/${oldR.rows[0].slug}/`);
  return NextResponse.json({ ok: true });
}
