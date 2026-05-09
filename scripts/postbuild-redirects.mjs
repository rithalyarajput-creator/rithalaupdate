// Generates `dist/_redirects` (Cloudflare Pages / Netlify) lines for any
// WordPress URL aliases that didn't get a static page. Currently the
// catch-all route already builds both `/full/path/` and `/{post_name}/`
// pages for posts/pages, so this file mainly exists to ensure the user-
// authored `_redirects` from `public/` is preserved.
//
// If you want to add additional 301 redirects after build (for example
// when retiring legacy URLs), append them to the file here.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const file = resolve(dist, '_redirects');

let body = '';
if (existsSync(file)) {
  body = readFileSync(file, 'utf8');
}

const extra = `
# Auto-generated tail
# (intentionally empty — extend as needed)
`;

if (!body.includes('Auto-generated tail')) {
  writeFileSync(file, body + extra);
  console.log('postbuild-redirects: appended generated tail to dist/_redirects');
} else {
  console.log('postbuild-redirects: tail already present, skipping');
}
