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
    const { question, answer, category, display_order, show_on_home, status } = body;
    await sql`
      UPDATE faqs SET
        question = ${question},
        answer = ${answer},
        category = ${category || null},
        display_order = ${display_order || 0},
        show_on_home = ${!!show_on_home},
        status = ${status || 'published'},
        updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath('/');
    revalidatePath('/faqs');
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
    await sql`DELETE FROM faqs WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/faqs');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
