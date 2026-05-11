import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';
import { sql, getAllSettings } from '@/lib/db';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Me — Sandeep Rajput | Founder of Rithala Update',
  description: 'Sandeep Rajput — founder of Rithala Update. Storyteller, archivist, and proud son of Rithala village.',
  alternates: { canonical: '/sandeep-rajput/' },
};

export default async function SandeepRajputPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));
  let me: any = null;
  try {
    const r = await sql`SELECT * FROM authors WHERE slug = 'sandeep-rajput' LIMIT 1`;
    me = r.rows[0] || null;
  } catch {}

  const avatar = me?.avatar_url || '/logo.png';
  const bio = me?.bio || 'Founder of Rithala Update — a digital archive of रिठाला गाँव heritage. Sharing stories, photos, and the cultural memory of our village with the world.';

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sandeep Rajput',
    description: bio,
    image: avatar,
    url: 'https://rithalaupdate.online/sandeep-rajput/',
    jobTitle: 'Founder & Editor',
    worksFor: { '@type': 'Organization', name: 'Rithala Update' },
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <section className="ab-hero">
        <div className="container">
          <span className="ab-eyebrow">About Me</span>
          <h1 className="ab-h1">Sandeep Rajput</h1>
          <p className="ab-lead">Founder &amp; Editor · Rithala Update</p>
        </div>
      </section>

      <section className="ab-section">
        <div className="container me-grid">
          <div className="me-avatar-wrap">
            <img src={avatar} alt="Sandeep Rajput" className="me-avatar" />
            <div className="me-socials">
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener" aria-label="Instagram" className="me-soc me-soc-ig"><Icon name="instagram" size={16} /></a>
              )}
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener" aria-label="Facebook" className="me-soc me-soc-fb"><Icon name="facebook" size={16} /></a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener" aria-label="YouTube" className="me-soc me-soc-yt"><Icon name="youtube" size={16} /></a>
              )}
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} aria-label="Email" className="me-soc me-soc-mail"><Icon name="mail" size={16} /></a>
              )}
            </div>
          </div>

          <div className="ab-prose">
            <h2>नमस्ते जी 🙏</h2>
            <p>
              मैं <strong>Sandeep Rajput</strong> हूँ, और <strong>Rithala Update</strong> का founder हूँ।
              मेरा सपना है कि हमारे गाँव की 640+ साल पुरानी विरासत, राजपूताना संस्कृति,
              और हर वो कहानी जो धीरे-धीरे भुलाई जा रही है — उसे हम digital रूप में
              हमेशा के लिए सुरक्षित कर सकें।
            </p>

            <h2>About Me</h2>
            <p>{bio}</p>

            <h2>What I do here</h2>
            <ul className="ab-list">
              <li><Icon name="feather" size={16} /> Write blog posts about Rithala history, events, and culture</li>
              <li><Icon name="photo" size={16} /> Document village moments through photos and reels</li>
              <li><Icon name="users" size={16} /> Connect with Rithala people worldwide and gather their stories</li>
              <li><Icon name="book" size={16} /> Archive everything I find — for our children and theirs</li>
            </ul>

            <h2>Want to share something with me?</h2>
            <p>
              अगर आपके पास Rithala से जुड़ी कोई पुरानी तस्वीर, यादगार कहानी, या परिवार
              की विरासत है, तो मुझे ज़रूर भेजें। हर contribution इस archive को richer बनाती है।
            </p>

            <div className="ab-cta-row">
              <Link href="/contact/" className="ab-btn-primary">
                <Icon name="mail" size={14} /> Get in Touch
              </Link>
              <Link href="/about/" className="ab-btn-ghost">
                About Rithala Update
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
