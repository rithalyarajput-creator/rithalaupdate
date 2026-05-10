import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  const updates: string[] = [];

  if (body.status !== undefined) {
    await sql`UPDATE leads SET status = ${body.status}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (body.notes !== undefined) {
    await sql`UPDATE leads SET notes = ${body.notes}, updated_at = NOW() WHERE id = ${id}`;
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  await sql`DELETE FROM leads WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
