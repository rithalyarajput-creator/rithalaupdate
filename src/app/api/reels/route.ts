import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.title || !body.instagram_url) {
    return NextResponse.json({ error: 'Title and Instagram URL required' }, { status: 400 });
  }
  const r = await sql<{ id: number }>`
    INSERT INTO reels (title, instagram_url, thumbnail_url, description, display_order, is_featured, status)
    VALUES (
      ${body.title}, ${body.instagram_url}, ${body.thumbnail_url || null},
      ${body.description || null}, ${body.display_order || 0},
      ${!!body.is_featured}, ${body.status || 'published'}
    )
    RETURNING id
  `;
  revalidatePath('/');
  revalidatePath('/reels/');
  return NextResponse.json({ id: r.rows[0].id });
}
