// Idempotent migration endpoint — runs schema-v2 (extra tables/columns).
// Protected by ADMIN_SETUP_TOKEN. Safe to run multiple times.

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const expected = process.env.ADMIN_SETUP_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const results: string[] = [];
  const run = async (label: string, q: Promise<unknown>) => {
    try {
      await q;
      results.push(`✓ ${label}`);
    } catch (e: any) {
      results.push(`✗ ${label}: ${e.message}`);
    }
  };

  // Posts SEO columns
  await run('posts.meta_title', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT`);
  await run('posts.meta_description', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT`);
  await run('posts.og_image', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image TEXT`);
  await run('posts.focus_keyword', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(200)`);
  await run('posts.canonical_url', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url TEXT`);
  await run('posts.noindex', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT FALSE`);

  // Media improvements
  await run('media.alt_text', sql`ALTER TABLE media ADD COLUMN IF NOT EXISTS alt_text TEXT`);
  await run('media.caption', sql`ALTER TABLE media ADD COLUMN IF NOT EXISTS caption TEXT`);
  await run('media.title', sql`ALTER TABLE media ADD COLUMN IF NOT EXISTS title VARCHAR(255)`);

  // Leads table
  await run('leads table', sql`
    CREATE TABLE IF NOT EXISTS leads (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255),
      phone       VARCHAR(50),
      subject     VARCHAR(500),
      message     TEXT NOT NULL,
      source      VARCHAR(100) DEFAULT 'contact_form',
      status      VARCHAR(20) DEFAULT 'new',
      ip_address  VARCHAR(50),
      user_agent  TEXT,
      notes       TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await run('leads index status', sql`CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status)`);
  await run('leads index date', sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC)`);

  // Reels table
  await run('reels table', sql`
    CREATE TABLE IF NOT EXISTS reels (
      id            SERIAL PRIMARY KEY,
      title         VARCHAR(500) NOT NULL,
      instagram_url TEXT NOT NULL,
      thumbnail_url TEXT,
      description   TEXT,
      display_order INTEGER DEFAULT 0,
      is_featured   BOOLEAN DEFAULT FALSE,
      status        VARCHAR(20) DEFAULT 'published',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await run('reels index status', sql`CREATE INDEX IF NOT EXISTS reels_status_idx ON reels(status)`);
  await run('reels index order', sql`CREATE INDEX IF NOT EXISTS reels_order_idx ON reels(display_order)`);

  // Default settings
  const defaults: [string, string][] = [
    ['site_logo_url', '/logo.png'],
    ['site_favicon_url', '/favicon.png'],
    ['site_footer_text', '© 2026 Rithala Update. All Rights Reserved.'],
    ['site_footer_about', 'Thank you for visiting Rithala Update. Share your photos and stories.'],
    ['contact_email', 'rithalyarajput@gmail.com'],
    ['contact_phone', ''],
    ['contact_address', 'Rithala Village, North-West Delhi, India'],
    ['header_menu_json', JSON.stringify([
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about/' },
      { label: 'History', url: '/category/history/' },
      { label: 'Events', url: '/category/events/' },
      { label: 'Places', url: '/category/places/' },
      { label: 'Brotherhood', url: '/category/brotherhood/' },
      { label: 'Kawad 2025', url: '/category/kawad-yatra-2025/' },
      { label: 'Reels', url: '/reels/' },
      { label: 'Contact', url: '/contact/' },
    ])],
    ['footer_menu_json', JSON.stringify([
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about/' },
      { label: 'Contact', url: '/contact/' },
    ])],
    ['seo_default_title', 'Rithala Update — Rajput Heritage, Temples, Festivals'],
    ['seo_default_description', 'Bhakti Reels, Rajput Culture & Temple Moments from Rithala Village, Delhi.'],
  ];

  for (const [key, value] of defaults) {
    await run(`settings.${key}`, sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `);
  }

  return NextResponse.json({ ok: true, results });
}
