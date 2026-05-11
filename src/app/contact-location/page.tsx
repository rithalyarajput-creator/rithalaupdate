import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import ContactForm from '../contact/ContactForm';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Contact Us — Rithala Update | Location, Email, Social Links',
  description:
    'Get in touch with Rithala Update. Email, location map, social media, and direct message form. हमसे जुड़ें और अपनी कहानी share करें।',
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

      {/* ============ SPLIT HERO ============ */}
      <section className="cn-hero">
        <div className="cn-hero-decor" aria-hidden="true">
          <span className="cn-particle cn-p1"></span>
          <span className="cn-particle cn-p2"></span>
          <span className="cn-particle cn-p3"></span>
          <span className="cn-particle cn-p4"></span>
          <span className="cn-particle cn-p5"></span>
        </div>
        <div className="container cn-hero-grid">
          <div className="cn-hero-left">
            <span className="cn-pill">
              <span className="cn-pill-dot"></span> Get in Touch · 24/7
            </span>
            <h1 className="cn-h1">
              आइए, <span className="cn-h1-grad">बातचीत</span><br />
              शुरू करते हैं
            </h1>
            <p className="cn-lead">
              कोई सवाल, कहानी, तस्वीर या सुझाव? रिठाला परिवार आपके स्वागत के लिए तैयार है।
              हम हर एक message को पढ़ते हैं और जल्द से जल्द जवाब देते हैं।
            </p>

            <div className="cn-quick-row">
              <a href={`mailto:${email}`} className="cn-quick">
                <span className="cn-quick-icon">📧</span>
                <span>
                  <small>Email</small>
                  <strong>{email}</strong>
                </span>
              </a>
              {phone && (
                <a href={`tel:${phone}`} className="cn-quick">
                  <span className="cn-quick-icon">📞</span>
                  <span>
                    <small>Phone</small>
                    <strong>{phone}</strong>
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="cn-hero-right">
            <div className="cn-stack-card cn-card-a">
              <div className="cn-card-emoji">🚩</div>
              <h3>Jai Rajputana</h3>
              <p>राजपूताना heritage की पहचान</p>
            </div>
            <div className="cn-stack-card cn-card-b">
              <div className="cn-card-emoji">📍</div>
              <h3>Rithala Village</h3>
              <p>North-West Delhi · 110085</p>
            </div>
            <div className="cn-stack-card cn-card-c">
              <div className="cn-card-emoji">⏱️</div>
              <h3>Quick Response</h3>
              <p>24-48 घंटे में जवाब</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THREE-COLUMN INFO + SOCIAL ============ */}
      <section className="cn-info reveal-on-scroll">
        <div className="container">
          <div className="cn-info-grid">
            <div className="cn-info-block">
              <div className="cn-info-num">01</div>
              <div className="cn-info-icon">📧</div>
              <h3>Drop an Email</h3>
              <p>किसी भी सवाल, कहानी या photo के लिए।</p>
              <a href={`mailto:${email}`} className="cn-info-link">
                {email}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>

            <div className="cn-info-block cn-info-mid">
              <div className="cn-info-num">02</div>
              <div className="cn-info-icon">📍</div>
              <h3>Visit Us</h3>
              <p>{address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener"
                className="cn-info-link"
              >
                Open in Google Maps
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>

            <div className="cn-info-block">
              <div className="cn-info-num">03</div>
              <div className="cn-info-icon">🌐</div>
              <h3>Follow Online</h3>
              <p>हमारे social pages पर जुड़ें।</p>
              <div className="cn-info-social">
                {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="cn-soc cn-soc-ig">IG</a>}
                {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="cn-soc cn-soc-fb">FB</a>}
                {settings.social_youtube && <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="cn-soc cn-soc-yt">YT</a>}
                {settings.social_pinterest && <a href={settings.social_pinterest} target="_blank" rel="noopener" aria-label="Pinterest" className="cn-soc cn-soc-pn">PN</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FORM + MAP SPLIT ============ */}
      <section className="cn-form-section reveal-on-scroll">
        <div className="container">
          <div className="cn-form-grid">
            <div className="cn-form-side">
              <span className="cn-form-eyebrow">📨 Send Message</span>
              <h2>हमें मैसेज भेजें</h2>
              <p>
                आपका मैसेज सीधे हमारे admin inbox में जाएगा। हम आमतौर पर
                <strong> 24-48 घंटे </strong>में जवाब देते हैं।
              </p>
              <div className="cn-trust-points">
                <div className="cn-trust-point">
                  <span>✓</span>
                  <div>
                    <strong>100% Private</strong>
                    <small>आपकी जानकारी सुरक्षित है</small>
                  </div>
                </div>
                <div className="cn-trust-point">
                  <span>✓</span>
                  <div>
                    <strong>No Spam</strong>
                    <small>हम कभी spam नहीं करते</small>
                  </div>
                </div>
                <div className="cn-trust-point">
                  <span>✓</span>
                  <div>
                    <strong>Free Forever</strong>
                    <small>संपर्क बिल्कुल मुफ्त</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="cn-form-card">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAP STRIP ============ */}
      <section className="cn-map-strip reveal-on-scroll">
        <div className="container">
          <div className="cn-map-head">
            <div>
              <span className="cn-form-eyebrow">📍 Find Us</span>
              <h2>हमारा स्थान</h2>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener"
              className="cn-map-cta"
            >
              Get Directions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
          <div className="cn-map-frame">
            <iframe
              src="https://www.google.com/maps?q=Rithala+Village+Delhi&output=embed"
              loading="lazy"
              title="Rithala Village on Google Maps"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="cn-map-badge">
              <strong>🚇 Nearest Metro</strong>
              <small>Rithala (Red Line)</small>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="cn-faq reveal-on-scroll">
        <div className="container">
          <div className="cn-faq-head">
            <span className="cn-form-eyebrow">❓ FAQ</span>
            <h2>अक्सर पूछे जाने वाले सवाल</h2>
          </div>
          <div className="cn-faq-list">
            <details className="cn-faq-item">
              <summary>📸 क्या मैं अपनी photos भेज सकता हूँ?</summary>
              <p>हाँ! रिठाला से जुड़ी कोई भी photo, family memory, या village story <a href={`mailto:${email}`}>{email}</a> पर भेजें। हम उसे website पर credit के साथ feature करेंगे।</p>
            </details>
            <details className="cn-faq-item">
              <summary>⏱️ कितनी देर में reply मिलेगा?</summary>
              <p>आमतौर पर <strong>24-48 घंटे</strong> में। Urgent cases में हम जल्दी जवाब देते हैं। Weekends पर थोड़ी देरी हो सकती है।</p>
            </details>
            <details className="cn-faq-item">
              <summary>🎬 Reel या video share करनी है?</summary>
              <p>Instagram पर <strong>@rithala_update</strong> को tag करें या DM भेजें। हम featured reels homepage पर दिखाते हैं।</p>
            </details>
            <details className="cn-faq-item">
              <summary>📝 क्या मैं अपना article लिख सकता हूँ?</summary>
              <p>बिल्कुल! रिठाला से related कोई भी story, history, या personal experience हमें भेजें। हम उसे edit करके publish कर देंगे।</p>
            </details>
            <details className="cn-faq-item">
              <summary>🏛️ Historical information कहाँ मिलेगी?</summary>
              <p>हमारा detailed history page देखें: <a href="/rithala-village-history/">/rithala-village-history/</a> — 640+ साल का पूरा इतिहास।</p>
            </details>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="cn-final-cta reveal-on-scroll">
        <div className="container">
          <div className="cn-final-card">
            <div className="cn-final-icon">🚩</div>
            <h2>आपकी कहानी हमारी विरासत है</h2>
            <p>
              रिठाला गाँव की हर याद, हर तस्वीर, हर कहानी हमारे लिए कीमती है।
              आगे आइए और इस ऐतिहासिक archive का हिस्सा बनिए।
            </p>
            <div className="cn-final-actions">
              <a href={`mailto:${email}`} className="cn-cta-primary">
                📧 Email Us Now
              </a>
              <a href={settings.social_instagram || '#'} target="_blank" rel="noopener" className="cn-cta-ghost">
                📷 DM on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
