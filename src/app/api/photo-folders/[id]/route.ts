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
    UPDATE photo_folders SET
      category_id = ${body.category_id},
      name = ${body.name},
      slug = ${body.slug},
      cover_url = ${body.cover_url || null},
      description = ${body.description || null}
    WHERE id = ${id}
  `;
  revalidatePath('/photos');
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await sql`DELETE FROM photo_folders WHERE id = ${Number(params.id)}`;
  revalidatePath('/photos');
  return NextResponse.json({ ok: true });
}
