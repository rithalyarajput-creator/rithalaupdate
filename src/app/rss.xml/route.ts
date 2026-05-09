import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/db';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export async function GET() {
  let posts: any[] = [];
  try { posts = await getPublishedPosts(50); } catch {}

  const items = posts.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE}/${encodeURIComponent(p.slug)}/</link>
      <guid isPermaLink="true">${SITE}/${encodeURIComponent(p.slug)}/</guid>
      <pubDate>${new Date(p.published_at || p.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${(p.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 280)}]]></description>
    </item>`).join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Rithala Update</title>
    <link>${SITE}/</link>
    <description>Bhakti Reels, Rajput Culture &amp; Temple Moments from Rithala Village, Delhi</description>
    <language>hi-IN</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
