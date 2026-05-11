import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import ContactForm from '../contact/ContactForm';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Contact Us — Rithala Update | Reach the Rajputana Family',
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

      {/* ===== CURVED HERO with floating cards ===== */}
      <section className="cx-hero">
        <div className="cx-hero-bg" aria-hidden="true">
          <span className="cx-shape cx-shape-1"></span>
          <span className="cx-shape cx-shape-2"></span>
          <span className="cx-shape cx-shape-3"></span>
        </div>

        <div className="container cx-hero-inner">
          <div className="cx-hero-text">
            <span className="cx-tag">📞 Hum se जुड़ें</span>
            <h1>
              <span className="cx-h1-script">Let's</span>
              <span className="cx-h1-main">बात करते हैं</span>
            </h1>
            <p>
              आपका हर सवाल, हर कहानी, हर तस्वीर हमारे लिए कीमती है।
              <strong> रिठाला परिवार </strong>आपके स्वागत में है।
            </p>

            <div className="cx-stats-row">
              <div>
                <strong>24-48h</strong>
                <small>Avg reply time</small>
              </div>
              <div>
                <strong>100%</strong>
                <small>Private &amp; safe</small>
              </div>
              <div>
                <strong>Free</strong>
                <small>Always &amp; forever</small>
              </div>
            </div>
          </div>

          <div className="cx-hero-photo">
            <div className="cx-photo-ring"></div>
            <div className="cx-photo-flag">🚩</div>
            <div className="cx-photo-core">
              <span>राम राम<br/>जी 🙏</span>
            </div>
            <div className="cx-floating-msg cx-msg-1">
              <strong>📧 Email</strong>
              <small>Instant reply</small>
            </div>
            <div className="cx-floating-msg cx-msg-2">
              <strong>📍 Visit</strong>
              <small>Rithala, Delhi</small>
            </div>
            <div className="cx-floating-msg cx-msg-3">
              <strong>📱 Insta DM</strong>
              <small>@rithala_update</small>
            </div>
          </div>
        </div>

        <svg className="cx-curve" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff"/>
        </svg>
      </section>

      {/* ===== 3 contact channels (icon strip on white) ===== */}
      <section className="cx-channels reveal-on-scroll">
        <div className="container">
          <div className="cx-channels-grid">
            <a href={`tel:${phone}`} className="cx-channel cx-ch-call">
              <div className="cx-ch-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <span className="cx-ch-label">Call us anytime</span>
                <strong className="cx-ch-value">{phone}</strong>
              </div>
              <span className="cx-ch-arrow">→</span>
            </a>

            <a href={`mailto:${email}`} className="cx-channel cx-ch-mail">
              <div className="cx-ch-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <span className="cx-ch-label">Email us</span>
                <strong className="cx-ch-value">{email}</strong>
              </div>
              <span className="cx-ch-arrow">→</span>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener"
              className="cx-channel cx-ch-map"
            >
              <div className="cx-ch-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <span className="cx-ch-label">Visit us</span>
                <strong className="cx-ch-value">{address}</strong>
              </div>
              <span className="cx-ch-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== Glass form over map background ===== */}
      <section className="cx-form-map reveal-on-scroll">
        <div className="cx-form-map-bg" aria-hidden="true">
          <iframe
            src="https://www.google.com/maps?q=Rithala+Village+Delhi&output=embed"
            loading="lazy"
            title=""
          ></iframe>
          <div className="cx-form-map-veil"></div>
        </div>

        <div className="container cx-form-map-grid">
          <div className="cx-form-side">
            <span className="cx-tag-light">✉️ Send Message</span>
            <h2>आपका मैसेज, हमारी ज़िम्मेदारी</h2>
            <p>
              हमें कुछ भी बताएँ — कोई कहानी, photo, सुझाव, या सवाल।
              हम <strong>हर एक mail</strong> पढ़ते हैं और जल्द जवाब देते हैं।
            </p>
            <ul className="cx-check-list">
              <li><span>✓</span> Direct admin inbox में जाएगा</li>
              <li><span>✓</span> कोई spam नहीं, कभी भी</li>
              <li><span>✓</span> Photos / stories welcome हैं</li>
              <li><span>✓</span> Hindi या English दोनों चलेगा</li>
            </ul>
          </div>

          <div className="cx-glass-form">
            <div className="cx-glass-head">
              <strong>Quick Message</strong>
              <small>Within 24-48 hours reply</small>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ===== Social ribbon ===== */}
      <section className="cx-social-ribbon reveal-on-scroll">
        <div className="container">
          <div className="cx-ribbon-inner">
            <h3>📱 Follow our journey</h3>
            <p>Daily updates, reels, और गाँव की कहानियाँ इन platforms पर:</p>
            <div className="cx-ribbon-row">
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener" className="cx-rib cx-rib-ig">
                  <span className="cx-rib-name">Instagram</span>
                  <span className="cx-rib-handle">@rithala_update</span>
                </a>
              )}
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener" className="cx-rib cx-rib-fb">
                  <span className="cx-rib-name">Facebook</span>
                  <span className="cx-rib-handle">Rithala Update</span>
                </a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener" className="cx-rib cx-rib-yt">
                  <span className="cx-rib-name">YouTube</span>
                  <span className="cx-rib-handle">@rithala_update</span>
                </a>
              )}
              {settings.social_pinterest && (
                <a href={settings.social_pinterest} target="_blank" rel="noopener" className="cx-rib cx-rib-pn">
                  <span className="cx-rib-name">Pinterest</span>
                  <span className="cx-rib-handle">rithala_update</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="cx-faq reveal-on-scroll">
        <div className="container">
          <div className="cx-faq-head">
            <span className="cx-tag-light">❓ Quick Help</span>
            <h2>आपके सवाल, हमारे जवाब</h2>
          </div>
          <div className="cx-faq-list">
            <details className="cx-faq-item">
              <summary>📸 क्या मैं अपनी photos या कहानियाँ भेज सकता हूँ?</summary>
              <p>बिल्कुल! रिठाला से जुड़ी कोई भी photo, family memory, या story <a href={`mailto:${email}`}>{email}</a> पर भेजें। हम उसे credit के साथ feature करेंगे।</p>
            </details>
            <details className="cx-faq-item">
              <summary>⏱️ Reply कितनी देर में मिलेगा?</summary>
              <p>आमतौर पर <strong>24-48 घंटे</strong> में। Weekends पर थोड़ी देरी हो सकती है, पर हर email का जवाब ज़रूर मिलता है।</p>
            </details>
            <details className="cx-faq-item">
              <summary>🎬 Reel या video share करनी है?</summary>
              <p>Instagram पर <strong>@rithala_update</strong> को tag करें या DM भेजें। Featured reels homepage पर दिखाई देती हैं।</p>
            </details>
            <details className="cx-faq-item">
              <summary>📍 Office visit करना है?</summary>
              <p>हमारा address है: <strong>{address}</strong>। Visit से पहले <a href={`tel:${phone}`}>{phone}</a> पर call कर लें।</p>
            </details>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
