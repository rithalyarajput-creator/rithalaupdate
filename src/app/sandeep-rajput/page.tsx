import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';

export const revalidate = 300;

const PORTRAIT = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480814023-sandeep-rajput-rithalya-rajput-rithala-delhi.png-1HotTzrfaJxcggidFmo033DNSHDPMu.webp';
const PORTRAIT_2 = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480815703-sandeep-rajput-rithala-village-2-xymbfyECPUpkDzS95iO3FwDK5vkUim.png';

export const metadata: Metadata = {
  title: 'Sandeep Rajput (Rithalya Rajput) — Founder of Rithala Update | Digital Creator from Rithala Village, Delhi',
  description: 'Sandeep Rajput, popularly known as Rithalya Rajput, is an 18-year-old digital creator, website developer, artist and founder of Rithala Update — the digital platform of Rithala Village, Delhi. Launched on 15 August 2022.',
  keywords: 'Sandeep Rajput, Rithalya Rajput, Rithala Village, Rithala Delhi, founder of Rithala Update, digital creator Delhi, website developer Rithala, social media designer, pencil sketch artist, Maharana Pratap sketch, Sandeep Rajput biography, Sandeep Rajput age, Sandeep Rajput Instagram',
  alternates: { canonical: '/sandeep-rajput/' },
  openGraph: {
    title: 'Sandeep Rajput (Rithalya Rajput) — Founder of Rithala Update',
    description: '18-year-old digital creator, website developer and artist from Rithala Village, Delhi. Founder of Rithala Update.',
    url: '/sandeep-rajput/',
    type: 'profile',
    images: [{ url: PORTRAIT, width: 800, height: 800, alt: 'Sandeep Rajput Rithalya Rajput from Rithala Village Delhi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sandeep Rajput (Rithalya Rajput) — Rithala Update Founder',
    description: 'Digital creator, website developer and artist from Rithala Village, Delhi.',
    images: [PORTRAIT],
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sandeep Rajput',
  alternateName: ['Rithalya Rajput', 'Sandeep Rithalya Rajput'],
  url: 'https://rithalaupdate.online/sandeep-rajput/',
  image: [PORTRAIT, PORTRAIT_2],
  jobTitle: 'Digital Creator, Website Developer, Artist',
  birthPlace: 'Rithala Village, Delhi, India',
  homeLocation: {
    '@type': 'Place',
    name: 'Rithala Village, North-West Delhi, India',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Rana Pratap Government Boys Senior Secondary School, Rithala, New Delhi',
  },
  founder: {
    '@type': 'Organization',
    name: 'Rithala Update',
    url: 'https://rithalaupdate.online/',
    foundingDate: '2022-08-15',
  },
  knowsAbout: [
    'Website Development',
    'Social Media Management',
    'Creative Designing',
    'Digital Branding',
    'Pencil Sketch Art',
    'Rithala Village History',
    'Rajputana Heritage',
  ],
  description: 'Sandeep Rajput, also known as Rithalya Rajput, is an 18-year-old digital creator, website developer and artist from Rithala Village, Delhi. He is the founder of Rithala Update, a digital platform preserving the culture and history of Rithala Village.',
};

export default function SandeepRajputPage() {
  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="sr-hero">
        <div className="container sr-hero-grid">
          <div className="sr-hero-text">
            <span className="sr-eyebrow">About Me</span>
            <h1 className="sr-h1">Sandeep Rajput</h1>
            <p className="sr-alias">Also known as <strong>Rithalya Rajput</strong></p>
            <p className="sr-lead">
              Hello and welcome! I am an 18-year-old digital creator, website developer, artist
              and social media designer from <strong>Rithala Village, Delhi</strong>. I am the
              creator and founder of <Link href="/">Rithala Update</Link> — a digital platform
              dedicated to sharing the culture, history, news, events and community updates of
              Rithala Village with the world.
            </p>
            <div className="sr-cta-row">
              <Link href="/contact/" className="sr-btn-primary">
                <Icon name="mail" size={14} /> Get in Touch
              </Link>
              <Link href="/about/" className="sr-btn-ghost">
                About Rithala Update
              </Link>
            </div>
          </div>
          <div className="sr-hero-img">
            <img
              src={PORTRAIT}
              alt="Sandeep Rajput Rithalya Rajput - founder of Rithala Update from Rithala Village Delhi"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="container sr-prose">
          <h2>My Creative Journey</h2>
          <p>
            Since childhood, I have always been passionate about creativity, technology, and doing
            something unique. Whether it was drawing, designing, or creating digital content, I
            always believed in giving my full dedication to everything I create. My creative
            journey started during my school days when I developed a strong interest in art and
            pencil sketching. Over time, that creativity slowly transformed into digital
            designing, social media content creation, and website development.
          </p>

          <h2>Education</h2>
          <p>
            I completed my schooling from <strong>Rana Pratap Government Boys Senior Secondary
            School, Rithala, New Delhi</strong>. Throughout my school life, I studied in different
            schools, met many people, and learned valuable life lessons that helped shape my
            confidence, mindset, and creativity. During the lockdown period, I spent a lot of
            time improving my artistic and creative skills through drawing and design work. Even
            today, creativity remains one of the most important parts of my personality.
          </p>

          <div className="sr-img-mid">
            <img
              src={PORTRAIT_2}
              alt="Sandeep Rajput Rithala Village - digital creator and website developer"
              loading="lazy"
            />
          </div>

          <h2>The Idea Behind Rithala Update</h2>
          <p>
            The idea behind creating Rithala Update came from a simple vision — to give Rithala
            Village a strong digital identity and create one platform where people can stay
            connected with their culture, community, and local updates. Before launching the
            website, I started by posting updates, photographs, and local content on Instagram
            and social media platforms. As the audience started growing, I realized that
            Rithala needed a dedicated website where all information, memories, historical
            stories, festivals, and important updates could be preserved and accessed easily.
          </p>

          <p>
            On <strong>15 August 2022</strong>, I officially launched Rithala Update with the
            mission of digitally connecting people, spreading awareness, and preserving the
            heritage of Rithala Village. Today, the platform shares local news, cultural
            programs, historical stories, religious events, government updates, old village
            memories, and social activities through social media and the official website.
          </p>

          <h2>What I Do</h2>
          <p>
            Apart from managing Rithala Update, I also work on website development, social media
            handling, digital promotions, and creative designing. I independently designed and
            developed this website myself while also managing Instagram pages, YouTube content,
            and digital branding projects. My goal is to combine creativity and technology to
            build meaningful digital experiences that represent local culture and community identity.
          </p>

          <h3>I am passionate about:</h3>
          <ul className="sr-list">
            <li><Icon name="code" size={16} /> Website Development</li>
            <li><Icon name="users" size={16} /> Social Media Management</li>
            <li><Icon name="palette" size={16} /> Creative Designing</li>
            <li><Icon name="star" size={16} /> Digital Branding & Promotions</li>
            <li><Icon name="feather" size={16} /> Drawing & Pencil Sketch Art</li>
            <li><Icon name="flag" size={16} /> Community-Based Digital Projects</li>
          </ul>

          <h2>My Creative Works</h2>
          <p>
            Some of my best creative works include pencil sketches of <strong>Maharana Pratap</strong>,
            <strong> Little Krishna</strong>, <strong>Little Ram</strong>, <strong>Karan Aujla</strong>, and
            <strong> Virat Kohli</strong>, which represent the artistic side of my journey and creativity.
          </p>

          <h2>More Than Just a Website</h2>
          <p>
            For me, Rithala Update is not just a website or social media page — it is an emotion,
            a responsibility, and a platform created with passion for my village and community.
            Through this journey, I want to continue learning, growing, and creating digital
            content that inspires people while preserving the identity and culture of Rithala
            Village for future generations.
          </p>

          <p className="sr-closing">
            Thank you for visiting and being a part of this journey.
          </p>

          <div className="sr-cta-row">
            <Link href="/contact/" className="sr-btn-primary">
              <Icon name="mail" size={14} /> Contact Me
            </Link>
            <Link href="/blog/" className="sr-btn-ghost">
              Read the Blog
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
