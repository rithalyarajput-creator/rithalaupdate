import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  await sql`
    UPDATE authors SET
      name = ${body.name},
      slug = ${body.slug},
      bio = ${body.bio || null},
      avatar_url = ${body.avatar_url || null},
      email = ${body.email || null},
      social_url = ${body.social_url || null}
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await sql`DELETE FROM authors WHERE id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
