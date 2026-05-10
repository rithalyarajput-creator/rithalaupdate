// Header + footer wrapper used by every public page.
// Pulls logo, header menu, footer, and social links from settings table.

import Link from 'next/link';
import { getAllSettings } from '@/lib/db';

type MenuItem = { label: string; url: string };

function parseMenu(json: string | undefined): MenuItem[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const FALLBACK_HEADER: MenuItem[] = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about/' },
  { label: 'History', url: '/category/history/' },
  { label: 'Events', url: '/category/events/' },
  { label: 'Places', url: '/category/places/' },
  { label: 'Brotherhood', url: '/category/brotherhood/' },
  { label: 'Reels', url: '/reels/' },
  { label: 'Contact', url: '/contact/' },
];

export default async function PublicShell({ children }: { children: React.ReactNode }) {
  const settings = await getAllSettings().catch(() => ({} as Record<string, string>));
  const headerMenu = parseMenu(settings.header_menu_json);
  const footerMenu = parseMenu(settings.footer_menu_json);
  const menu = headerMenu.length > 0 ? headerMenu : FALLBACK_HEADER;

  const logoUrl = settings.site_logo_url || '/logo.png';
  const siteTitle = settings.site_title || 'Rithala Update';
  const footerText = settings.site_footer_text || '© 2026 Rithala Update. All Rights Reserved.';
  const footerAbout = settings.site_footer_about || 'Thank you for visiting Rithala Update.';

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label={`${siteTitle} home`}>
            <img src={logoUrl} alt={`${siteTitle} Logo`} width={44} height={44} />
            <span className="brand-text">{siteTitle}</span>
          </Link>
          <div className="social-icons">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener" title="Instagram">IG</a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener" title="YouTube">YT</a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener" title="Facebook">FB</a>
            )}
            {settings.social_pinterest && (
              <a href={settings.social_pinterest} target="_blank" rel="noopener" title="Pinterest">PN</a>
            )}
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} title="Email">@</a>
            )}
          </div>
        </div>
      </header>
      <nav className="nav-wrap" aria-label="Main">
        <div className="main-nav">
          {menu.map((item, i) => (
            <Link key={i} href={item.url}>{item.label}</Link>
          ))}
        </div>
      </nav>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <img src={logoUrl} alt={siteTitle} width={100} style={{ borderRadius: '50%' }} />
              {footerMenu.length > 0 && (
                <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
                  {footerMenu.map((item, i) => (
                    <span key={i}>
                      {i > 0 && ' · '}
                      <Link href={item.url}>{item.label}</Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
            <div>
              <h3>🚩 Jai Rajputana!</h3>
              <p style={{ fontSize: '0.9rem' }}>{footerAbout}</p>
              {settings.contact_email && (
                <p style={{ fontSize: '0.85rem' }}>
                  📧 <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
                </p>
              )}
            </div>
            <div>
              <h3>Connect</h3>
              <p>
                {settings.social_instagram && (
                  <><a href={settings.social_instagram} target="_blank" rel="noopener">Instagram</a><br /></>
                )}
                {settings.social_youtube && (
                  <><a href={settings.social_youtube} target="_blank" rel="noopener">YouTube</a><br /></>
                )}
                {settings.social_facebook && (
                  <><a href={settings.social_facebook} target="_blank" rel="noopener">Facebook</a><br /></>
                )}
                {settings.social_pinterest && (
                  <><a href={settings.social_pinterest} target="_blank" rel="noopener">Pinterest</a></>
                )}
              </p>
            </div>
          </div>
          <div className="footer-bottom">{footerText}</div>
        </div>
      </footer>
    </>
  );
}
