import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import JourneyAnim from './JourneyAnim';
import './styles.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Sandeep Rajput Journey — From 2007 to Present | Rithala Update',
  description: 'The complete life journey of Sandeep Rajput (Rithalya Rajput) — from childhood in 2007 to becoming a digital creator, artist and founder of Rithala Update, Delhi.',
  keywords: 'Sandeep Rajput journey, Rithalya Rajput life story, Sandeep Rajput 2007, Rithala Delhi, Rajputana family',
  alternates: { canonical: '/sandeep-rajput-journey/' },
  openGraph: {
    title: 'Sandeep Rajput Journey — From 2007 to Present',
    description: 'Complete life journey of Sandeep Rajput Rithalya Rajput from Rithala, Delhi.',
    url: `${SITE}/sandeep-rajput-journey/`,
    type: 'profile',
  },
};

const TIMELINE = [
  {
    year: '2007',
    title: 'Born into a Rajputana Family',
    desc: 'Sandeep Rajput was born in 2007 into a proud Rajputana family in Rithala, North Delhi. From the very beginning, he was raised with the values of heritage, honour, and hard work.',
    image: '/sandeep-rajput-rithalya-rajput-childhood-2007-rithala-delhi.png',
    imageAlt: 'Sandeep Rajput Rithalya Rajput childhood photo born 2007 Rajputana family Rithala Delhi',
    tags: ['Born 2007', 'Rithala, Delhi', 'Rajputana Family'],
    side: 'left',
  },
  {
    year: '2013–2014',
    title: 'Early School Years',
    desc: 'Began his schooling journey in Rithala. These early years sparked an interest in art, drawing, and creative expression. He spent time sketching and developing his artistic skills during school hours and at home.',
    image: null,
    tags: ['Primary School', 'Art & Drawing', 'Rithala'],
    side: 'right',
  },
  {
    year: '2019',
    title: 'Joined Rana Pratap School — Class 7',
    desc: 'Joined Rana Pratap Government Boys Senior Secondary School, Rithala, in Class 7. The school ran in the afternoon shift (1 PM – 6 PM). This chapter brought new friendships, dedicated teachers, and a stronger sense of discipline and identity.',
    image: null,
    tags: ['Class 7', 'Rana Pratap School', 'Afternoon Shift'],
    side: 'left',
  },
  {
    year: '2021',
    title: 'Growing Passion for Art',
    desc: 'During his middle school years, Sandeep\'s passion for pencil art and drawing grew significantly. He created portrait sketches of Maharana Pratap, Lord Krishna, Virat Kohli, and other iconic figures — developing a distinctive artistic style.',
    image: null,
    tags: ['Pencil Art', 'Portrait Sketching', 'Creative Growth'],
    side: 'right',
  },
  {
    year: '2022',
    title: 'Discovering Digital Creation',
    desc: 'Started exploring digital design, social media content creation, and photography. This was the turning point — traditional art skills combined with digital tools opened a new world of creative possibilities.',
    image: null,
    tags: ['Digital Design', 'Social Media', 'Photography'],
    side: 'left',
  },
  {
    year: '2023',
    title: 'Class 12 — Final School Year',
    desc: 'Completed his senior secondary education at Rana Pratap School. While preparing for board exams, he continued to work on digital projects and grew his understanding of web design, content creation, and community building.',
    image: null,
    tags: ['Class 12', 'Board Exams', 'Digital Projects'],
    side: 'right',
  },
  {
    year: '2024',
    title: 'Founded Rithala Update',
    desc: 'Launched Rithala Update — a digital platform dedicated to sharing the culture, history, news, and heritage of Rithala Village with the world. Independently designed and developed the website from scratch.',
    image: null,
    tags: ['Rithala Update', 'Website Launch', 'Founder'],
    side: 'left',
  },
  {
    year: 'Present',
    title: 'Digital Creator & Artist — Rithalya Rajput',
    desc: 'Today, Sandeep Rajput — known as Rithalya Rajput — is a full-time digital creator, artist, website developer, and social media content creator. He carries his Rajputana heritage with pride while building a modern digital legacy from Rithala, Delhi.',
    image: '/sandeep-rajput-rithalya-rajput-rajputana-cap-professional-rithala-delhi.png',
    imageAlt: 'Sandeep Rajput Rithalya Rajput Rajputana cap professional photo Rithala Delhi present day',
    tags: ['Digital Creator', 'Artist', 'Rithalya Rajput', 'Rithala Update'],
    side: 'right',
  },
];

export default function JourneyPage() {
  return (
    <PublicShell>
      <main className="jrn-page">
        {/* Hero */}
        <section className="jrn-hero">
          <div className="jrn-hero-inner">
            <span className="jrn-hero-badge">2007 — Present</span>
            <h1>The Journey of Sandeep Rajput</h1>
            <p className="jrn-hero-sub">Rithalya Rajput — From a Child of Rithala to a Digital Creator</p>
          </div>
        </section>

        {/* Timeline */}
        <section className="jrn-timeline-section">
          <div className="jrn-container">
            <div className="jrn-timeline">
              <div className="jrn-timeline-line"></div>

              {TIMELINE.map((item, i) => (
                <div key={i} className={`jrn-item jrn-item--${item.side} jrn-item--anim`}>
                  <div className="jrn-dot">
                    <span>{item.year}</span>
                  </div>
                  <div className="jrn-card">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        className="jrn-card-img"
                        loading="lazy"
                      />
                    )}
                    <div className="jrn-card-body">
                      <span className="jrn-year-pill">{item.year}</span>
                      <h2>{item.title}</h2>
                      <p>{item.desc}</p>
                      <div className="jrn-tags">
                        {item.tags.map((tag, j) => (
                          <span key={j}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <JourneyAnim />
        {/* CTA */}
        <section className="jrn-cta">
          <div className="jrn-container">
            <h2>Discover More About Sandeep Rajput</h2>
            <p>Learn about his work, art, and the story behind Rithala Update.</p>
            <div className="jrn-cta-btns">
              <a href="/sandeep-rajput/" className="jrn-btn jrn-btn--gold">About Me</a>
              <a href="/rithala-village-history/" className="jrn-btn jrn-btn--outline">Rithala Village History</a>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
