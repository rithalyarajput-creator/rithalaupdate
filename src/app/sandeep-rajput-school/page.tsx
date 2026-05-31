import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import PhotosModal from './PhotosModal';
import './styles.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Sandeep Rajput School Journey — All Schools | Rithalya Rajput Rithala Delhi',
  description: 'Complete school journey of Sandeep Rajput (Rithalya Rajput) — from Nursery at Twinkle Star Public School to Class 12 at Rana Pratap School, Rithala, Delhi. All schools, photos and memories.',
  keywords: 'Sandeep Rajput school, Rithalya Rajput school journey, Rana Pratap School Rithala, Twinkle Star School Vijay Vihar, Sandeep Rajput Rithala Delhi school photos',
  alternates: { canonical: '/sandeep-rajput-school/' },
  openGraph: {
    title: 'Sandeep Rajput School Journey — All Schools Rithala Delhi',
    description: 'Complete school journey of Sandeep Rajput Rithalya Rajput from Nursery to Class 12, Rithala, Delhi.',
    url: `${SITE}/sandeep-rajput-school/`,
    type: 'profile',
  },
};

const SCHOOLS = [
  {
    number: '01',
    name: 'Twinkle Star Public School',
    classes: 'Nursery, LKG, UKG',
    address: 'Rithala Road, Vijay Vihar Phase 1, Block B, Vijay Vihar, Rohini, New Delhi – 110085',
    about: 'This is where it all began. Twinkle Star Public School, Vijay Vihar was Sandeep Rajput\'s very first school — the place where he took his first steps into education, made his first friends, and developed his earliest sense of curiosity and creativity.',
    highlight: 'First school — the beginning of the journey',
    color: '#dc2626',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780231603211-sandeep-rajput-rithalya-rajput-twinkle-star-public-school-vijay-vihar-rithala-delhi.jpg-Ik8swD5gkPZdaaOpMSBOC4nlp7lIB1.png',
    imageAlt: 'Twinkle Star Public School Vijay Vihar Rithala Delhi — Sandeep Rajput Rithalya Rajput first school',
  },
  {
    number: '02',
    name: 'Rana Pratap Sarvodya Kanya Vidyalaya, Rithala',
    classes: 'Class 1 – Class 2',
    address: 'Rithala, Rohini Sector 5, New Delhi',
    about: 'After his early schooling, Sandeep moved to Rana Pratap Sarvodya Kanya Vidyalaya in Rithala for Class 1 and Class 2. This school, named after the great Rajput warrior Maharana Pratap, was close to home and gave him a strong academic foundation in his early years.',
    highlight: 'Class 1 & 2 — early academic foundation',
    color: '#b45309',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780231596819-sandeep-rajput-rithalya-rajput-rana-pratap-sarvodya-kanya-vidyalaya-rithala-rohini-delhi.jpg-rvuz8aJY8vOXOGAH5dE1T7PB8sq3Jz.png',
    imageAlt: 'Rana Pratap Sarvodya Kanya Vidyalaya Rithala Rohini Delhi — Sandeep Rajput Rithalya Rajput school',
  },
  {
    number: '03',
    name: 'Sant Sujan Singh Ji International School',
    classes: 'Class 3',
    address: 'Kushak No. 2, Swaroop Nagar, Kadipur, Delhi – 110042',
    about: 'For Class 3, Sandeep attended Sant Sujan Singh Ji International School in Swaroop Nagar. This school broadened his horizons and introduced him to a wider circle of students and teachers, further enriching his early educational experience.',
    highlight: 'Class 3 — new experiences and wider horizons',
    color: '#0369a1',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780231598686-sandeep-rajput-rithalya-rajput-sant-sujan-singh-international-school-swaroop-nagar-delhi.jpg-hxwpgJpEVRiyXV4BZg2XWZHNehvhsd.png',
    imageAlt: 'Sant Sujan Singh Ji International School Swaroop Nagar Delhi — Sandeep Rajput Rithalya Rajput',
  },
  {
    number: '04',
    name: 'Twinkle Star Public School',
    classes: 'Class 4 – Class 5',
    address: 'Rithala Road, Vijay Vihar Phase 1, Block B, Vijay Vihar, Rohini, New Delhi – 110085',
    about: 'Sandeep returned to his first school — Twinkle Star Public School, Vijay Vihar — for Class 4 and Class 5. Coming back to familiar surroundings, he reconnected with old friends and teachers, completing his primary education with confidence and a growing passion for art and creativity.',
    highlight: 'Class 4 & 5 — returning to roots, completing primary school',
    color: '#7c3aed',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780231600837-sandeep-rajput-rithalya-rajput-twinkle-star-public-school-class4-5-vijay-vihar-delhi.jpg-zuFZVLmIhD9SmuJvfOnLqQzEqLSrnh.png',
    imageAlt: 'Twinkle Star Public School Vijay Vihar Delhi Class 4 5 — Sandeep Rajput Rithalya Rajput',
  },
  {
    number: '05',
    name: 'Citizen Model School',
    classes: 'Class 6',
    address: 'Metro Station, C-1, Phase II, 18/19, Trimurti Mandir Rd, Rithala, Budh Vihar, Delhi – 110085',
    about: 'For Class 6, Sandeep enrolled at Citizen Model School in Budh Vihar, Rithala — just near the metro station. This marked his transition to middle school and a new chapter of growing independence, where his interest in digital creativity and design began to emerge.',
    highlight: 'Class 6 — transition to middle school, creativity emerging',
    color: '#059669',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780231592650-sandeep-rajput-rithalya-rajput-citizen-model-school-rithala-budh-vihar-delhi.jpg-aTawjIQ7RQRy5wYP77qIeLHBcKwObL.png',
    imageAlt: 'Citizen Model School Rithala Budh Vihar Delhi — Sandeep Rajput Rithalya Rajput Class 6',
  },
  {
    number: '06',
    name: 'Rana Pratap Government Boys Senior Secondary School',
    classes: 'Class 7 – Class 12',
    address: 'Rithala, Rohini, New Delhi',
    about: 'The most significant chapter of Sandeep\'s school life. He spent Class 7 to Class 12 at Rana Pratap Government Boys Senior Secondary School, Rithala — attending the afternoon shift from 1:00 PM to 6:00 PM. This is where his confidence, discipline, artistic skills, and digital thinking truly flourished. The dedicated teachers, the friendships, the birthday celebrations in classrooms — these are the memories that shaped Sandeep Rajput (Rithalya Rajput) into the creator he is today.',
    highlight: 'Class 7 to 12 — the most formative years · 1:00 PM – 6:00 PM shift',
    color: '#c8a44a',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780231594719-sandeep-rajput-rithalya-rajput-rana-pratap-government-boys-school-rithala-delhi.jpg-IitE6GfTOeqlQOkskGGYHNutTd4wbp.png',
    imageAlt: 'Rana Pratap Government Boys Senior Secondary School Rithala Delhi — Sandeep Rajput Rithalya Rajput Class 7 to 12',
    isFinal: true,
    googleLink: 'https://www.google.com/search?q=Rana+Pratap+Government+Boys+Senior+Secondary+School+Rithala+Delhi',
    photos: [
      {
        src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780126495893-sandeep-rajput-rithalya-rajput-rana-pratap-sarvodaya-school-rithala-delhi.jpg-aOf2OUhgtMt1zncuB5nE4EAvhOsiRU.jpg',
        alt: 'Sandeep Rajput Rithalya Rajput with friends birthday celebration Rana Pratap School Rithala Delhi',
        caption: 'Birthday celebration with classmates — Rana Pratap School, Rithala',
      },
      {
        src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780128070439-Sandeep_Rajput_at_Rana_Pratap_Sarvodaya_School_Rithala_Delhi-HiluKN1YF4KDt9BXsd0w7AQkxNocxX.webp',
        alt: 'Sandeep Rajput Rithalya Rajput at Rana Pratap Sarvodaya School Rithala Delhi with school friends',
        caption: 'With school friends — Rana Pratap Sarvodaya School, Rithala, Delhi',
      },
    ],
  },
];

export default function SchoolPage() {
  return (
    <PublicShell>
      <main className="sch-page">

        {/* Hero */}
        <section className="sch-hero">
          <div className="sch-container">
            <span className="sch-hero-badge">School Journey · Rithala, Delhi</span>
            <h1>Sandeep Rajput — Full School Journey</h1>
            <p className="sch-hero-sub">
              Rithalya Rajput — From Nursery to Class 12 across 6 schools in Rithala &amp; North Delhi
            </p>
            <div className="sch-hero-tags">
              <span>Nursery – Class 12</span>
              <span>6 Schools</span>
              <span>Rithala, North Delhi</span>
              <span>Sandeep Rajput</span>
            </div>
          </div>
        </section>

        {/* Schools Timeline */}
        <section className="sch-section">
          <div className="sch-container">
            <div className="sch-schools-list">
              {SCHOOLS.map((school, i) => (
                <div key={i} className={`sch-school-item${school.isFinal ? ' sch-school-item--final' : ''}`}>
                  <div className="sch-school-number" style={{ background: school.color }}>{school.number}</div>
                  {school.image && (
                    <div className="sch-school-img-col">
                      <img src={school.image} alt={school.imageAlt} className="sch-school-main-img" loading="lazy" />
                    </div>
                  )}
                  <div className="sch-school-content">
                    <div className="sch-school-classes-badge">{school.classes}</div>
                    <h2 className="sch-school-name">{school.name}</h2>
                    <p className="sch-school-address">{school.address}</p>
                    <p className="sch-school-about">{school.about}</p>
                    <div className="sch-school-highlight" style={{ borderColor: school.color }}>
                      {school.highlight}
                    </div>

                    {school.photos && (
                      <PhotosModal photos={school.photos} color={school.color} />
                    )}

                    {school.googleLink && (
                      <a href={school.googleLink} target="_blank" rel="noopener noreferrer" className="sch-google-btn">
                        View School on Google
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sch-cta">
          <div className="sch-container">
            <h2>Discover More About Sandeep Rajput</h2>
            <p>Explore the full life journey of Rithalya Rajput — from school days to becoming a digital creator.</p>
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
