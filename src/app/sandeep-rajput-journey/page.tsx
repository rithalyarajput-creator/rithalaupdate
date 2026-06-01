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
    year: '2007 – 2010',
    title: 'Born into a Rajputana Family',
    desc: 'Sandeep Rajput was born in 2007 into a proud Rajputana family in Rithala, North Delhi. His earliest years were spent in the loving environment of a heritage-rich household, where values of honour, pride, and hard work were instilled from the very beginning.',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780296201099-sandeep-rajput-rithalya-rajput-childhood-image-2007-rithala-village.jpg-bAA4s3qTzxVxRFHxXAlAEUXcU26O42.png',
    imageAlt: 'Sandeep Rajput Rithalya Rajput childhood photo 2007 Rithala village Delhi',
    tags: ['Born 2007', 'Rithala, Delhi', 'Rajputana Family'],
  },
  {
    year: '2011 – 2013',
    title: 'Early Childhood & First School Years',
    desc: 'These were the years of curiosity and discovery. Sandeep began his schooling in Rithala and quickly showed a natural flair for drawing, painting, and creative thinking. He would spend hours sketching figures and exploring art in any medium he could find.',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780296187062-sandeep-rajput-rithalya-rajput-childhood-image-2010-rithala-village.jpg-5okqLac7DY5gGITpd0s4ZfvhX90jss.png',
    imageAlt: 'Sandeep Rajput Rithalya Rajput childhood photo 2010 Rithala village Delhi',
    tags: ['Primary School', 'Drawing & Art', 'Rithala'],
  },
  {
    year: '2014 – 2015',
    title: 'Growing Up in Rithala',
    desc: 'A period of growth and exploration. Sandeep deepened his connection to Rithala Village — its streets, its people, and its rich Rajput heritage. His artistic interests continued to develop, and he began taking his sketching and pencil work more seriously.',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780296206496-sandeep-rajput-rithalya-rajput-childhood-image-2013-rithala-village.jpg-PhP4KymPhxekQLezfulQTFJY8vFybh.png',
    imageAlt: 'Sandeep Rajput Rithalya Rajput childhood photo 2013 Rithala village Delhi',
    tags: ['Rithala Village', 'Pencil Art', 'Heritage'],
  },
  {
    year: '2016 – 2017',
    title: 'Middle School — Building Skills',
    desc: 'Entering his middle school years, Sandeep became more focused and disciplined. He began creating more complex artworks — portraits of historical figures and cricket stars — and developed a strong personal style in pencil and colour pencil work.',
    image: null,
    tags: ['Middle School', 'Portrait Art', 'Creative Skills'],
  },
  {
    year: '2018 – 2019',
    title: 'Joined Rana Pratap School — Class 7',
    desc: 'Joined the prestigious Rana Pratap Government Boys Senior Secondary School, Rithala, in Class 7. The school ran in the afternoon shift (1:00 PM – 6:00 PM). Here he found inspiring teachers, meaningful friendships, and a structured environment that shaped his discipline and character.',
    image: null,
    tags: ['Class 7', 'Rana Pratap School', 'New Chapter'],
  },
  {
    year: '2020 – 2021',
    title: 'Art Flourishes — The Pandemic Years',
    desc: 'During the pandemic period, Sandeep channelled his energy into art and digital exploration. He created detailed pencil portraits of Maharana Pratap, Lord Krishna, Virat Kohli, Little Ram, and Karan Aujla — artworks that would later define his creative identity online.',
    image: null,
    tags: ['Pencil Art', 'Portraits', 'Digital Exploration'],
  },
  {
    year: '2022 – 2023',
    title: 'Class 12 & Discovering Digital Creation',
    desc: 'Completing his senior secondary education while simultaneously diving deep into digital design, social media content creation, photography, and website development. This was the turning point — a bridge between traditional art and the digital world.',
    image: null,
    tags: ['Class 12', 'Digital Design', 'Social Media', 'Photography'],
  },
  {
    year: '2023 – 2024',
    title: 'Founded Rithala Update',
    desc: 'Launched Rithala Update — a digital platform dedicated to sharing the culture, history, news, and Rajput heritage of Rithala Village with the world. Independently designed and developed the entire website from scratch, combining technical skill with creative vision.',
    image: null,
    tags: ['Rithala Update', 'Website Launch', 'Founder', 'Developer'],
  },
  {
    year: '2024 – 2025',
    title: 'Growing as a Creator & Building Community',
    desc: 'A year of significant growth — expanding Rithala Update, growing social media presence on Instagram and YouTube, taking on website development and digital branding projects, and establishing himself as a recognised digital creator from Rithala, Delhi.',
    image: null,
    tags: ['Content Creation', 'Community Building', 'YouTube', 'Instagram'],
  },
  {
    year: '2025 – Present',
    title: 'Rithalya Rajput — A Digital Legacy',
    desc: 'Today, Sandeep Rajput — proudly known as Rithalya Rajput — stands as a full-time digital creator, pencil artist, website developer, and founder of Rithala Update. He carries his Rajputana heritage with pride, wearing it as an identity — from the Rajasthani cap to the Rajput earrings — while building a lasting digital legacy from the lanes of Rithala, Delhi.',
    image: '/sandeep-rajput-rithalya-rajput-rajputana-cap-professional-rithala-delhi.png',
    imageAlt: 'Sandeep Rajput Rithalya Rajput Rajputana cap professional photo Rithala Delhi present 2025',
    tags: ['Digital Creator', 'Artist', 'Rithalya Rajput', 'Rithala Update', 'Rajputana Pride'],
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

              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div key={i} className={`jrn-item jrn-item--${isLeft ? 'left' : 'right'} jrn-item--anim`}>
                    {/* Image */}
                    <div className="jrn-card-img-wrap">
                      {item.image ? (
                        <img src={item.image} alt={item.imageAlt || item.title} className="jrn-card-img" loading="lazy" />
                      ) : (
                        <div className="jrn-no-img">⚔</div>
                      )}
                    </div>

                    {/* Center dot */}
                    <div className="jrn-dot-col">
                      <div className="jrn-dot"></div>
                    </div>

                    {/* Text */}
                    <div className="jrn-card-text">
                      <span className="jrn-year-pill">{item.year}</span>
                      <h2>{item.title}</h2>
                      <p>{item.desc}</p>
                      <div className="jrn-tags">
                        {item.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                      </div>
                    </div>
                  </div>
                );
              })}
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
