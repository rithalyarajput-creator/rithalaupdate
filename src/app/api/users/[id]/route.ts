import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  const displayName = body.display_name ?? null;
  const password = body.password ? String(body.password) : '';

  if (password) {
    if (password.length < 6) return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash(password, 10);
    await sql`UPDATE users SET display_name = ${displayName}, password_hash = ${hash}, updated_at = NOW() WHERE id = ${id}`;
  } else {
    await sql`UPDATE users SET display_name = ${displayName}, updated_at = NOW() WHERE id = ${id}`;
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);

  // Don't allow deleting last user
  const countRes = await sql<{ n: number }>`SELECT COUNT(*)::int AS n FROM users`;
  if (Number(countRes.rows[0].n) <= 1) {
    return NextResponse.json({ error: 'Cannot delete the last admin user' }, { status: 400 });
  }
  // Don't allow deleting self
  const selfRes = await sql<{ email: string }>`SELECT email FROM users WHERE id = ${id}`;
  if (selfRes.rows[0]?.email === session.email) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  await sql`DELETE FROM users WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
