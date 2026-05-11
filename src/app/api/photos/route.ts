import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.image_url) return NextResponse.json({ error: 'image_url required' }, { status: 400 });

  const r = await sql<{ id: number }>`
    INSERT INTO photos (title, image_url, alt_text, caption)
    VALUES (${body.title || null}, ${body.image_url}, ${body.alt_text || null}, ${body.caption || null})
    RETURNING id
  `;
  const id = r.rows[0].id;

  const catIds: number[] = Array.isArray(body.category_ids) ? body.category_ids : [];
  for (const cid of catIds) {
    await sql`INSERT INTO photo_photo_categories (photo_id, category_id) VALUES (${id}, ${cid}) ON CONFLICT DO NOTHING`;
  }

  revalidatePath('/photos');
  return NextResponse.json({ id });
}
