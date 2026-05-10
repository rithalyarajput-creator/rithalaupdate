// PUT /api/media/:id — update alt_text, caption, title
// DELETE /api/media/:id — remove (DB only; blob remains in storage)

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { del } from '@vercel/blob';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();
  await sql`
    UPDATE media SET
      alt_text = ${body.alt_text || null},
      caption = ${body.caption || null},
      title = ${body.title || null}
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  const r = await sql<{ url: string }>`SELECT url FROM media WHERE id = ${id}`;
  const url = r.rows[0]?.url;
  await sql`DELETE FROM media WHERE id = ${id}`;
  // Try to delete from Blob storage too
  if (url && process.env.BLOB_READ_WRITE_TOKEN) {
    try { await del(url); } catch {}
  }
  return NextResponse.json({ ok: true });
}
