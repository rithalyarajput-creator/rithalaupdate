import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, topic, image_url, video_link, content } = body;
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }
    await sql`
      INSERT INTO guest_submissions (name, email, phone, topic, image_url, video_link, content)
      VALUES (
        ${name.trim()},
        ${email?.trim() || null},
        ${phone?.trim() || null},
        ${topic?.trim() || null},
        ${image_url?.trim() || null},
        ${video_link?.trim() || null},
        ${content?.trim() || null}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await sql`UPDATE guest_submissions SET is_read = TRUE WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await sql`DELETE FROM guest_submissions WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const r = await sql`
      SELECT * FROM guest_submissions ORDER BY created_at DESC
    `;
    return NextResponse.json({ submissions: r.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
