import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import Icon from './Icon';

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
    'Thank you for visiting Rithala Update. Share your photos and stories.';
  const copyrightText =
    settings.site_footer_text ||
    '© 2026 Rithala Update. All Rights Reserved. Designed by Sandeep Rajput.';
  const contactEmail =
    settings.contact_email || settings.social_email || 'rithalyarajput@gmail.com';

  const defaultFooterMenu: MenuItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Blog', url: '/blog/' },
    { label: 'History', url: '/rithala-village-history/' },
    { label: 'Photos', url: '/photos/' },
    { label: 'About', url: '/about/' },
    { label: 'Contact', url: '/contact/' },
  ];
  const menu = footerMenu.length > 0 ? footerMenu : defaultFooterMenu;

  return (
    <footer className="site-footer-v3">
      <div className="ftr3-decor" aria-hidden="true">
        <span className="ftr3-glow ftr3-glow-1"></span>
        <span className="ftr3-glow ftr3-glow-2"></span>
      </div>

      <div className="container ftr3-main">
        {/* LEFT: Brand + about */}
        <div className="ftr3-col ftr3-col-brand">
          <Link href="/" className="ftr3-brand">
            <div className="ftr3-logo">
              <img src={logoUrl} alt={`${siteTitle} logo`} />
            </div>
            <div>
              <div className="ftr3-brand-name">{siteTitle}</div>
              <div className="ftr3-brand-tag">Jai Rajputana</div>
            </div>
          </Link>
          <p className="ftr3-about">{aboutText}</p>
          <div className="ftr3-social">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="ftr3-soc-ig">
                <Icon name="instagram" size={16} />
              </a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="ftr3-soc-fb">
                <Icon name="facebook" size={16} />
              </a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="ftr3-soc-yt">
                <Icon name="youtube" size={18} />
              </a>
            )}
            {settings.social_pinterest && (
              <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest" className="ftr3-soc-pn">
                <Icon name="pinterest" size={16} />
              </a>
            )}
          </div>
        </div>

        {/* CENTER 1: Quick Links */}
        <div className="ftr3-col ftr3-col-links">
          <details className="ftr3-accordion" open>
            <summary className="ftr3-heading ftr3-accordion-summary">
              Quick Links <span className="ftr3-acc-arrow"></span>
            </summary>
            <ul className="ftr3-menu">
              <li><Link href="/"><span className="ftr3-arrow"></span>Home</Link></li>
              <li><Link href="/blog/"><span className="ftr3-arrow"></span>Blog</Link></li>
              <li><Link href="/rithala-village-history/"><span className="ftr3-arrow"></span>History</Link></li>
              <li><Link href="/about/"><span className="ftr3-arrow"></span>About</Link></li>
              <li><Link href="/contact/"><span className="ftr3-arrow"></span>Contact</Link></li>
            </ul>
          </details>
        </div>

        {/* CENTER 2: More Links */}
        <div className="ftr3-col ftr3-col-links">
          <details className="ftr3-accordion" open>
            <summary className="ftr3-heading ftr3-accordion-summary">
              More <span className="ftr3-acc-arrow"></span>
            </summary>
            <ul className="ftr3-menu">
              <li><Link href="/photos/"><span className="ftr3-arrow"></span>Photos</Link></li>
              <li><Link href="/reels/"><span className="ftr3-arrow"></span>Reels</Link></li>
              <li><Link href="/faqs/"><span className="ftr3-arrow"></span>FAQs</Link></li>
              <li><Link href="/sandeep-rajput/"><span className="ftr3-arrow"></span>About Me</Link></li>
            </ul>
          </details>
          {settings.contact_phone && (
            <div className="ftr3-contact-mini">
              <p>
                <Icon name="phone" size={13} />
                <a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Newsletter */}
        <div className="ftr3-col ftr3-col-newsletter">
          <h3 className="ftr3-heading">
            <Icon name="mail" size={16} /> Subscribe
          </h3>
          <p className="ftr3-newsletter-line">
            हमारी latest stories, photos और updates सीधे अपने inbox में पाएँ।
          </p>
          <NewsletterForm />
          <p className="ftr3-newsletter-foot">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <div className="ftr3-bottom">
        <div className="container ftr3-bottom-row">
          <p className="ftr3-copyright">{copyrightText}</p>
          <p className="ftr3-credits">
            Built with <Icon name="heart" size={13} /> in Rithala Village
            <Icon name="flag" size={13} />
          </p>
        </div>
      </div>
    </footer>
  );
}
