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
    UPDATE reels SET
      title = ${body.title},
      instagram_url = ${body.instagram_url || null},
      video_url = ${body.video_url || null},
      youtube_url = ${body.youtube_url || null},
      click_url = ${body.click_url || null},
      thumbnail_url = ${body.thumbnail_url || null},
      description = ${body.description || null},
      display_order = ${body.display_order || 0},
      is_featured = ${!!body.is_featured},
      status = ${body.status || 'published'},
      updated_at = NOW()
    WHERE id = ${id}
  `;
  revalidatePath('/');
  revalidatePath('/reels/');
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  await sql`DELETE FROM reels WHERE id = ${id}`;
  revalidatePath('/');
  revalidatePath('/reels/');
  return NextResponse.json({ ok: true });
}
