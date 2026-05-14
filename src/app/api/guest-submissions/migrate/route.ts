import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS guest_submissions (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(200) NOT NULL,
        email      VARCHAR(255),
        phone      VARCHAR(50),
        topic      VARCHAR(300),
        image_url  TEXT,
        video_link TEXT,
        content    TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    return NextResponse.json({ ok: true, message: 'guest_submissions table ready' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
