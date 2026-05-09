// robots.txt — allow all + reference sitemap
export async function GET({ site }) {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap.xml', site).href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
