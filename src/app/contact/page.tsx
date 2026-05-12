import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';
import { getAllSettings } from '@/lib/db';
import ContactForm from './ContactForm';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Contact Us  Rithala Update | Get in Touch',
  description: 'हमसे संपर्क करें। Email, location, social media, or send a direct message  we reply within 24-48 hours.',
  alternates: { canonical: '/contact/' },
};

export default async function ContactPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));
  const email = settings.contact_email || 'rithalaupdate@gmail.com';
  const phone = settings.contact_phone || '';
  const address = settings.contact_address || 'Rithala Village, North-West Delhi  110085';

  const ig = settings.social_instagram || '';
  const fb = settings.social_facebook || '';
  const yt = settings.social_youtube || '';

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.site_title || 'Rithala Update',
    image: settings.site_logo_url || `${SITE}/logo.png`,
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
    url: `${SITE}/contact/`,
    sameAs: [ig, fb, yt, settings.social_pinterest].filter(Boolean),
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />

      {/* HERO */}
      <section className="ctf-hero">
        <div className="ctf-hero-decor" aria-hidden="true">
          <span className="ctf-dot ctf-dot-1"></span>
          <span className="ctf-dot ctf-dot-2"></span>
          <span className="ctf-dot ctf-dot-3"></span>
          <span className="ctf-dot ctf-dot-4"></span>
        </div>
        <div className="container">
          <span className="ctf-pill"><Icon name="mail" size={13} /> Get in Touch</span>
          <h1 className="ctf-h1">
            हमसे जुड़ें  <span className="ctf-h1-grad">Contact Us</span>
          </h1>
          <p className="ctf-lead">
            आपका हर सवाल, सुझाव, या message हमारे लिए important है।<br />
            हमें लिखिए, हम ज़रूर जवाब देंगे!
          </p>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="ctf-main">
        <div className="container">
          <div className="ctf-grid">
            {/* LEFT  FORM CARD */}
            <div className="ctf-card ctf-form-card">
              <div className="ctf-card-head">
                <div className="ctf-card-icon ctf-card-icon-orange">
                  <Icon name="send" size={18} />
                </div>
                <div>
                  <h2>Send Us a Message</h2>
                  <small></small>
                </div>
              </div>
              <ContactForm />
            </div>

            {/* RIGHT COLUMN  Map + Get in Touch */}
            <div className="ctf-side">
              {/* Map card */}
              <div className="ctf-card">
                <div className="ctf-card-head">
                  <div className="ctf-card-icon ctf-card-icon-blue">
                    <Icon name="map-pin" size={18} />
                  </div>
                  <div>
                    <h2>Our Location</h2>
                    <small>Rithala Village, North-West Delhi</small>
                  </div>
                </div>
                <div className="ctf-map-frame">
                  <iframe
                    src="https://www.google.com/maps?q=Rithala+Village+Delhi&output=embed"
                    loading="lazy"
                    title="Rithala Village on Google Maps"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank" rel="noopener"
                  className="ctf-map-btn"
                >
                  <Icon name="map-pin" size={14} /> View on Google Maps
                </a>
              </div>

              {/* Get in Touch card */}
              <div className="ctf-card">
                <div className="ctf-card-head">
                  <div className="ctf-card-icon ctf-card-icon-orange">
                    <Icon name="phone" size={18} />
                  </div>
                  <div>
                    <h2>Get in Touch</h2>
                    <small>Reach us directly</small>
                  </div>
                </div>

                <div className="ctf-info-grid">
                  <div className="ctf-info-row">
                    <span className="ctf-info-ic"><Icon name="mail" size={16} /></span>
                    <div>
                      <small>Email</small>
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  </div>
                  {phone && (
                    <div className="ctf-info-row">
                      <span className="ctf-info-ic"><Icon name="phone" size={16} /></span>
                      <div>
                        <small>Phone</small>
                        <a href={`tel:${phone}`}>{phone}</a>
                      </div>
                    </div>
                  )}
                  <div className="ctf-info-row">
                    <span className="ctf-info-ic"><Icon name="map-pin" size={16} /></span>
                    <div>
                      <small>Address</small>
                      <span>{address}</span>
                    </div>
                  </div>
                  <div className="ctf-info-row">
                    <span className="ctf-info-ic"><Icon name="clock" size={16} /></span>
                    <div>
                      <small>Response Time</small>
                      <span>Within 2448 hours</span>
                    </div>
                  </div>
                </div>

                {(ig || fb || yt) && (
                  <div className="ctf-follow">
                    <small>Follow Us</small>
                    <div className="ctf-follow-row">
                      {ig && (
                        <a href={ig} target="_blank" rel="noopener" aria-label="Instagram" className="ctf-soc ctf-soc-ig">
                          <Icon name="instagram" size={16} />
                        </a>
                      )}
                      {fb && (
                        <a href={fb} target="_blank" rel="noopener" aria-label="Facebook" className="ctf-soc ctf-soc-fb">
                          <Icon name="facebook" size={16} />
                        </a>
                      )}
                      {yt && (
                        <a href={yt} target="_blank" rel="noopener" aria-label="YouTube" className="ctf-soc ctf-soc-yt">
                          <Icon name="youtube" size={18} />
                        </a>
                      )}
                      <a href={`mailto:${email}`} aria-label="Email" className="ctf-soc ctf-soc-mail">
                        <Icon name="mail" size={16} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
