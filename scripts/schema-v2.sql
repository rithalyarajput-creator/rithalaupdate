-- Rithala Update v2 — extended schema (run this AFTER schema.sql)
-- Adds: SEO fields, leads, reels, media improvements, settings expansion
-- Safe to run multiple times (uses IF NOT EXISTS / ALTER ADD COLUMN IF NOT EXISTS).

-- =============================
-- POSTS — add SEO fields
-- =============================
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(200);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT FALSE;

-- =============================
-- MEDIA — add alt text + caption
-- =============================
ALTER TABLE media ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- =============================
-- LEADS — contact form submissions
-- =============================
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
);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- =============================
-- REELS — Instagram reels / videos
-- =============================
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
);
CREATE INDEX IF NOT EXISTS reels_status_idx ON reels(status);
CREATE INDEX IF NOT EXISTS reels_order_idx ON reels(display_order);

-- =============================
-- SETTINGS — seed extended defaults
-- =============================
INSERT INTO settings (key, value) VALUES
  ('site_logo_url', '/logo.png'),
  ('site_favicon_url', '/favicon.png'),
  ('site_footer_text', '© 2026 Rithala Update. All Rights Reserved. Designed by Sandeep Rajput.'),
  ('site_footer_about', 'Thank you for visiting Rithala Update. Share your photos and stories.'),
  ('contact_email', 'rithalyarajput@gmail.com'),
  ('contact_phone', ''),
  ('contact_address', 'Rithala Village, North-West Delhi, India'),
  ('header_menu_json', '[{"label":"Home","url":"/"},{"label":"About","url":"/about/"},{"label":"History","url":"/category/history/"},{"label":"Events","url":"/category/events/"},{"label":"Places","url":"/category/places/"},{"label":"Brotherhood","url":"/category/brotherhood/"},{"label":"Kawad 2025","url":"/category/kawad-yatra-2025/"},{"label":"Reels","url":"/reels/"},{"label":"Contact","url":"/contact/"}]'),
  ('footer_menu_json', '[{"label":"Home","url":"/"},{"label":"About","url":"/about/"},{"label":"Contact","url":"/contact/"}]'),
  ('seo_default_title', 'Rithala Update — Rajput Heritage, Temples, Festivals'),
  ('seo_default_description', 'Rithala Update — Bhakti Reels, Rajput Culture & Temple Moments from Rithala Village, Delhi.'),
  ('seo_default_og_image', '')
ON CONFLICT (key) DO NOTHING;
