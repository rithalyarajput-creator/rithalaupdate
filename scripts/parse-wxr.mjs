// Parse the WordPress eXtended RSS (WXR) export and produce JSON files
// the Astro site consumes at build time. This intentionally keeps the
// original WordPress URL slugs/paths so SEO ranking is preserved.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const XML_PATH = resolve(ROOT, 'wordpress-export.xml');
const OUT_DIR = resolve(ROOT, 'src/data');

mkdirSync(OUT_DIR, { recursive: true });

const xml = readFileSync(XML_PATH, 'utf8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  trimValues: false,
  parseTagValue: false,
  parseAttributeValue: false,
  textNodeName: '#text',
});

const data = parser.parse(xml);

const channel = data.rss.channel;

function unwrap(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(unwrap).join('');
  if (typeof value === 'object') {
    if ('__cdata' in value) return unwrap(value.__cdata);
    if ('#text' in value) return unwrap(value['#text']);
    return '';
  }
  return String(value);
}

function asArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function pathFromLink(link) {
  if (!link) return '/';
  try {
    const u = new URL(link);
    let p = u.pathname;
    if (!p.endsWith('/')) p += '/';
    return p;
  } catch {
    return link.endsWith('/') ? link : link + '/';
  }
}

const channelTitle = unwrap(channel.title) || 'Rithala Update';
const channelDescription = unwrap(channel.description) || '';
const channelLink = unwrap(channel.link) || 'https://rithalaupdate.wordpress.com';

// Categories
const categories = asArray(channel['wp:category']).map((c) => ({
  id: unwrap(c['wp:term_id']),
  slug: unwrap(c['wp:category_nicename']),
  name: unwrap(c['wp:cat_name']),
  parent: unwrap(c['wp:category_parent']),
  description: unwrap(c['wp:category_description']),
}));

const tags = asArray(channel['wp:tag']).map((t) => ({
  id: unwrap(t['wp:term_id']),
  slug: unwrap(t['wp:tag_slug']),
  name: unwrap(t['wp:tag_name']),
  description: unwrap(t['wp:tag_description']),
}));

// Items
const allItems = asArray(channel.item).map((i) => {
  const postmetaArr = asArray(i['wp:postmeta']).map((m) => ({
    key: unwrap(m['wp:meta_key']),
    value: unwrap(m['wp:meta_value']),
  }));
  const postmeta = Object.fromEntries(postmetaArr.map((m) => [m.key, m.value]));

  const cats = asArray(i.category)
    .map((c) => {
      if (typeof c === 'string') return { domain: 'category', nicename: '', name: c };
      return {
        domain: c['@_domain'] || '',
        nicename: c['@_nicename'] || '',
        name: unwrap(c),
      };
    })
    .filter((c) => c.domain === 'category');

  const tagList = asArray(i.category)
    .filter((c) => typeof c !== 'string' && c['@_domain'] === 'post_tag')
    .map((c) => ({ nicename: c['@_nicename'] || '', name: unwrap(c) }));

  return {
    id: Number(unwrap(i['wp:post_id'])) || 0,
    title: unwrap(i.title),
    link: unwrap(i.link),
    pubDate: unwrap(i.pubDate),
    creator: unwrap(i['dc:creator']),
    description: unwrap(i.description),
    content: unwrap(i['content:encoded']),
    excerpt: unwrap(i['excerpt:encoded']),
    postDate: unwrap(i['wp:post_date']),
    postDateGmt: unwrap(i['wp:post_date_gmt']),
    postModified: unwrap(i['wp:post_modified']),
    postName: unwrap(i['wp:post_name']),
    status: unwrap(i['wp:status']),
    postType: unwrap(i['wp:post_type']),
    parent: Number(unwrap(i['wp:post_parent'])) || 0,
    attachmentUrl: unwrap(i['wp:attachment_url']),
    categories: cats,
    tags: tagList,
    postmeta,
    path: pathFromLink(unwrap(i.link)),
  };
});

// Filter only what we render
const posts = allItems
  .filter((i) => i.postType === 'post' && i.status === 'publish')
  .sort((a, b) => new Date(b.postDateGmt) - new Date(a.postDateGmt));

const pages = allItems.filter((i) => i.postType === 'page' && i.status === 'publish');

const attachments = allItems.filter((i) => i.postType === 'attachment');

// Build attachment lookup by id and by url
const attachmentsById = Object.fromEntries(
  attachments.map((a) => [a.id, a])
);

// Resolve featured image url for each post
function getFeaturedImage(item) {
  const thumbId = item.postmeta && item.postmeta._thumbnail_id;
  if (thumbId && attachmentsById[Number(thumbId)]) {
    return attachmentsById[Number(thumbId)].attachmentUrl;
  }
  return '';
}

posts.forEach((p) => (p.featuredImage = getFeaturedImage(p)));
pages.forEach((p) => (p.featuredImage = getFeaturedImage(p)));

// Group posts by category nicename
const postsByCategory = {};
for (const p of posts) {
  for (const c of p.categories) {
    if (!c.nicename) continue;
    (postsByCategory[c.nicename] ||= []).push(p.id);
  }
}

const out = {
  site: {
    title: channelTitle,
    description: channelDescription,
    link: channelLink,
  },
  categories,
  tags,
  posts,
  pages,
  attachments: attachments.map((a) => ({
    id: a.id,
    url: a.attachmentUrl,
    title: a.title,
    parent: a.parent,
    postName: a.postName,
  })),
  postsByCategory,
};

writeFileSync(resolve(OUT_DIR, 'wxr.json'), JSON.stringify(out, null, 2));

console.log(
  `Parsed WXR: ${posts.length} posts, ${pages.length} pages, ${categories.length} categories, ${attachments.length} attachments.`
);
