import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();

  await sql`
    UPDATE photos SET
      title = ${body.title || null},
      image_url = ${body.image_url},
      alt_text = ${body.alt_text || null},
      caption = ${body.caption || null}
    WHERE id = ${id}
  `;

  await sql`DELETE FROM photo_photo_categories WHERE photo_id = ${id}`;
  const catIds: number[] = Array.isArray(body.category_ids) ? body.category_ids : [];
  for (const cid of catIds) {
    await sql`INSERT INTO photo_photo_categories (photo_id, category_id) VALUES (${id}, ${cid}) ON CONFLICT DO NOTHING`;
  }

  revalidatePath('/photos');
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await sql`DELETE FROM photos WHERE id = ${Number(params.id)}`;
  revalidatePath('/photos');
  return NextResponse.json({ ok: true });
}
