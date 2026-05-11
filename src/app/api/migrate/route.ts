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

  // Authors table
  await run('authors table', sql`
    CREATE TABLE IF NOT EXISTS authors (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      slug        VARCHAR(200) UNIQUE NOT NULL,
      bio         TEXT,
      avatar_url  TEXT,
      email       VARCHAR(255),
      social_url  TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Photo categories (separate from blog categories)
  await run('photo_categories table', sql`
    CREATE TABLE IF NOT EXISTS photo_categories (
      id          SERIAL PRIMARY KEY,
      slug        VARCHAR(200) UNIQUE NOT NULL,
      name        VARCHAR(200) NOT NULL,
      description TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Photos
  await run('photos table', sql`
    CREATE TABLE IF NOT EXISTS photos (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(300),
      image_url   TEXT NOT NULL,
      alt_text    TEXT,
      caption     TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // photo <-> category many-to-many
  await run('photo_photo_categories table', sql`
    CREATE TABLE IF NOT EXISTS photo_photo_categories (
      photo_id    INTEGER REFERENCES photos(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES photo_categories(id) ON DELETE CASCADE,
      PRIMARY KEY (photo_id, category_id)
    )
  `);

  // Photo folders (collections inside a category, e.g. 'Holi 2025')
  await run('photo_folders table', sql`
    CREATE TABLE IF NOT EXISTS photo_folders (
      id          SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES photo_categories(id) ON DELETE CASCADE,
      name        VARCHAR(200) NOT NULL,
      slug        VARCHAR(200) NOT NULL,
      cover_url   TEXT,
      description TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (category_id, slug)
    )
  `);
  await run('photos.folder_id column', sql`
    ALTER TABLE photos ADD COLUMN IF NOT EXISTS folder_id INTEGER REFERENCES photo_folders(id) ON DELETE SET NULL
  `);

  // Seed default photo categories
  const photoCats: [string, string][] = [
    ['kawad-yatra-2025', 'Kawad Yatra 2025'],
    ['kawad-yatra-2024', 'Kawad Yatra 2024'],
    ['festivals', 'Festivals'],
    ['temples', 'Temples'],
    ['village-life', 'Village Life'],
  ];
  for (const [slug, name] of photoCats) {
    await run(`photo_categories.${slug}`, sql`
      INSERT INTO photo_categories (slug, name) VALUES (${slug}, ${name})
      ON CONFLICT (slug) DO NOTHING
    `);
  }

  // Posts: author_name (display) and scheduled_at
  await run('posts.author_name', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_name VARCHAR(200)`);
  await run('posts.scheduled_at', sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ`);

  // Default author
  await run('default author', sql`
    INSERT INTO authors (name, slug, bio, email)
    VALUES ('Sandeep Rajput', 'sandeep-rajput', 'Founder & writer at Rithala Update — sharing the heritage of Rithala village.', 'rithalyarajput@gmail.com')
    ON CONFLICT (slug) DO NOTHING
  `);

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
