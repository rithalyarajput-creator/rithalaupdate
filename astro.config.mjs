import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// Update SITE to your final domain. Default uses custom domain you confirmed.
const SITE = process.env.SITE_URL || 'https://rithalaupdate.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',

  build: {
    format: 'directory',
    assets: 'assets',
  },

  // We generate sitemap.xml ourselves at src/pages/sitemap.xml.js so we
  // can include canonical Hindi URLs (the @astrojs/sitemap plugin has
  // issues encoding non-ASCII URLs in some Astro versions).
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  output: "hybrid",
  adapter: cloudflare()
});