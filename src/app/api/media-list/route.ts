import { NextResponse } from 'next/server';
import { getAllMedia } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const media = await getAllMedia(200).catch(() => []);
  return NextResponse.json({ media });
}
