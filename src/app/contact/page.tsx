import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import ContactForm from './ContactForm';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us',
    description: 'Get in touch with Rithala Update — share photos, stories, or feedback.',
  };
}

export default async function ContactPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));

  return (
    <PublicShell>
      <section className="container section">
        <h1 style={{ textAlign: 'center', color: 'var(--color-link)' }}>Contact Us</h1>
        <p style={{ textAlign: 'center', color: '#5b6573', maxWidth: 600, margin: '0 auto 30px' }}>
          Share your photos, stories, or feedback. We read every message.
        </p>

        <div style={{ display: 'grid', gap: 30, gridTemplateColumns: '1fr', maxWidth: 1000, margin: '0 auto' }}>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              {settings.contact_email && (
                <p>
                  📧 <strong>Email:</strong>{' '}
                  <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
                </p>
              )}
              {settings.contact_phone && (
                <p>
                  📞 <strong>Phone:</strong>{' '}
                  <a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>
                </p>
              )}
              {settings.contact_address && (
                <p>
                  📍 <strong>Address:</strong><br />
                  {settings.contact_address}
                </p>
              )}
              <h4 style={{ marginTop: 24 }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener" className="btn btn-sm btn-secondary">Instagram</a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener" className="btn btn-sm btn-secondary">YouTube</a>
                )}
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener" className="btn btn-sm btn-secondary">Facebook</a>
                )}
              </div>
            </div>

            <div className="contact-form-wrap">
              <h3>Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
