import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import './styles.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Sandeep Rajput School — Rana Pratap School Rithala | Rithalya Rajput',
  description: 'Sandeep Rajput (Rithalya Rajput) school life at Rana Pratap Government Boys Senior Secondary School, Rithala, Delhi. School photos, memories and journey from Class 7 to Class 12.',
  keywords: 'Sandeep Rajput school, Rithalya Rajput school, Rana Pratap School Rithala, Sandeep Rajput Rithala Delhi school photos',
  alternates: { canonical: '/sandeep-rajput-school/' },
  openGraph: {
    title: 'Sandeep Rajput School — Rana Pratap School Rithala',
    description: 'School life and memories of Sandeep Rajput Rithalya Rajput at Rana Pratap Government Boys Senior Secondary School, Rithala, Delhi.',
    url: `${SITE}/sandeep-rajput-school/`,
    type: 'profile',
  },
};

const PHOTOS = [
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780126495893-sandeep-rajput-rithalya-rajput-rana-pratap-sarvodaya-school-rithala-delhi.jpg-aOf2OUhgtMt1zncuB5nE4EAvhOsiRU.jpg',
    alt: 'Sandeep Rajput Rithalya Rajput with school friends birthday celebration Rana Pratap School Rithala Delhi',
    caption: 'Birthday celebration with classmates — Rana Pratap School, Rithala',
  },
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780128070439-Sandeep_Rajput_at_Rana_Pratap_Sarvodaya_School_Rithala_Delhi-HiluKN1YF4KDt9BXsd0w7AQkxNocxX.webp',
    alt: 'Sandeep Rajput Rithalya Rajput at Rana Pratap Sarvodaya School Rithala Delhi with friends',
    caption: 'With friends at school — Rana Pratap Sarvodaya School, Rithala',
  },
];

export default function SchoolPage() {
  return (
    <PublicShell>
      <main className="sch-page">

        {/* Hero */}
        <section className="sch-hero">
          <div className="sch-container">
            <span className="sch-hero-badge">School Life · Rithala, Delhi</span>
            <h1>Sandeep Rajput at Rana Pratap School</h1>
            <p className="sch-hero-sub">
              Rithalya Rajput — School memories, friendships and formative years at
              Rana Pratap Government Boys Senior Secondary School, Rithala
            </p>
            <div className="sch-hero-tags">
              <span>Class 7 – 12</span>
              <span>1:00 PM – 6:00 PM</span>
              <span>Rithala, North Delhi</span>
              <span>Boys School</span>
            </div>
          </div>
        </section>

        {/* About School */}
        <section className="sch-section">
          <div className="sch-container">
            <div className="sch-about-grid">
              <div className="sch-about-text">
                <h2>About the School</h2>
                <p>
                  Rana Pratap Government Boys Senior Secondary School is one of the most respected
                  government schools in Rithala, North Delhi. Named after the legendary Rajput warrior
                  Maharana Pratap, the school carries the values of courage, discipline, and dedication
                  in its very name.
                </p>
                <p>
                  Sandeep Rajput — known as Rithalya Rajput — studied here from Class 7 to Class 12,
                  attending the afternoon shift from 1:00 PM to 6:00 PM. These were among the most
                  formative years of his life, shaping his confidence, creativity, and character.
                </p>
                <p>
                  The school is known for its dedicated and knowledgeable teaching staff who go beyond
                  textbooks to inspire students. It was in these classrooms and corridors that Sandeep
                  discovered his passion for art, design, and digital creation.
                </p>
              </div>
              <div className="sch-info-card">
                <h3>School Details</h3>
                <div className="sch-details">
                  <div className="sch-detail-row"><span>School</span><strong>Rana Pratap Govt. Boys Sr. Sec. School</strong></div>
                  <div className="sch-detail-row"><span>Location</span><strong>Rithala, North Delhi</strong></div>
                  <div className="sch-detail-row"><span>Type</span><strong>Government Boys School</strong></div>
                  <div className="sch-detail-row"><span>Classes</span><strong>Class 7 – Class 12</strong></div>
                  <div className="sch-detail-row"><span>Shift</span><strong>Afternoon · 1:00 PM – 6:00 PM</strong></div>
                  <div className="sch-detail-row"><span>Student</span><strong>Sandeep Rajput (Rithalya Rajput)</strong></div>
                </div>
                <a
                  href="https://www.google.com/search?q=Rana+Pratap+Government+Boys+Senior+Secondary+School+Rithala+Delhi"
                  target="_blank" rel="noopener noreferrer"
                  className="sch-google-btn"
                >
                  View on Google
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="sch-section sch-section--alt">
          <div className="sch-container">
            <h2 className="sch-gallery-title">School Memories & Photos</h2>
            <p className="sch-gallery-lead">
              Sandeep Rajput Rithalya Rajput school photos at Rana Pratap Sarvodaya School, Rithala, Delhi
            </p>
            <div className="sch-gallery-grid">
              {PHOTOS.map((p, i) => (
                <div key={i} className="sch-gallery-card">
                  <img src={p.src} alt={p.alt} className="sch-gallery-img" loading="lazy" />
                  <p className="sch-gallery-caption">{p.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sch-cta">
          <div className="sch-container">
            <h2>Learn More About Sandeep Rajput</h2>
            <p>Discover the full journey of Rithalya Rajput — from school days to digital creator.</p>
            <div className="sch-cta-btns">
              <a href="/sandeep-rajput/" className="sch-btn sch-btn--gold">About Me</a>
              <a href="/sandeep-rajput-journey/" className="sch-btn sch-btn--outline">Full Journey — 2007 to Present</a>
            </div>
          </div>
        </section>

      </main>
    </PublicShell>
  );
}
