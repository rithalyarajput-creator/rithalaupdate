import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

  try {
    const body = await req.json();
    const { name, message, rating, location, avatar_url, status } = body;
    await sql`
      UPDATE testimonials SET
        name = COALESCE(${name}, name),
        message = COALESCE(${message}, message),
        rating = COALESCE(${rating}, rating),
        location = COALESCE(${location}, location),
        avatar_url = COALESCE(${avatar_url}, avatar_url),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

  try {
    await sql`DELETE FROM testimonials WHERE id = ${id}`;
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
