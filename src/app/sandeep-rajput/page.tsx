import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';
import { getAllSettings } from '@/lib/db';
import '../ab3-styles.css';
import SchoolGallery from './SchoolGallery';

export const dynamic = 'force-dynamic';

const DEFAULT_PORTRAIT = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480814023-sandeep-rajput-rithalya-rajput-rithala-delhi.png-1HotTzrfaJxcggidFmo033DNSHDPMu.webp';
const DEFAULT_PORTRAIT_2 = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480815703-sandeep-rajput-rithala-village-2-xymbfyECPUpkDzS95iO3FwDK5vkUim.png';

const DEFAULT_ARTWORKS = [
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480852254-rajputs-warrior-art-by-sandeep-rajput-1-EcVAvTjm85N2w0aQvMnINf1q6UJHDc.png', title: 'Maharana Pratap', sub: 'Rajput Warrior Pencil Drawing by Sandeep Rajput Rithalya Rajput', alt: 'Maharana Pratap pencil drawing art by Sandeep Rajput Rithalya Rajput Rithala Delhi' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480850386-little-krishna-art-by-sandeep-rajput-My42d3DBHBriELEJVA1mOHJJo1keeD.png', title: 'Little Krishna', sub: 'Color Pencil Drawing by Sandeep Rajput Rithalya Rajput', alt: 'Little Krishna color pencil art drawing by Sandeep Rajput Rithalya Rajput Rithala Delhi' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480848621-karan-aujla-art-by-sandeep-rajput-lBjClfy7IXQpR7wTAV6B57kMszDu6w.png', title: 'Karan Aujla', sub: 'Pencil Portrait Sketch by Sandeep Rajput Rithalya Rajput', alt: 'Karan Aujla pencil portrait sketch drawing by Sandeep Rajput Rithalya Rajput Rithala Delhi' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480846991-little-ram-art-by-sandeep-rajput-CfC5gcy4UkzhNKrzWUXgaWxdUDXvuC.png', title: 'Little Ram', sub: 'Shri Ram Pencil Art by Sandeep Rajput Rithalya Rajput', alt: 'Little Ram Shri Ram pencil art drawing by Sandeep Rajput Rithalya Rajput Rithala Delhi' },
  { img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480845194-virat-kholi-art-by-sandeep-rajput-yfvTxR9dqTw0jHTXu8nBNxAQBhWGTN.png', title: 'Virat Kohli', sub: 'Cricket Legend Pencil Portrait by Sandeep Rajput Rithalya Rajput', alt: 'Virat Kohli pencil portrait drawing art by Sandeep Rajput Rithalya Rajput Rithala Delhi' },
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

  // Custom sections
  type CustomSection = { id: string; heading: string; content: string; layout: 'text-only' | 'img-left' | 'img-right'; image?: string };
  const customSections: CustomSection[] = (() => {
    try { return JSON.parse(s.am_custom_sections || '[]') || []; } catch { return []; }
  })();

  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person',
    name, alternateName: [alias],
    url: 'https://rithalaupdate.online/sandeep-rajput/',
    image: [portrait, portrait2],
    jobTitle: 'Digital Creator, Website Developer, Artist',
    birthPlace: location,
    description: bio,
    subjectOf: DEFAULT_ARTWORKS.map(a => ({
      '@type': 'VisualArtwork',
      name: `${a.title} - Pencil Drawing by ${name}`,
      image: a.img,
      description: a.alt || a.sub,
      creator: { '@type': 'Person', name },
      artMedium: 'Pencil, Color Pencil',
    })),
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

          <div className="sr-cj-section">
            <div className="sr-cj-left">
              <span className="sr-cj-number">01</span>
              <div className="sr-cj-line"></div>
            </div>
            <div className="sr-cj-right">
              <span className="sr-cj-tag">My Story</span>
              <h2 className="sr-cj-heading">My Creative Journey</h2>
              <p className="sr-cj-text">{storyJourney}</p>
              <div className="sr-cj-pills">
                <span>Drawing</span>
                <span>Digital Design</span>
                <span>Social Media</span>
                <span>Web Development</span>
              </div>
            </div>
          </div>

          {/* Journey Section — moved here below Creative Journey */}
          <div className="sr-journey-section">
            <div className="sr-journey-header">
              <span className="sr-journey-badge">My Journey</span>
              <h2 className="sr-journey-title">From Childhood to Creator — 2007 to Now</h2>
              <p className="sr-journey-lead">
                Born in 2007 into a proud Rajputana family of Rithala, Delhi — this is the journey
                of a child who grew up to become a digital creator, artist, and community builder.
              </p>
            </div>
            <div className="sr-journey-grid">
              <div className="sr-journey-card">
                <div className="sr-journey-img-wrap">
                  <img
                    src="/sandeep-rajput-rithalya-rajput-childhood-2007-rithala-delhi.png"
                    alt="Sandeep Rajput Rithalya Rajput childhood photo born 2007 Rajputana family Rithala Delhi"
                    className="sr-journey-img"
                    loading="lazy"
                  />
                  <span className="sr-journey-year-tag">Past</span>
                </div>
                <div className="sr-journey-card-body">
                  <h3>The Beginning — Childhood Days</h3>
                  <p>Born in 2007 in Rithala Village, Delhi, Sandeep Rajput (Rithalya Rajput) grew up in a loving Rajputana family. Known for his innocent smile and cheerful personality, he enjoyed a happy childhood filled with memorable moments that built his values, confidence, and determination.</p>
                  <div className="sr-journey-tags">
                    <span>Born: 2007</span>
                    <span>Rithala Village</span>
                    <span>Rajputana Family</span>
                  </div>
                </div>
              </div>
              <div className="sr-journey-card">
                <div className="sr-journey-img-wrap">
                  <img
                    src="/sandeep-rajput-rithalya-rajput-rajputana-cap-professional-rithala-delhi.png"
                    alt="Sandeep Rajput Rithalya Rajput Rajputana cap earrings professional photo Rithala Delhi"
                    className="sr-journey-img"
                    loading="lazy"
                  />
                  <span className="sr-journey-year-tag">Now</span>
                </div>
                <div className="sr-journey-card-body">
                  <h3>Growth &amp; Transformation</h3>
                  <p>From learning technology and design to building digital platforms, Sandeep Rajput (Rithalya Rajput) has grown through dedication and consistency. The boy from Rithala Village now moves forward with bigger goals, stronger ambitions, and a vision for the future.</p>
                  <div className="sr-journey-tags">
                    <span>Digital Creator</span>
                    <span>Rithala Update</span>
                    <span>Always Growing</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sr-journey-cta-wrap">
              <a href="/sandeep-rajput-journey/" className="sr-journey-cta-btn">
                View My Full Journey — 2007 to Present
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Education Section — blue bg like hobbies */}
      <section className="sr-edu-section">
        <div className="container sr-edu-inner">
          <div className="sr-edu-text">
            <span className="sr-edu-badge">Education</span>
            <h2 className="sr-edu-heading">My School Journey</h2>
            <p className="sr-edu-desc">
              My schooling journey was different from most students. I studied in both private and
              government schools, experienced different environments, and made many friendships along
              the way. Every school taught me something valuable and helped me grow as a person.
            </p>
            <p className="sr-edu-desc">
              One thing I learned is that no school is good or bad — what truly matters is the
              student&apos;s willingness to learn. With dedication and hard work, success can be
              achieved from anywhere.
            </p>
            <blockquote className="sr-edu-quote">
              &ldquo;A school does not define a student&apos;s future; a student&apos;s dedication
              defines their success.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* School Banner — inside edu section, no gap */}
        <div className="sr-school-banner">
          <img
            src="https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780126495893-sandeep-rajput-rithalya-rajput-rana-pratap-sarvodaya-school-rithala-delhi.jpg-aOf2OUhgtMt1zncuB5nE4EAvhOsiRU.jpg"
            alt="Sandeep Rajput Rithalya Rajput with classmates birthday celebration Rana Pratap School Rithala Delhi"
            className="sr-school-banner-img"
            loading="lazy"
          />
          <div className="sr-school-banner-btns-below">
            <span className="sr-school-banner-badge">6 Schools · Nursery to Class 12 · Rithala, Delhi</span>
            <div className="sr-school-banner-btns">
              <SchoolGallery />
              <a href="/sandeep-rajput-school/" className="sr-school-banner-btn">
                Full School Journey
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="sr-hobbies-full">
          <div className="container sr-hobbies-grid">
            <div className="sr-hobbies-text">
              <span className="sr-hobbies-badge">My Hobbies</span>
              <h2 className="sr-hobbies-heading">Multi-Talented &amp; Always Exploring</h2>
              <blockquote className="sr-hobbies-quote">
                &ldquo;I believe every person should try everything at least once.
                If you have the passion to do it — nothing is truly difficult.
                And if you do nothing, even the simplest things feel impossible.&rdquo;
              </blockquote>
              <p className="sr-hobbies-desc">
                Since childhood, I have had a wide range of interests and hobbies. I am naturally
                a multi-tasker — I love learning new things, picking up new skills, and constantly
                challenging myself. Whether it is art, technology, fitness, or content creation,
                I believe in giving everything my best effort.
              </p>
              <div className="sr-hobby-grid">
                <div className="sr-hobby-item sr-hobby-item--dark">
                  <svg className="sr-hobby-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-1.414.95l-3.414.95.95-3.414a4 4 0 01.95-1.414z"/></svg>
                  <span>Drawing &amp; Pencil Art</span>
                </div>
                <div className="sr-hobby-item sr-hobby-item--dark">
                  <svg className="sr-hobby-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.2.646.312 1.348.312 2.066s-.112 1.42-.312 2.066M3.812 13.066C3.612 12.42 3.5 11.718 3.5 11s.112-1.42.312-2.066M15.536 4.464a9 9 0 11-7.072 0"/><rect x="2" y="7" width="20" height="14" rx="2"/><circle cx="12" cy="13" r="3"/></svg>
                  <span>Photography</span>
                </div>
                <div className="sr-hobby-item sr-hobby-item--dark">
                  <svg className="sr-hobby-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  <span>Social Media</span>
                </div>
                <div className="sr-hobby-item sr-hobby-item--dark">
                  <svg className="sr-hobby-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span>Website Development</span>
                </div>
                <div className="sr-hobby-item sr-hobby-item--dark">
                  <svg className="sr-hobby-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17 12c0 2.5-2 4.5-4 6s-4-1-4-3.5c0-3 2.5-5.5 4-7 1.5 1.5 4 4 4 4.5z"/><path d="M8.5 14.5c-1 1.5-2 3-2 4 0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5"/></svg>
                  <span>Creativity &amp; Design</span>
                </div>
                <div className="sr-hobby-item sr-hobby-item--dark">
                  <svg className="sr-hobby-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.07A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14"/><rect x="1" y="6" width="15" height="12" rx="2"/></svg>
                  <span>Video Creation</span>
                </div>
                <div className="sr-hobby-item sr-hobby-item--dark">
                  <svg className="sr-hobby-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span>Always Learning</span>
                </div>
              </div>
            </div>
            <div className="sr-hobbies-img-wrap">
              <img
                src="/sandeep-rajput-rithalya-rajput-personal-lifestyle-rithala-delhi.webp"
                alt="Sandeep Rajput Rithalya Rajput personal lifestyle hobbies photography Rithala Delhi"
                className="sr-hobbies-img"
                loading="lazy"
              />
            </div>
          </div>
      </section>
      <section className="sr-prose-section">
        <div className="container sr-prose">

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

          {customSections.map((sec) => (
            <div key={sec.id} className="sr-custom-section">
              {sec.layout === 'text-only' || !sec.image ? (
                <div className="sr-csec-text-only">
                  {sec.heading && <h2>{sec.heading}</h2>}
                  <p>{sec.content}</p>
                </div>
              ) : sec.layout === 'img-left' ? (
                <div className="sr-csec-split">
                  <img src={sec.image} alt={sec.heading} loading="lazy" />
                  <div className="sr-csec-split-body">
                    {sec.heading && <h2>{sec.heading}</h2>}
                    <p>{sec.content}</p>
                  </div>
                </div>
              ) : (
                <div className="sr-csec-split">
                  <div className="sr-csec-split-body">
                    {sec.heading && <h2>{sec.heading}</h2>}
                    <p>{sec.content}</p>
                  </div>
                  <img src={sec.image} alt={sec.heading} loading="lazy" />
                </div>
              )}
            </div>
          ))}

        </div>
      </section>

      {/* Art Gallery — redesigned */}
      <section className="sr-art-section">
        <div className="sr-art-inner">
          <div className="sr-art-left">
            <span className="sr-art-badge">Self-Taught Artist</span>
            <h2 className="sr-art-heading">Passion for Drawing &amp; Creativity</h2>
            <p className="sr-art-desc">
              Self-taught artist from Rithala, Delhi. Pencil sketches, color paintings, and handmade
              craft projects — every artwork tells a story of passion and dedication.
            </p>
            <a href="/sandeep-rajput-drawings/" className="sr-art-btn">
              View All Drawings &amp; Art
            </a>
          </div>
          <div className="sr-art-right">
            <div className="sr-art-scroll">
              {finalArtworks.map((art, i) => (
                <figure key={i} className="sr-art-slide">
                  <img
                    src={art.img!}
                    alt={(art as any).alt || `${art.title} drawing by ${name}`}
                    loading="lazy"
                  />
                  <figcaption>{art.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Karan Aujla Inspiration Section */}
      <section className="sr-karan-section">
        <div className="sr-karan-inner">
          <div className="sr-karan-img-wrap">
            <img
              src="https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480848621-karan-aujla-art-by-sandeep-rajput-lBjClfy7IXQpR7wTAV6B57kMszDu6w.png"
              alt="Karan Aujla pencil sketch drawing by Sandeep Rajput Rithalya Rajput"
              className="sr-karan-img"
              loading="lazy"
            />
            <span className="sr-karan-img-tag">My Drawing</span>
          </div>
          <div className="sr-karan-content">
            <span className="sr-karan-badge">Inspiration</span>
            <h2 className="sr-karan-heading">Inspired by Karan Aujla</h2>
            <p className="sr-karan-text">
              I have been a fan of Karan Aujla since 2018. What inspires me most is not just his music
              but his journey, hard work, and dedication. His growth from a struggling artist to an
              international star motivates me to stay focused on my goals and keep working consistently.
              As a creator, I admire his passion, confidence, and never-give-up mindset.
            </p>
            <div className="sr-karan-quote-wrap">
              <span className="sr-karan-quote-label">Favorite Quote</span>
              <blockquote className="sr-karan-quote">
                &ldquo;Work hard in silence, let success make the noise.&rdquo;
                <cite>— Karan Aujla 🎵✨</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

        <div className="container sr-prose">
          <h2>More Than Just a Website</h2>
          <p>For me, Rithala Update is not just a website or social media page — it is an emotion, a responsibility, and a platform created with passion for my village and community.</p>

          <p className="sr-closing">{closing}</p>

          <div className="sr-cta-row">
            <Link href="/contact/" className="sr-btn-primary"><Icon name="mail" size={14} /> Contact Me</Link>
            <Link href="/blog/" className="sr-btn-ghost">Read the Blog</Link>
          </div>
        </div>
    </PublicShell>
  );
}
