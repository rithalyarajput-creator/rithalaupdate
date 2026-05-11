import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const r = await sql`SELECT * FROM authors ORDER BY name`;
  return NextResponse.json({ authors: r.rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
  }
  try {
    const r = await sql<{ id: number }>`
      INSERT INTO authors (name, slug, bio, avatar_url, email, social_url)
      VALUES (${body.name}, ${body.slug}, ${body.bio || null}, ${body.avatar_url || null}, ${body.email || null}, ${body.social_url || null})
      RETURNING id
    `;
    return NextResponse.json({ id: r.rows[0].id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}
