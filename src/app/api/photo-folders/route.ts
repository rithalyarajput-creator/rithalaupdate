import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.category_id || !body.name || !body.slug) {
    return NextResponse.json({ error: 'category_id, name, slug required' }, { status: 400 });
  }
  try {
    const r = await sql<{ id: number }>`
      INSERT INTO photo_folders (category_id, name, slug, cover_url, description)
      VALUES (${body.category_id}, ${body.name}, ${body.slug}, ${body.cover_url || null}, ${body.description || null})
      RETURNING id
    `;
    revalidatePath('/photos');
    return NextResponse.json({ id: r.rows[0].id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}
