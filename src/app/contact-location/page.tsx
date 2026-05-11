import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import ContactForm from '../contact/ContactForm';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Contact Us — Rithala Update | Get in Touch',
  description:
    'हमसे जुड़ें — Email, location, social media, या direct message form। 24-48 घंटे में जवाब।',
  alternates: { canonical: '/contact-location/' },
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
      <section className="ct2-hero">
        <div className="container">
          <span className="ct2-eyebrow">📞 Get in Touch</span>
          <h1>
            हमसे जुड़ें — <span className="ct2-grad">Contact Us</span>
          </h1>
          <p>आपका हर सवाल, कहानी, या photo — हम सब सुनते हैं। 24-48 घंटे में reply की guarantee।</p>
        </div>
      </section>

      {/* TWO-COLUMN: LEFT FORM, RIGHT MAP + INFO */}
      <section className="ct2-main">
        <div className="container">
          <div className="ct2-grid">
            {/* LEFT — FORM */}
            <div className="ct2-form-card">
              <div className="ct2-form-head">
                <span className="ct2-form-eyebrow">✉️ Send Message</span>
                <h2>एक मैसेज भेजें</h2>
                <p>Form भरें या email करें — कुछ भी पूछें, हम जवाब देंगे।</p>
              </div>
              <ContactForm />
            </div>

            {/* RIGHT — MAP + INFO */}
            <div className="ct2-side">
              <div className="ct2-map-card">
                <div className="ct2-map-frame">
                  <iframe
                    src="https://www.google.com/maps?q=Rithala+Village+Delhi&output=embed"
                    loading="lazy"
                    title="Rithala Village on Google Maps"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener"
                  className="ct2-map-cta"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  View on Google Maps
                </a>
              </div>

              <div className="ct2-info-card">
                <h3 className="ct2-info-h3">
                  <span className="ct2-info-icon-h">📞</span>
                  Get in Touch
                </h3>

                <div className="ct2-info-list">
                  <div className="ct2-info-row">
                    <span className="ct2-info-ic">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                    <div>
                      <strong>Our Address</strong>
                      <span>{address}</span>
                    </div>
                  </div>

                  <div className="ct2-info-row">
                    <span className="ct2-info-ic">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                    <div>
                      <strong>Phone</strong>
                      <a href={`tel:${phone}`}>{phone}</a>
                    </div>
                  </div>

                  <div className="ct2-info-row">
                    <span className="ct2-info-ic">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <div>
                      <strong>Email</strong>
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  </div>

                  <div className="ct2-info-row">
                    <span className="ct2-info-ic">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </span>
                    <div>
                      <strong>Response Time</strong>
                      <span>Monday – Sunday · 24-48 hours</span>
                    </div>
                  </div>
                </div>

                <div className="ct2-social-block">
                  <small>Follow us</small>
                  <div className="ct2-social-row">
                    {settings.social_instagram && (
                      <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="ct2-soc ct2-soc-ig">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.6c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm6.4-.4c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2z"/></svg>
                      </a>
                    )}
                    {settings.social_facebook && (
                      <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="ct2-soc ct2-soc-fb">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/></svg>
                      </a>
                    )}
                    {settings.social_youtube && (
                      <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="ct2-soc ct2-soc-yt">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.5.5c-1 .3-1.8 1-2 2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.5c1-.3 1.8-1 2-2 .5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                      </a>
                    )}
                    {settings.social_pinterest && (
                      <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest" className="ct2-soc ct2-soc-pn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.1 9.4 7.6 11.2-.1-.9-.2-2.4 0-3.5.2-.9 1.4-5.7 1.4-5.7s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-5-5.1-5-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2.2.9 2.8.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.4 3 7.4 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1 2.5-1.5 3.4 1.1.4 2.3.5 3.5.5 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
