import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import ContactForm from '../contact/ContactForm';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Contact Us — Rithala Update | Location, Email, Social',
  description:
    'Get in touch with Rithala Update. Email, location map, social media, और direct message form — हमसे जुड़ें।',
  alternates: { canonical: '/contact-location/' },
  openGraph: {
    title: 'Contact Us — Rithala Update',
    description: 'Email, location, social links, और contact form।',
    url: `${SITE}/contact-location/`,
  },
};

export default async function ContactLocationPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));

  const email = settings.contact_email || 'rithalyarajput@gmail.com';
  const phone = settings.contact_phone || '';
  const address = settings.contact_address || 'Rithala Village, North-West Delhi, India';

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
      <section className="cl-hero">
        <div className="cl-hero-bg" aria-hidden="true">
          <span className="cl-orb cl-orb-1"></span>
          <span className="cl-orb cl-orb-2"></span>
        </div>
        <div className="container">
          <span className="cl-eyebrow">📍 Get in Touch</span>
          <h1 className="cl-h1">
            Hum se <span className="cl-h1-grad">जुड़ें</span>
          </h1>
          <p className="cl-lead">
            कोई सवाल, कहानी, तस्वीर या सुझाव? रिठाला परिवार आपके स्वागत के लिए तैयार है।
          </p>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="cl-cards reveal-on-scroll">
        <div className="container">
          <div className="cl-cards-grid">
            <a href={`mailto:${email}`} className="cl-card cl-card-email">
              <div className="cl-card-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className="cl-card-title">Email Us</div>
              <div className="cl-card-text">{email}</div>
              <span className="cl-card-cta">Send a message →</span>
            </a>

            {phone && (
              <a href={`tel:${phone}`} className="cl-card cl-card-phone">
                <div className="cl-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div className="cl-card-title">Call Us</div>
                <div className="cl-card-text">{phone}</div>
                <span className="cl-card-cta">Tap to call →</span>
              </a>
            )}

            <div className="cl-card cl-card-loc">
              <div className="cl-card-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="cl-card-title">Location</div>
              <div className="cl-card-text">{address}</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener"
                className="cl-card-cta"
              >
                Open in Maps →
              </a>
            </div>

            <div className="cl-card cl-card-social">
              <div className="cl-card-icon">🌐</div>
              <div className="cl-card-title">Follow Us</div>
              <div className="cl-card-social-row">
                {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="cl-soc cl-soc-ig">IG</a>}
                {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="cl-soc cl-soc-fb">FB</a>}
                {settings.social_youtube && <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="cl-soc cl-soc-yt">YT</a>}
                {settings.social_pinterest && <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest" className="cl-soc cl-soc-pn">PN</a>}
              </div>
              <span className="cl-card-cta">सभी sites पर मिलेंगे</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAP + FORM */}
      <section className="cl-map-form reveal-on-scroll">
        <div className="container">
          <div className="cl-mf-grid">
            <div className="cl-map-wrap">
              <div className="cl-map-head">
                <h2>📍 हमारा स्थान</h2>
                <p>रिठाला गाँव, उत्तर-पश्चिम दिल्ली</p>
              </div>
              <div className="cl-map-frame">
                <iframe
                  src="https://www.google.com/maps?q=Rithala+Village+Delhi&output=embed"
                  loading="lazy"
                  title="Rithala Village on Google Maps"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <p className="cl-map-foot">
                नज़दीकी metro: <strong>Rithala Metro Station</strong> (Red Line) ·
                Pin code: <strong>110085</strong>
              </p>
            </div>

            <div className="cl-form-wrap">
              <div className="cl-form-head">
                <span className="cl-form-eyebrow">📨 Message Us</span>
                <h2>एक मैसेज छोड़ें</h2>
                <p>हम 24-48 घंटे में जवाब देने की कोशिश करते हैं।</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-ish strip */}
      <section className="cl-faq reveal-on-scroll">
        <div className="container">
          <div className="cl-faq-grid">
            <div className="cl-faq-item">
              <div className="cl-faq-q">📸 क्या मैं अपनी photos भेज सकता हूँ?</div>
              <p>हाँ! रिठाला से जुड़ी कोई भी photo, story या याद {email} पर भेजें।</p>
            </div>
            <div className="cl-faq-item">
              <div className="cl-faq-q">⏱️ कितनी देर में reply मिलेगा?</div>
              <p>आमतौर पर 24-48 घंटे में। Urgent cases में जल्दी जवाब देते हैं।</p>
            </div>
            <div className="cl-faq-item">
              <div className="cl-faq-q">🎬 Reel या video share करनी है?</div>
              <p>Instagram पर <strong>@rithala_update</strong> tag करें या DM भेजें।</p>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
