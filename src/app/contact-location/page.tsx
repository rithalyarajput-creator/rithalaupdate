import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import ContactForm from '../contact/ContactForm';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Contact Us — Rithala Update | Location, Email, Social Links',
  description:
    'Get in touch with Rithala Update. Email, location map, social media, and direct message form. हमसे जुड़ें।',
  alternates: { canonical: '/contact-location/' },
  openGraph: {
    title: 'Contact Rithala Update — Location & Social',
    description: 'Email, location, social links, and contact form.',
    url: `${SITE}/contact-location/`,
  },
};

export default async function ContactLocationPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));

  const email = settings.contact_email || 'rithalyarajput@gmail.com';
  const phone = settings.contact_phone || '+91-9355753533';
  const address = settings.contact_address || 'Rithala Village, North-West Delhi — 110085';

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.site_title || 'Rithala Update',
    image: settings.site_logo_url ? `${SITE}${settings.site_logo_url}` : `${SITE}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'New Delhi',
      addressRegion: 'Delhi',
      postalCode: '110085',
      addressCountry: 'IN',
    },
    email,
    telephone: phone || undefined,
    url: `${SITE}/contact-location/`,
    sameAs: [
      settings.social_instagram,
      settings.social_facebook,
      settings.social_youtube,
      settings.social_pinterest,
    ].filter(Boolean),
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />

      {/* HERO */}
      <section className="ct-hero">
        <div className="container">
          <span className="ct-hero-eyebrow">📞 Get in Touch</span>
          <h1 className="ct-hero-h1">
            हमसे संपर्क करें — <span className="ct-hero-grad">Contact Us</span>
          </h1>
          <p className="ct-hero-lead">
            कोई सवाल, कहानी, तस्वीर या सुझाव? हमें message भेजें — हम 24-48 घंटे में जवाब देंगे।
          </p>
        </div>
      </section>

      {/* MAIN PANEL */}
      <section className="ct-panel-section">
        <div className="container">
          <div className="ct-panel">
            {/* LEFT: Dark info panel */}
            <div className="ct-panel-left">
              <div className="ct-panel-decor" aria-hidden="true">
                <span className="ct-decor-circle ct-decor-1"></span>
                <span className="ct-decor-circle ct-decor-2"></span>
              </div>

              <h2 className="ct-info-h2">Contact Information</h2>
              <p className="ct-info-sub">
                हम Monday से Sunday तक उपलब्ध हैं। आपका हर message हमारी admin inbox में जाएगा और
                <strong> 24-48 घंटे </strong>में जवाब दिया जाएगा।
              </p>

              <ul className="ct-info-list">
                <li>
                  <span className="ct-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <div>
                    <small>PHONE</small>
                    <a href={`tel:${phone}`}>{phone}</a>
                  </div>
                </li>
                <li>
                  <span className="ct-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <div>
                    <small>EMAIL</small>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </li>
                <li>
                  <span className="ct-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <div>
                    <small>OFFICE</small>
                    <span className="ct-info-text">{address}</span>
                  </div>
                </li>
                <li>
                  <span className="ct-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </span>
                  <div>
                    <small>RESPONSE TIME</small>
                    <span className="ct-info-text">Mon–Sun: within 24–48 hours</span>
                  </div>
                </li>
              </ul>

              <div className="ct-info-social">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/></svg>
                  </a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.5.5c-1 .3-1.8 1-2 2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.5c1-.3 1.8-1 2-2 .5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                  </a>
                )}
                {settings.social_pinterest && (
                  <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.1 9.4 7.6 11.2-.1-.9-.2-2.4 0-3.5.2-.9 1.4-5.7 1.4-5.7s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-5-5.1-5-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2.2.9 2.8.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.4 3 7.4 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1 2.5-1.5 3.4 1.1.4 2.3.5 3.5.5 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0z"/></svg>
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.6c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm0 10.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6.4-8.4c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2z"/></svg>
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT: White form panel */}
            <div className="ct-panel-right">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="ct-map-section reveal-on-scroll">
        <div className="container">
          <div className="ct-map-head">
            <div>
              <span className="ct-form-eyebrow">📍 Find Us</span>
              <h2>हमारा स्थान</h2>
              <p>Rithala Village · नज़दीकी Metro: Rithala (Red Line)</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener"
              className="ct-map-cta"
            >
              Get Directions →
            </a>
          </div>
          <div className="ct-map-frame">
            <iframe
              src="https://www.google.com/maps?q=Rithala+Village+Delhi&output=embed"
              loading="lazy"
              title="Rithala Village on Google Maps"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ct-faq reveal-on-scroll">
        <div className="container">
          <div className="ct-faq-head">
            <span className="ct-form-eyebrow">❓ FAQ</span>
            <h2>अक्सर पूछे जाने वाले सवाल</h2>
          </div>
          <div className="ct-faq-list">
            <details className="ct-faq-item">
              <summary>📸 क्या मैं अपनी photos भेज सकता हूँ?</summary>
              <p>हाँ! रिठाला से जुड़ी कोई भी photo, family memory, या story <a href={`mailto:${email}`}>{email}</a> पर भेजें।</p>
            </details>
            <details className="ct-faq-item">
              <summary>⏱️ कितनी देर में reply मिलेगा?</summary>
              <p>आमतौर पर <strong>24-48 घंटे</strong> में। Urgent cases में जल्दी जवाब देते हैं।</p>
            </details>
            <details className="ct-faq-item">
              <summary>🎬 Reel या video share करनी है?</summary>
              <p>Instagram पर <strong>@rithala_update</strong> को tag करें या DM भेजें।</p>
            </details>
            <details className="ct-faq-item">
              <summary>🏛️ Historical information कहाँ मिलेगी?</summary>
              <p>हमारा detailed history page: <a href="/rithala-village-history/">/rithala-village-history/</a></p>
            </details>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
