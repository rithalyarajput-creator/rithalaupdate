// POST /api/upload — uploads an image to Vercel Blob storage and
// returns the public URL + saved media row.

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN not set. Enable Vercel Blob in your project (Storage → Create → Blob).' },
      { status: 500 }
    );
  }

  const fd = await req.formData();
  const file = fd.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const filename = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  try {
    const blob = await put(filename, file, { access: 'public' });
    const r = await sql<{ id: number }>`
      INSERT INTO media (url, filename, mime_type, size_bytes, uploaded_by)
      VALUES (${blob.url}, ${file.name}, ${file.type}, ${file.size}, ${session.userId})
      RETURNING id
    `;
    return NextResponse.json({ id: r.rows[0].id, url: blob.url, filename: file.name });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
