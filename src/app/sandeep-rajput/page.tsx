import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';
import { getAllSettings } from '@/lib/db';
import '../ab3-styles.css';

export const revalidate = 60;

const DEFAULT_PORTRAIT = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480814023-sandeep-rajput-rithalya-rajput-rithala-delhi.png-1HotTzrfaJxcggidFmo033DNSHDPMu.webp';
const DEFAULT_PORTRAIT_2 = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480815703-sandeep-rajput-rithala-village-2-xymbfyECPUpkDzS95iO3FwDK5vkUim.png';

const DEFAULT_ARTWORKS = [
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480852254-rajputs-warrior-art-by-sandeep-rajput-1-EcVAvTjm85N2w0aQvMnINf1q6UJHDc.png', title: 'Maharana Pratap', sub: 'Legendary Rajput Warrior | Sketch by Sandeep Rajput' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480850386-little-krishna-art-by-sandeep-rajput-My42d3DBHBriELEJVA1mOHJJo1keeD.png', title: 'Little Krishna', sub: 'Pencil Drawing by Sandeep Rajput' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480848621-karan-aujla-art-by-sandeep-rajput-lBjClfy7IXQpR7wTAV6B57kMszDu6w.png', title: 'Karan Aujla', sub: 'Punjabi Singer Sketch by Sandeep Rajput' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480846991-little-ram-art-by-sandeep-rajput-CfC5gcy4UkzhNKrzWUXgaWxdUDXvuC.png', title: 'Little Ram', sub: 'Pencil Art by Sandeep Rajput' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480845194-virat-kholi-art-by-sandeep-rajput-yfvTxR9dqTw0jHTXu8nBNxAQBhWGTN.png', title: 'Virat Kohli', sub: 'Pencil Portrait by Sandeep Rajput' },
];

const DEFAULT_SKILLS = [
  'Website Development',
  'Social Media Management',
  'Creative Designing',
  'Digital Branding & Promotions',
  'Drawing & Pencil Sketch Art',
  'Community-Based Digital Projects',
];

export async function generateMetadata(): Promise<Metadata> {
  const s: Record<string, string> = await getAllSettings().catch(() => ({}));
  const name = s.am_name || 'Sandeep Rajput';
  const alias = s.am_alias || 'Rithalya Rajput';
  const portrait = s.am_portrait || DEFAULT_PORTRAIT;
  return {
    title: `${name} (${alias}) — Founder of Rithala Update | Digital Creator from Rithala Village, Delhi`,
    description: `${name}, popularly known as ${alias}, is a digital creator, website developer, artist and founder of Rithala Update — the digital platform of Rithala Village, Delhi.`,
    keywords: 'Sandeep Rajput, Rithalya Rajput, Rithala Village, Rithala Delhi, founder of Rithala Update, digital creator Delhi',
    alternates: { canonical: '/sandeep-rajput/' },
    openGraph: {
      title: `${name} (${alias}) — Founder of Rithala Update`,
      description: 'Digital creator, website developer and artist from Rithala Village, Delhi.',
      url: '/sandeep-rajput/', type: 'profile',
      images: [{ url: portrait, width: 800, height: 800, alt: `${name} from Rithala Village Delhi` }],
    },
    twitter: { card: 'summary_large_image', title: `${name} — Rithala Update Founder`, images: [portrait] },
  };
}

export default async function SandeepRajputPage() {
  const s: Record<string, string> = await getAllSettings().catch(() => ({}));

  const name     = s.am_name     || 'Sandeep Rajput';
  const alias    = s.am_alias    || 'Rithalya Rajput';
  const age      = s.am_age      || '18-year-old';
  const location = s.am_location || 'Rithala Village, Delhi';
  const bio      = s.am_bio      || `Hello and welcome! I am an ${age} digital creator, website developer, artist and social media designer from ${location}. I am the creator and founder of Rithala Update — a digital platform dedicated to sharing the culture, history, news, events and community updates of Rithala Village with the world.`;
  const portrait  = s.am_portrait  || DEFAULT_PORTRAIT;
  const portrait2 = s.am_portrait2 || DEFAULT_PORTRAIT_2;
  const closing   = s.am_closing   || 'Thank you for visiting and being a part of this journey.';

  const storyJourney  = s.am_story_journey   || `Since childhood, I have always been passionate about creativity, technology, and doing something unique. Whether it was drawing, designing, or creating digital content, I always believed in giving my full dedication to everything I create. My creative journey started during my school days when I developed a strong interest in art and pencil sketching. Over time, that creativity slowly transformed into digital designing, social media content creation, and website development.`;
  const storyEducation = s.am_story_education || `I completed my schooling from Rana Pratap Government Boys Senior Secondary School, Rithala, New Delhi. Throughout my school life, I studied in different schools, met many people, and learned valuable life lessons that helped shape my confidence, mindset, and creativity.`;
  const storyIdea     = s.am_story_idea       || `The idea behind creating Rithala Update came from a simple vision — to give Rithala Village a strong digital identity and create one platform where people can stay connected with their culture, community, and local updates.`;
  const storyWhat     = s.am_story_what       || `Apart from managing Rithala Update, I also work on website development, social media handling, digital promotions, and creative designing. I independently designed and developed this website myself while also managing Instagram pages, YouTube content, and digital branding projects.`;

  // Skills
  const skillsRaw = s.am_skills || DEFAULT_SKILLS.join('\n');
  const skills = skillsRaw.split('\n').map(l => l.trim()).filter(Boolean);

  // Artworks from settings (fall back to defaults)
  const artworkKeys = ['am_art_1', 'am_art_2', 'am_art_3', 'am_art_4', 'am_art_5'];
  const artworks = artworkKeys
    .map(k => ({ img: s[`${k}_img`], title: s[`${k}_title`], sub: s[`${k}_sub`] }))
    .filter(a => a.img && a.title);
  const finalArtworks = artworks.length > 0 ? artworks : DEFAULT_ARTWORKS;

  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person',
    name, alternateName: [alias],
    url: 'https://rithalaupdate.online/sandeep-rajput/',
    image: [portrait, portrait2],
    jobTitle: 'Digital Creator, Website Developer, Artist',
    birthPlace: location,
    description: bio,
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <section className="sr-hero">
        <div className="container sr-hero-grid">
          <div className="sr-hero-text">
            <span className="sr-eyebrow">About Me</span>
            <h1 className="sr-h1">{name}</h1>
            <p className="sr-alias">Also known as <strong>{alias}</strong></p>
            <p className="sr-lead">{bio}</p>
            <div className="sr-cta-row">
              <Link href="/contact/" className="sr-btn-primary">
                <Icon name="mail" size={14} /> Get in Touch
              </Link>
              <Link href="/about/" className="sr-btn-ghost">About Rithala Update</Link>
            </div>
          </div>
          <div className="sr-hero-img">
            <img src={portrait} alt={`${name} ${alias} - founder of Rithala Update from Rithala Village Delhi`} loading="eager" />
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="container sr-prose">

          <h2>My Creative Journey</h2>
          <p>{storyJourney}</p>

          <h2>Education</h2>
          <p>{storyEducation}</p>

          <h2>The Idea Behind Rithala Update</h2>
          {portrait2 && <img src={portrait2} alt={`${name} - digital creator and website developer`} loading="lazy" className="sr-img-float" />}
          <p>{storyIdea}</p>

          <h2>What I Do</h2>
          <p>{storyWhat}</p>

          {skills.length > 0 && (
            <>
              <h3>I am passionate about:</h3>
              <ul className="sr-list">
                {skills.map((skill, i) => (
                  <li key={i}>
                    <Icon name={['dashboard','users','image','star','feather','flag','globe','heart'][i % 8] as any} size={16} />
                    {skill}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2>My Art Gallery</h2>
          <p>Some of my best creative works — each piece representing a different side of my artistic journey.</p>
        </div>

        <div className="sr-gallery-scroll-wrap">
          <div className="sr-gallery-scroll">
            {finalArtworks.map((art, i) => (
              <figure key={i} className="sr-art-card-h">
                <div className="sr-art-img-h">
                  <img src={art.img!} alt={`${art.title} by ${name}`} loading="lazy" />
                </div>
                <figcaption>
                  <strong>{art.title}</strong>
                  <small>{art.sub}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="container sr-prose">
          <h2>More Than Just a Website</h2>
          <p>For me, Rithala Update is not just a website or social media page — it is an emotion, a responsibility, and a platform created with passion for my village and community.</p>

          <p className="sr-closing">{closing}</p>

          <div className="sr-cta-row">
            <Link href="/contact/" className="sr-btn-primary"><Icon name="mail" size={14} /> Contact Me</Link>
            <Link href="/blog/" className="sr-btn-ghost">Read the Blog</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
