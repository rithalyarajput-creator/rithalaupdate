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

            {/* Social links */}
            <div className="sr-social-row">
              <a href={s.am_instagram || 'https://www.instagram.com/rithalya_rajput/'} target="_blank" rel="noopener" className="sr-social-btn sr-ig" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
              <a href={s.am_facebook || 'https://www.facebook.com/rithalya.rajput'} target="_blank" rel="noopener" className="sr-social-btn sr-fb" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a href={s.am_youtube || 'https://www.youtube.com/@rithalyarajput'} target="_blank" rel="noopener" className="sr-social-btn sr-yt" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                YouTube
              </a>
              <a href={s.am_linkedin || 'https://in.linkedin.com/in/sandeep-rajput-sumal'} target="_blank" rel="noopener" className="sr-social-btn sr-li" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>

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
