import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }
  if (!body.video_url && !body.youtube_url && !body.instagram_url) {
    return NextResponse.json({ error: 'At least one of Video, YouTube, or Instagram URL is required' }, { status: 400 });
  }
  const r = await sql<{ id: number }>`
    INSERT INTO reels (
      title, instagram_url, video_url, youtube_url, click_url,
      thumbnail_url, description, display_order, is_featured, status
    )
    VALUES (
      ${body.title}, ${body.instagram_url || null}, ${body.video_url || null},
      ${body.youtube_url || null}, ${body.click_url || null},
      ${body.thumbnail_url || null}, ${body.description || null},
      ${body.display_order || 0}, ${!!body.is_featured}, ${body.status || 'published'}
    )
    RETURNING id
  `;
  revalidatePath('/');
  revalidatePath('/reels/');
  return NextResponse.json({ id: r.rows[0].id });
}
