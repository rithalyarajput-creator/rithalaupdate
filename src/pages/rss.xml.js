import rss from '@astrojs/rss';
import { posts, site } from '../lib/content.js';

export async function GET(context) {
  return rss({
    title: site.title || 'Rithala Update',
    description:
      site.description ||
      'Bhakti Reels, Rajput Culture & Temple Moments from Rithala Village, Delhi',
    site: context.site,
    items: posts.map((p) => ({
      link: p.path || `/${p.postName}/`,
      title: p.title,
      pubDate: new Date(p.postDateGmt || p.postDate || Date.now()),
      description: (p.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 280),
    })),
    customData: '<language>hi-IN</language>',
  });
}
