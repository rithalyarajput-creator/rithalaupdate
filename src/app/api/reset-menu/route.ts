// One-shot endpoint to reset the header/footer menus to current defaults.
// Requires admin login. Hit GET /api/reset-menu while logged in.

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';

const HEADER = [
  { label: 'Home', url: '/' },
  { label: 'Blog', url: '/blog/' },
  { label: 'History', url: '/rithala-village-history/' },
  { label: 'Photos', url: '/photos/' },
  {
    label: 'About', url: '/about/', children: [
      { label: 'About Us', url: '/about/' },
      { label: 'About Me', url: '/sandeep-rajput/' },
    ],
  },
  { label: 'Contact Us', url: '/contact/' },
];

const FOOTER = [
  { label: 'Home', url: '/' },
  { label: 'Blog', url: '/blog/' },
  { label: 'About', url: '/about/' },
  { label: 'Contact', url: '/contact/' },
];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized — log into /admin first' }, { status: 401 });

  await sql`
    INSERT INTO settings (key, value)
    VALUES ('header_menu_json', ${JSON.stringify(HEADER)})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  await sql`
    INSERT INTO settings (key, value)
    VALUES ('footer_menu_json', ${JSON.stringify(FOOTER)})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;

  // Revalidate every known page so the new menu is picked up immediately
  const pathsToRevalidate = [
    '/', '/blog', '/blog/[slug]', '/rithala-village-history', '/photos',
    '/about', '/sandeep-rajput', '/contact', '/contact-location', '/reels',
    '/category/[slug]', '/[...slug]',
  ];
  for (const p of pathsToRevalidate) {
    try { revalidatePath(p, 'page'); } catch {}
  }
  try { revalidatePath('/', 'layout'); } catch {}

  return NextResponse.json({
    ok: true,
    message: 'Header and footer menus reset. ALL pages revalidated. Hard-refresh the site now.',
    header: HEADER,
    footer: FOOTER,
  });
}
