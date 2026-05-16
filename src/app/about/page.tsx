import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import '../ab3-styles.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Us  Rithala Update | Story, Mission & Vision',
  description: 'About Rithala Update  a digital platform created by Sandeep Rajput (Rithalya Rajput) to share the latest news, history, culture, festivals and updates of Rithala Village, Delhi. Officially launched on 17 May 2026.',
  keywords: 'About Rithala Update, Rithala Village Delhi, Sandeep Rajput, Rithalya Rajput, Rithala history, digital village platform',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Rithala Update  Sandeep Rajput',
    description: 'Digital platform for Rithala Village, Delhi. Sharing news, history, culture, festivals and community updates since 17 May 2026.',
    url: '/about/',
    type: 'website',
  },
};

const PILLARS = [
  {
    title: 'Local News & Updates',
    titleHi: 'ताज़ा खबरें',
    text: 'Latest news, village updates, government announcements and important information related to Rithala Village, Delhi delivered in one place.',
    textHi: 'रिठाला गाँव की ताज़ा खबरें, सरकारी घोषणाएँ और सामुदायिक अपडेट एक ही जगह पर।',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    title: 'Village History',
    titleHi: 'गाँव का इतिहास',
    text: 'Documenting 640+ years of Rithala history, founded in 1384-85 by Rana Rajpal Singh, preserving Tomar Chandravanshi Rajput heritage.',
    textHi: '640+ वर्षों के रिठाला के इतिहास को संरक्षित करना  1384 में राणा राजपाल सिंह द्वारा बसाया गया।',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21h18M9 21V9l3-6 3 6v12M9 12h6M5 21V11l-2-2M19 21V11l2-2" />
      </svg>
    ),
  },
  {
    title: 'Photos & Memories',
    titleHi: 'फ़ोटो और यादें',
    text: 'Galleries from Kawad Yatra, Janmashtami, temple events, festivals and everyday village life  old memories preserved digitally.',
    textHi: 'कावड़ यात्रा, जन्माष्टमी, मंदिर उत्सव और रोज़मर्रा की गाँव की ज़िंदगी की यादें डिजिटल रूप में सहेजी गई हैं।',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    title: 'Reels & Videos',
    titleHi: 'रील्स और वीडियो',
    text: 'Bhakti reels, cultural moments, temple darshan and Rajputana pride videos shared through Instagram, YouTube and our website.',
    textHi: 'भक्ति रील्स, सांस्कृतिक पल और राजपूताना गर्व के वीडियो Instagram, YouTube और वेबसाइट पर।',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="6" width="15" height="12" rx="2" />
        <path d="M22 8.5l-5 3.5 5 3.5V8.5z" />
      </svg>
    ),
  },
  {
    title: 'Community Connection',
    titleHi: 'समुदाय जुड़ाव',
    text: 'Connecting Rithala residents around the world through stories, testimonials, festivals and shared cultural identity.',
    textHi: 'दुनिया भर में रिठाला के लोगों को कहानियों, त्योहारों और सांस्कृतिक पहचान से जोड़ना।',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

const TIMELINE = [
  { year: '2020', text: 'Rithala Update started on Instagram and social media  sharing village updates, photos and local news', textHi: '2020 में Instagram और social media पर रिठाला अपडेट की शुरुआत हुई' },
  { year: '2026', text: 'Official Rithala Update website launched on 17 May 2026', textHi: '17 मई 2026 को आधिकारिक Rithala Update वेबसाइट लॉन्च हुई' },
  { year: '2024', text: 'Photo archives, Reels and community submissions expanded', textHi: 'फ़ोटो आर्काइव, Reels और सामुदायिक सबमिशन का विस्तार हुआ' },
  { year: '2026', text: 'Full digital platform with AI chatbot, FAQs and Testimonials', textHi: 'AI chatbot, FAQs और Testimonials के साथ पूर्ण डिजिटल प्लेटफ़ॉर्म' },
];

const FAQS = [
  {
    q: 'When did Rithala Update start?',
    qHi: 'रिठाला अपडेट कब शुरू हुआ?',
    a: 'The Rithala Update website was officially launched on 17 May 2026. Before that, updates were shared on Instagram and social media since 2020.',
    aHi: 'रिठाला अपडेट वेबसाइट 17 मई 2026 को लॉन्च हुई। इससे पहले 2020 से Instagram पर अपडेट शेयर होती थीं।',
  },
  {
    q: 'Who created Rithala Update?',
    qHi: 'रिठाला अपडेट किसने बनाया?',
    a: 'Rithala Update was created and is managed by Sandeep Rajput (Rithalya Rajput)  a digital creator, website developer and artist from Rithala Village, Delhi.',
    aHi: 'रिठाला अपडेट को संदीप राजपूत (Rithalya Rajput) ने बनाया  जो रिठाला गाँव के एक digital creator, website developer और artist हैं।',
  },
  {
    q: 'What is the history of Rithala Village?',
    qHi: 'रिठाला गाँव का इतिहास क्या है?',
    a: 'Rithala Village was founded in 1384-85 by Rana Rajpal Singh (Tomar Chandravanshi Rajput). Located in North-West Delhi, it is a historic village known for its Rajputana heritage and bravery.',
    aHi: 'रिठाला गाँव की स्थापना 1384-85 में राणा राजपाल सिंह (तोमर चंद्रवंशी राजपूत) ने की थी। यह दिल्ली के उत्तर-पश्चिम में स्थित है।',
  },
  {
    q: 'Can I share my photos and stories?',
    qHi: 'क्या मैं अपनी फ़ोटो और कहानी शेयर कर सकता हूँ?',
    a: 'Yes! You can share your photos, memories and stories with us through the Contact page. We welcome all community contributions to preserve Rithala\'s heritage.',
    aHi: 'हाँ! Contact page के ज़रिए आप अपनी फ़ोटो, यादें और कहानियाँ हमारे साथ शेयर कर सकते हैं।',
  },
];

export default async function AboutPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));
  const logoUrl = settings.site_logo_url || '/logo.png';

  return (
    <PublicShell>

      {/* HERO */}
      <section className="ab-hero">
        <div className="ab-hero-shapes" aria-hidden="true">
          <span className="ab-shape ab-shape-1" />
          <span className="ab-shape ab-shape-2" />
        </div>
        <div className="container ab-hero-inner">
          <div className="ab-logo-pill">
            <div className="ab-logo-img">
              <img src={logoUrl} alt="Rithala Update" />
            </div>
            <div className="ab-logo-meta">
              <strong>Rithala Update</strong>
              <span>Social Media: 2020 onwards</span>
              <span>Website: 17 May 2026</span>
            </div>
          </div>

          <div className="ab-hero-label">About Us</div>
          <h1 className="ab-hero-h1">
            The Story Behind<br />
            <span>Rithala Update</span>
          </h1>
          <p className="ab-hero-sub">
            A digital platform preserving the identity, culture and heritage of
            Rithala Village, Delhi  created by <strong>Sandeep Rajput</strong> (Rithalya Rajput).
          </p>
          <p className="ab-hero-sub-hi">
            रिठाला गाँव की पहचान, संस्कृति और विरासत को डिजिटल रूप में संरक्षित करने के लिए बनाया गया मंच।
          </p>

          <div className="ab-stats">
            {[
              { n: '640+', l: 'Years of Heritage' },
              { n: 'May 2026', l: 'Website Launched' },
              { n: '1384', l: 'Village Founded' },
              { n: '1', l: 'Founder & Creator' },
            ].map(s => (
              <div key={s.n} className="ab-stat">
                <strong>{s.n}</strong>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="ab-section">
        <div className="container">
          <div className="ab-mission">
            <div className="ab-mission-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h2>Our Mission</h2>
            <p className="ab-mission-p">
              To digitally connect the people of Rithala and preserve the identity, culture, and heritage
              of the village for future generations  so that every story, festival, photograph and memory
              of Rithala lives on in the modern digital age.
            </p>
            <p className="ab-mission-hi">
              रिठाला के लोगों को डिजिटल रूप से जोड़ना और गाँव की पहचान, संस्कृति और विरासत को
              आने वाली पीढ़ियों के लिए संरक्षित करना।
            </p>
          </div>
        </div>
      </section>

      {/* 5 PILLARS */}
      <section className="ab-section ab-section-dark">
        <div className="container">
          <div className="ab-sec-head">
            <div className="ab-sec-line" />
            <h2>5 Pillars of Rithala Update</h2>
            <p>Everything we share is built around these five core themes.</p>
          </div>
          <div className="ab-pillars">
            {PILLARS.map((p, i) => (
              <div key={i} className="ab-pillar">
                <div className="ab-pillar-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p className="ab-pillar-hi">{p.titleHi}</p>
                <p className="ab-pillar-text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY + TIMELINE */}
      <section className="ab-section">
        <div className="container ab-story-wrap">
          <div className="ab-story">
            <div className="ab-sec-line" />
            <h2>From Instagram to a Village&#39;s Digital Home</h2>
            <p>
              In today&#39;s fast-moving digital world, local communities and their stories often get
              ignored. Rithala Update was created to ensure that the traditions, history,
              festivals, achievements, and daily life of Rithala Village continue to reach people
              through modern digital platforms.
            </p>
            <p>
              What started in <strong>2020</strong> as a small social media initiative on Instagram gradually
              became one of the growing local digital platforms representing Rithala online. As the
              audience grew, the need for a dedicated website became clear. On{' '}

              <strong>17 May 2026</strong>  the official Rithala Update
              website was launched, connecting the entire Rithala community digitally.
            </p>
            <p className="ab-story-hi">
              Instagram से शुरू हुई यात्रा आज रिठाला गाँव का पूर्ण डिजिटल घर बन चुकी है।
            </p>
          </div>

          <div className="ab-timeline">
            {TIMELINE.map((t, i) => (
              <div key={i} className="ab-tl-item">
                <div className="ab-tl-year">{t.year}</div>
                <div className="ab-tl-dot" />
                <div className="ab-tl-content">
                  <p>{t.text}</p>
                  <small>{t.textHi}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="ab-section ab-section-dark">
        <div className="container ab-founder">
          <div className="ab-founder-img-wrap">
            <img
              src="https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480814023-sandeep-rajput-rithalya-rajput-rithala-delhi.png-1HotTzrfaJxcggidFmo033DNSHDPMu.webp"
              alt="Sandeep Rajput  Founder of Rithala Update"
              loading="lazy"
            />
            <div className="ab-founder-tag">Rithalya Rajput</div>
          </div>
          <div className="ab-founder-body">
            <div className="ab-sec-line" />
            <h2>Created &amp; Managed by Sandeep Rajput</h2>
            <p>
              Popularly known online as <strong>Rithalya Rajput</strong>, Sandeep is a resident of
              Rithala Village and an 18-year-old digital creator, website developer and artist.
              From content creation to event coverage, the entire platform has been independently
              designed and maintained with dedication and passion.
            </p>
            <p className="ab-founder-hi">
              संदीप राजपूत  रिठाला गाँव के रहने वाले digital creator, website developer और artist।
              पूरा platform उन्होंने खुद ही डिज़ाइन और maintain किया है।
            </p>
            <div className="ab-founder-skills">
              {['Website Development', 'Content Creation', 'Digital Branding', 'Pencil Sketch Art'].map(s => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <Link href="/sandeep-rajput/" className="ab-btn-primary">
              Read Full Story
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ab-section">
        <div className="container">
          <div className="ab-sec-head">
            <div className="ab-sec-line" />
            <h2>Frequently Asked Questions</h2>
            <p>अक्सर पूछे जाने वाले सवाल और उनके जवाब</p>
          </div>
          <div className="ab-faqs">
            {FAQS.map((f, i) => (
              <details key={i} className="ab-faq">
                <summary>
                  <div className="ab-faq-qs">
                    <span className="ab-faq-q">{f.q}</span>
                    <span className="ab-faq-qhi">{f.qHi}</span>
                  </div>
                  <svg className="ab-faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="ab-faq-body">
                  <p>{f.a}</p>
                  <p className="ab-faq-ahi">{f.aHi}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ab-cta">
        <div className="container ab-cta-inner">
          <svg className="ab-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <path d="M3 21h18M9 21V9l3-6 3 6v12M9 12h6M5 21V11l-2-2M19 21V11l2-2" />
          </svg>
          <h2>Be Part of Rithala Update</h2>
          <p className="ab-cta-hi">रिठाला अपडेट का हिस्सा बनें</p>
          <p className="ab-cta-sub">
            Share your photos, stories, or testimonials  and help us preserve the village for future generations.
          </p>
          <div className="ab-cta-btns">
            <Link href="/contact/" className="ab-cta-btn-primary">Share Your Story</Link>
            <Link href="/photos/" className="ab-cta-btn-ghost">View Photos</Link>
          </div>
        </div>
      </section>

    </PublicShell>
  );
}
