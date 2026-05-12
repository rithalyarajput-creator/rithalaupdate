// Header + footer wrapper used by every public page.
// Pulls logo, header menu, footer, and social links from settings table.

import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { getAllSettings } from '@/lib/db';
import SiteFooter from './SiteFooter';
import HeaderClient from './HeaderClient';

type MenuItem = { label: string; url: string; children?: MenuItem[] };

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
];

export default async function PublicShell({ children }: { children: React.ReactNode }) {
  noStore(); // always fetch the latest settings — header/footer reflect changes instantly
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));
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
        <div className="header-bg-pattern" aria-hidden="true"></div>
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label={`${siteTitle} home`}>
            <div className="logo-wrap">
              <img src={logoUrl} alt={`${siteTitle} Logo`} />
            </div>
            <div className="brand-text-block">
              <span className="brand-text">{siteTitle}</span>
              <span className="brand-tag">Rajput Heritage</span>
            </div>
          </Link>

          <div className="connect-block">
            <div className="header-top-row">
              <span className="connect-tagline">"Connect With Us"</span>
              <div className="social-icons">
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="social-ig">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 8.5 2.6 8.9 2.6 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3c2.7 0 5 2.3 5 5s-2.3 5-5 5-5-2.3-5-5 2.3-5 5-5zm0 8.2c1.8 0 3.2-1.4 3.2-3.2S13.8 8.8 12 8.8 8.8 10.2 8.8 12s1.4 3.2 3.2 3.2zm6.4-8.4c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2z"/></svg>
                  </a>
                )}
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="social-fb">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/></svg>
                  </a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="social-yt">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.5.5c-1 .3-1.8 1-2 2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.5c1-.3 1.8-1 2-2 .5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                  </a>
                )}
                {settings.social_pinterest && (
                  <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest" className="social-pn">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.1 9.4 7.6 11.2-.1-.9-.2-2.4 0-3.5.2-.9 1.4-5.7 1.4-5.7s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-5-5.1-5-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2.2.9 2.8.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.4 3 7.4 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1 2.5-1.5 3.4 1.1.4 2.3.5 3.5.5 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0z"/></svg>
                  </a>
                )}
                {(settings.social_email || settings.contact_email) && (
                  <a href={`mailto:${settings.social_email || settings.contact_email}`} aria-label="Email" className="social-email">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </a>
                )}
              </div>
              <HeaderClient />
            </div>
          </div>
        </div>
      </header>

      <nav className="nav-wrap" aria-label="Main">
        <div className="main-nav">
          {menu.map((item, i) => {
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            return (
              <div key={i} className={hasChildren ? 'nav-item has-dropdown' : 'nav-item'}>
                <Link href={item.url}>
                  {item.label}
                  {hasChildren && <span className="dropdown-arrow">▾</span>}
                </Link>
                {hasChildren && (
                  <div className="dropdown-menu">
                    {item.children!.map((child, j) => (
                      <Link key={j} href={child.url}>{child.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <main>{children}</main>

      <SiteFooter
        settings={settings}
        footerMenu={footerMenu}
        logoUrl={logoUrl}
        siteTitle={siteTitle}
      />
    </>
  );
}
