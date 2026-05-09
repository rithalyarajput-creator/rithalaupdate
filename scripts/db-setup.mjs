// Initialise the database: create tables, seed default categories,
// create the initial admin user, and migrate posts from the WordPress
// XML export (rithala-wxr.xml in /scripts/) into the new schema.
//
// Run this ONCE locally after `vercel env pull .env.local`:
//   node scripts/db-setup.mjs
//
// Or in Vercel: paste the SQL from scripts/schema.sql into the Vercel
// Postgres "Query" tab, then run this script with the env vars set.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import { XMLParser } from 'fast-xml-parser';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('🚩 Rithala Update — Database setup\n');

  // 1. Schema
  console.log('1. Creating tables…');
  const schema = readFileSync(resolve(__dirname, 'schema.sql'), 'utf8');
  // Split on `;` and execute statements one by one (Postgres-safe)
  const statements = schema
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--'));
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log('   ✓ Schema ready\n');

  // 2. Seed categories
  console.log('2. Seeding categories…');
  const categories = [
    { slug: 'all-post', name: 'All Post' },
    { slug: 'brotherhood', name: 'Brotherhood' },
    { slug: 'events', name: 'Events' },
    { slug: 'history', name: 'History' },
    { slug: 'kawad-yatra-2024', name: 'Kawad Yatra 2024' },
    { slug: 'kawad-yatra-2025', name: 'Kawad Yatra 2025' },
    { slug: 'peoples', name: 'Peoples' },
    { slug: 'places', name: 'Places' },
  ];
  for (const c of categories) {
    await sql`
      INSERT INTO categories (slug, name)
      VALUES (${c.slug}, ${c.name})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log(`   ✓ ${categories.length} categories seeded\n`);

  // 3. Create initial admin user
  console.log('3. Creating admin user…');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rithalaupdate.online';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await sql`
    INSERT INTO users (email, password_hash, display_name, role)
    VALUES (${adminEmail}, ${passwordHash}, 'Rithalya Rajput', 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;
  const adminRow = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;
  const adminId = adminRow.rows[0].id;
  console.log(`   ✓ Admin: ${adminEmail} (id ${adminId})`);
  console.log(`   ✓ Password: ${adminPassword}\n`);

  // 4. Seed default settings
  console.log('4. Seeding default settings…');
  const settings = [
    ['site_title', 'Rithala Update'],
    ['site_description', 'Bhakti Reels, Rajput Culture & Temple Moments from Rithala Village, Delhi'],
    ['social_instagram', 'https://www.instagram.com/rithala_update/'],
    ['social_youtube', 'https://www.youtube.com/@rithala_update'],
    ['social_facebook', 'https://www.facebook.com/profile.php?id=61581104611697'],
    ['social_pinterest', 'https://in.pinterest.com/rithala_update/'],
    ['social_email', 'rithalyarajput@gmail.com'],
  ];
  for (const [key, value] of settings) {
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `;
  }
  console.log(`   ✓ ${settings.length} settings seeded\n`);

  // 5. Migrate WordPress XML posts
  console.log('5. Migrating WordPress posts…');
  const xmlPath = resolve(__dirname, 'rithala-wxr.xml');
  if (!existsSync(xmlPath)) {
    console.log('   (skipped — scripts/rithala-wxr.xml not found)\n');
  } else {
    const { migrated } = await migrateWXR(xmlPath, adminId);
    console.log(`   ✓ ${migrated} posts/pages imported\n`);
  }

  console.log('✅ Database ready!\n');
  console.log('   Admin URL:  http://localhost:3000/admin/login');
  console.log(`   Email:      ${adminEmail}`);
  console.log(`   Password:   ${adminPassword}`);
  console.log('\n   ⚠️  Change the password after first login!\n');

  process.exit(0);
}

async function migrateWXR(xmlPath, adminId) {
  const xml = readFileSync(xmlPath, 'utf8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
    parseTagValue: false,
  });
  const data = parser.parse(xml);
  const channel = data.rss.channel;

  function unwrap(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map(unwrap).join('');
    if (typeof v === 'object') {
      if ('__cdata' in v) return unwrap(v.__cdata);
      if ('#text' in v) return unwrap(v['#text']);
    }
    return '';
  }

  const items = Array.isArray(channel.item) ? channel.item : [channel.item];
  let migrated = 0;

  for (const item of items) {
    const postType = unwrap(item['wp:post_type']);
    const status = unwrap(item['wp:status']);
    if (status !== 'publish') continue;

    const title = unwrap(item.title);
    const content = unwrap(item['content:encoded']);
    const excerpt = unwrap(item['excerpt:encoded']);
    const postName = unwrap(item['wp:post_name']);
    const link = unwrap(item.link);
    const dateGmt = unwrap(item['wp:post_date_gmt']);
    const slug = postName || slugify(title, { lower: true, strict: true });

    // Find featured image via _thumbnail_id postmeta
    const postmeta = Array.isArray(item['wp:postmeta'])
      ? item['wp:postmeta']
      : item['wp:postmeta']
      ? [item['wp:postmeta']]
      : [];
    const thumbId = postmeta
      .map((m) => ({ key: unwrap(m['wp:meta_key']), value: unwrap(m['wp:meta_value']) }))
      .find((m) => m.key === '_thumbnail_id')?.value;

    let featured = '';
    if (thumbId) {
      const attachment = items.find(
        (i) => Number(unwrap(i['wp:post_id'])) === Number(thumbId)
      );
      if (attachment) {
        featured = unwrap(attachment['wp:attachment_url']);
      }
    }

    const legacyPath = link ? new URL(link).pathname : `/${slug}/`;
    const publishedAt = dateGmt ? new Date(dateGmt).toISOString() : new Date().toISOString();

    if (postType === 'post') {
      const { rows } = await sql`
        INSERT INTO posts (slug, title, excerpt, content, featured_image, author_id, status, published_at, legacy_path)
        VALUES (${slug}, ${title}, ${excerpt}, ${content}, ${featured}, ${adminId}, 'published', ${publishedAt}, ${legacyPath})
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          featured_image = EXCLUDED.featured_image,
          updated_at = NOW()
        RETURNING id
      `;
      const postId = rows[0].id;

      // Link categories
      const cats = Array.isArray(item.category) ? item.category : item.category ? [item.category] : [];
      for (const c of cats) {
        if (typeof c !== 'object') continue;
        if (c['@_domain'] !== 'category') continue;
        const slugC = c['@_nicename'];
        if (!slugC) continue;
        const catRow = await sql`SELECT id FROM categories WHERE slug = ${slugC}`;
        if (catRow.rows[0]) {
          await sql`
            INSERT INTO post_categories (post_id, category_id)
            VALUES (${postId}, ${catRow.rows[0].id})
            ON CONFLICT DO NOTHING
          `;
        }
      }
      migrated++;
    } else if (postType === 'page') {
      await sql`
        INSERT INTO pages (slug, title, content, featured_image, status)
        VALUES (${slug}, ${title}, ${content}, ${featured}, 'published')
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          updated_at = NOW()
      `;
      migrated++;
    }
  }

  return { migrated };
}

main().catch((err) => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});
