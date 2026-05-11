import Link from 'next/link';

type MenuItem = { label: string; url: string };

export default function SiteFooter({
  settings,
  footerMenu,
  logoUrl,
  siteTitle,
}: {
  settings: Record<string, string>;
  footerMenu: MenuItem[];
  logoUrl: string;
  siteTitle: string;
}) {
  const aboutText =
    settings.site_footer_about ||
    'Thank you for visiting Rithala Update, a humble effort to honor our village\'s proud Rajput heritage, sacred temples, and timeless traditions. If you have photos, stories, or any information about Rithala Village, kindly share them at rithalyarajput@gmail.com to help preserve and celebrate our rich cultural legacy online.';
  const copyrightText =
    settings.site_footer_text ||
    '© 2026 Rithala Update. All Rights Reserved. Designed by Sandeep Rajput.';
  const contactEmail =
    settings.contact_email || settings.social_email || 'rithalyarajput@gmail.com';

  const defaultFooterMenu: MenuItem[] = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about/' },
    { label: 'History', url: '/rithala-village-history/' },
    { label: 'Reels', url: '/reels/' },
    { label: 'Contact', url: '/contact-location/' },
  ];
  const menu = footerMenu.length > 0 ? footerMenu : defaultFooterMenu;

  return (
    <footer className="site-footer-v2">
      <div className="ftr-decor" aria-hidden="true">
        <span className="ftr-glow ftr-glow-1"></span>
        <span className="ftr-glow ftr-glow-2"></span>
      </div>

      <div className="container ftr-main">
        {/* LEFT: Brand */}
        <div className="ftr-col ftr-col-brand">
          <Link href="/" className="ftr-brand">
            <div className="ftr-logo">
              <img src={logoUrl} alt={`${siteTitle} logo`} />
            </div>
            <div>
              <div className="ftr-brand-name">{siteTitle}</div>
              <div className="ftr-brand-tag">🚩 Jai Rajputana</div>
            </div>
          </Link>
          <p className="ftr-brand-line">
            Honoring 640+ years of Rithala heritage —
            Rajput culture, sacred temples, and timeless traditions.
          </p>
          <div className="ftr-newsletter">
            <p className="ftr-newsletter-label">📬 Subscribe for updates</p>
            <form
              action={`mailto:${contactEmail}`}
              method="post"
              encType="text/plain"
              className="ftr-newsletter-form"
            >
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                aria-label="Email address"
              />
              <button type="submit">Join →</button>
            </form>
          </div>
        </div>

        {/* CENTER: About */}
        <div className="ftr-col ftr-col-center">
          <h3 className="ftr-heading">
            <span>🚩</span> Jai Rajputana!
          </h3>
          <p className="ftr-about">{aboutText}</p>
        </div>

        {/* RIGHT: Menu + Social */}
        <div className="ftr-col ftr-col-right">
          <h3 className="ftr-heading">Quick Links</h3>
          <ul className="ftr-menu">
            {menu.map((item, i) => (
              <li key={i}>
                <Link href={item.url}>
                  <span className="ftr-arrow">›</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="ftr-heading ftr-heading-social">Follow Us</h3>
          <div className="ftr-social">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="ftr-social-ig">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.6c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm0 10.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6.4-8.4c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2z"/></svg>
              </a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="ftr-social-fb">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/></svg>
              </a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="ftr-social-yt">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.5.5c-1 .3-1.8 1-2 2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.5c1-.3 1.8-1 2-2 .5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
              </a>
            )}
            {settings.social_pinterest && (
              <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest" className="ftr-social-pn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.1 9.4 7.6 11.2-.1-.9-.2-2.4 0-3.5.2-.9 1.4-5.7 1.4-5.7s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-5-5.1-5-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2.2.9 2.8.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.4 3 7.4 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1 2.5-1.5 3.4 1.1.4 2.3.5 3.5.5 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0z"/></svg>
              </a>
            )}
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} aria-label="Email" className="ftr-social-em">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            )}
          </div>

          <div className="ftr-contact-mini">
            <p>📧 <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
            {settings.contact_phone && <p>📞 <a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a></p>}
          </div>
        </div>
      </div>

      <div className="ftr-bottom">
        <div className="container ftr-bottom-row">
          <p className="ftr-copyright">{copyrightText}</p>
          <p className="ftr-credits">
            Built with ❤️ in Rithala Village
            <span className="ftr-flag">🚩</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
