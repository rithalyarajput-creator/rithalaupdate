import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'name and slug required' }, { status: 400 });
  }
  await sql`
    UPDATE photo_categories
    SET name = ${body.name}, slug = ${body.slug}
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await sql`DELETE FROM photo_categories WHERE id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
