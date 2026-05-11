import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.name || !body.slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
  try {
    const r = await sql<{ id: number }>`
      INSERT INTO photo_categories (name, slug) VALUES (${body.name}, ${body.slug}) RETURNING id
    `;
    return NextResponse.json({ id: r.rows[0].id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}
