import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import { getAllSettings } from '@/lib/db';
import '../ab3-styles.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Us — Rithala Update | Story, Mission & Vision',
  description: 'About Rithala Update — a digital platform created by Sandeep Rajput (Rithalya Rajput) to share the latest news, history, culture, festivals and updates of Rithala Village, Delhi. Officially launched on 15 August 2022.',
  keywords: 'About Rithala Update, Rithala Village Delhi, Sandeep Rajput, Rithalya Rajput, Rithala history, digital village platform',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Rithala Update — Sandeep Rajput',
    description: 'Digital platform for Rithala Village, Delhi. Sharing news, history, culture, festivals and community updates since 15 August 2022.',
    url: '/about/',
    type: 'website',
  },
};

const STATS = [
  { num: '640+', label: 'साल की विरासत', labelEn: 'Years of Heritage' },
  { num: '2022', label: 'वेबसाइट शुरू', labelEn: 'Website Launched' },
  { num: '1384', label: 'में गाँव बसा', labelEn: 'Village Founded' },
  { num: '1', label: 'संस्थापक', labelEn: 'Founder' },
];

const PILLARS = [
  { icon: '📰', color: '#dc2626', bg: '#fef2f2', title: 'ताज़ा खबरें', titleEn: 'Local News', text: 'रिठाला गाँव की ताज़ा खबरें, सरकारी घोषणाएँ और सामुदायिक अपडेट एक ही जगह पर।', textEn: 'Latest news, village updates, government announcements and community information all in one place.' },
  { icon: '⚔️', color: '#7c3aed', bg: '#f5f3ff', title: 'गाँव का इतिहास', titleEn: 'Village History', text: '640+ वर्षों के रिठाला के इतिहास को संरक्षित करना — 1384 में राणा राजपाल सिंह द्वारा बसाया गया।', textEn: 'Documenting 640+ years of Rithala history, founded in 1384 by Rana Rajpal Singh, preserving Rajput heritage.' },
  { icon: '📸', color: '#0891b2', bg: '#ecfeff', title: 'फ़ोटो और यादें', titleEn: 'Photos & Memories', text: 'कावड़ यात्रा, जन्माष्टमी, मंदिर उत्सव और रोज़मर्रा की गाँव की ज़िंदगी की यादें।', textEn: 'Galleries from Kawad Yatra, Janmashtami, temple events, festivals and everyday village life.' },
  { icon: '🎬', color: '#ea580c', bg: '#fff7ed', title: 'रील्स और वीडियो', titleEn: 'Reels & Videos', text: 'भक्ति रील्स, सांस्कृतिक पल और राजपूताना गर्व के वीडियो Instagram, YouTube और वेबसाइट पर।', textEn: 'Bhakti reels, cultural moments and Rajputana pride videos on Instagram, YouTube and website.' },
  { icon: '🤝', color: '#059669', bg: '#ecfdf5', title: 'समुदाय जुड़ाव', titleEn: 'Community', text: 'दुनिया भर में रिठाला के लोगों को कहानियों, त्योहारों और सांस्कृतिक पहचान से जोड़ना।', textEn: 'Connecting Rithala residents worldwide through stories, festivals and shared cultural identity.' },
];

const TIMELINE = [
  { year: '2020', icon: '📱', text: 'Instagram और social media पर रिठाला अपडेट शेयर करना शुरू किया', textEn: 'Started sharing Rithala updates on Instagram and social media' },
  { year: '2022', icon: '🚀', text: '15 अगस्त 2022 को आधिकारिक वेबसाइट लॉन्च हुई', textEn: 'Official website launched on 15 August 2022' },
  { year: '2024', icon: '🖼️', text: 'फ़ोटो आर्काइव, Reels और सामुदायिक सबमिशन का विस्तार हुआ', textEn: 'Photo archives, Reels and community submissions expanded' },
  { year: '2026', icon: '🤖', text: 'AI chatbot, FAQs, Testimonials के साथ पूर्ण डिजिटल प्लेटफ़ॉर्म बना', textEn: 'Full digital platform with AI chatbot, FAQs and Testimonials' },
];

const FAQS = [
  { q: 'रिठाला अपडेट कब शुरू हुआ?', qEn: 'When did Rithala Update start?', a: 'रिठाला अपडेट वेबसाइट 15 अगस्त 2022 को लॉन्च हुई थी। इससे पहले 2020 से Instagram और social media पर अपडेट शेयर होती थीं।', aEn: 'The Rithala Update website was launched on 15 August 2022. Before that, updates were shared on Instagram and social media from 2020 onwards.' },
  { q: 'रिठाला अपडेट किसने बनाया?', qEn: 'Who created Rithala Update?', a: 'रिठाला अपडेट को संदीप राजपूत (Rithalya Rajput) ने बनाया और manage करते हैं — जो रिठाला गाँव के रहने वाले एक digital creator और website developer हैं।', aEn: 'Rithala Update was created and is managed by Sandeep Rajput (Rithalya Rajput) — a digital creator and website developer from Rithala Village, Delhi.' },
  { q: 'रिठाला गाँव का इतिहास क्या है?', qEn: 'What is the history of Rithala Village?', a: 'रिठाला गाँव की स्थापना 1384-85 में राणा राजपाल सिंह (तोमर चंद्रवंशी राजपूत) ने की थी। यह दिल्ली के उत्तर-पश्चिम में स्थित एक ऐतिहासिक गाँव है जो अपनी राजपूताना विरासत के लिए प्रसिद्ध है।', aEn: 'Rithala Village was founded in 1384-85 by Rana Rajpal Singh (Tomar Chandravanshi Rajput). Located in North-West Delhi, it is a historic village known for its Rajputana heritage.' },
  { q: 'क्या मैं अपनी फ़ोटो और कहानी शेयर कर सकता हूँ?', qEn: 'Can I share my photos and stories?', a: 'हाँ! Contact page के ज़रिए आप अपनी फ़ोटो, यादें और कहानियाँ हमारे साथ शेयर कर सकते हैं। हम सामुदायिक योगदान का स्वागत करते हैं।', aEn: 'Yes! You can share your photos, memories and stories with us through the Contact page. We welcome community contributions.' },
];

export default async function AboutPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));
  const logoUrl = settings.site_logo_url || '/logo.png';

  return (
    <PublicShell>

      {/* ======= HERO ======= */}
      <section className="ab3-hero">
        <div className="ab3-hero-bg" aria-hidden="true">
          <span className="ab3-orb ab3-orb-1"></span>
          <span className="ab3-orb ab3-orb-2"></span>
          <span className="ab3-orb ab3-orb-3"></span>
        </div>
        <div className="container ab3-hero-inner">

          {/* Logo card */}
          <div className="ab3-logo-card">
            <div className="ab3-logo-ring">
              <img src={logoUrl} alt="Rithala Update logo" />
            </div>
            <div className="ab3-logo-info">
              <strong>Rithala Update</strong>
              <span>🚀 15 August 2022 को लॉन्च हुआ</span>
              <span>📍 Rithala Village, Delhi</span>
            </div>
          </div>

          <span className="ab3-eyebrow">🏅 हमारे बारे में / About Us</span>
          <h1 className="ab3-h1">
            रिठाला अपडेट की <span>कहानी</span>
            <br /><small>The Story Behind Rithala Update</small>
          </h1>
          <p className="ab3-sub">
            रिठाला गाँव की पहचान, संस्कृति और विरासत को डिजिटल रूप में संरक्षित करने के लिए बनाया गया एक मंच —
            जिसे <strong>संदीप राजपूत</strong> (Rithalya Rajput) ने बनाया।
          </p>

          {/* Stats row */}
          <div className="ab3-stats">
            {STATS.map((s) => (
              <div key={s.num} className="ab3-stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
                <small>{s.labelEn}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= MISSION ======= */}
      <section className="ab3-section">
        <div className="container">
          <div className="ab3-mission">
            <div className="ab3-mission-icon">🎯</div>
            <h2>हमारा मिशन <span>/ Our Mission</span></h2>
            <p>
              रिठाला के लोगों को डिजिटल रूप से जोड़ना और गाँव की पहचान, संस्कृति और विरासत को
              आने वाली पीढ़ियों के लिए संरक्षित करना — ताकि रिठाला की हर कहानी, हर त्योहार,
              हर तस्वीर और हर याद आधुनिक डिजिटल युग में जीवित रहे।
            </p>
            <p className="ab3-mission-en">
              To digitally connect the people of Rithala and preserve the identity, culture, and
              heritage of the village for future generations — so that every story, festival,
              photograph and memory of Rithala lives on in the modern digital age.
            </p>
          </div>
        </div>
      </section>

      {/* ======= 5 PILLARS ======= */}
      <section className="ab3-section ab3-section-alt">
        <div className="container">
          <div className="ab3-section-head">
            <span className="ab3-tag">हम क्या करते हैं / What We Do</span>
            <h2>रिठाला अपडेट के 5 आधार</h2>
            <p>Everything we share is built around these five core themes.</p>
          </div>
          <div className="ab3-pillars">
            {PILLARS.map((p) => (
              <div key={p.title} className="ab3-pillar" style={{ '--pillar-color': p.color, '--pillar-bg': p.bg } as React.CSSProperties}>
                <div className="ab3-pillar-icon">{p.icon}</div>
                <h3>{p.title}<span>{p.titleEn}</span></h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= STORY + TIMELINE SIDE BY SIDE ======= */}
      <section className="ab3-section">
        <div className="container ab3-story-grid">
          <div className="ab3-story-text">
            <span className="ab3-tag">हमारी यात्रा / Our Journey</span>
            <h2>Instagram से गाँव के डिजिटल घर तक</h2>
            <p>
              आज के तेज़ डिजिटल युग में स्थानीय समुदायों और उनकी कहानियों को अक्सर नज़रअंदाज़ किया जाता है।
              रिठाला अपडेट इसीलिए बनाया गया — ताकि रिठाला गाँव की परंपराएँ, इतिहास, त्योहार, उपलब्धियाँ
              और रोज़मर्रा की ज़िंदगी आधुनिक डिजिटल प्लेटफ़ॉर्म के ज़रिए लोगों तक पहुँचती रहे।
            </p>
            <p>
              वेबसाइट लॉन्च होने से पहले रिठाला गाँव के अपडेट Instagram, Facebook और अन्य social media
              पर नियमित रूप से शेयर होते थे। जैसे-जैसे लोग जुड़ते गए, एक dedicated website की ज़रूरत महसूस हुई।
              <strong> 15 अगस्त 2022</strong> को आधिकारिक वेबसाइट लॉन्च हुई।
            </p>
          </div>
          <div className="ab3-timeline">
            {TIMELINE.map((t, i) => (
              <div key={i} className="ab3-tl-item">
                <div className="ab3-tl-left">
                  <span className="ab3-tl-icon">{t.icon}</span>
                  <span className="ab3-tl-year">{t.year}</span>
                </div>
                <div className="ab3-tl-line" aria-hidden="true"></div>
                <div className="ab3-tl-body">
                  <p>{t.text}</p>
                  <small>{t.textEn}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FOUNDER ======= */}
      <section className="ab3-section ab3-section-alt">
        <div className="container ab3-founder">
          <div className="ab3-founder-img">
            <img
              src="https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480814023-sandeep-rajput-rithalya-rajput-rithala-delhi.png-1HotTzrfaJxcggidFmo033DNSHDPMu.webp"
              alt="Sandeep Rajput — founder of Rithala Update"
              loading="lazy"
            />
            <div className="ab3-founder-badge">🚩 Rithalya Rajput</div>
          </div>
          <div className="ab3-founder-content">
            <span className="ab3-tag">संस्थापक से मिलें / Meet the Founder</span>
            <h2>संदीप राजपूत द्वारा बनाया और प्रबंधित</h2>
            <p>
              ऑनलाइन <strong>Rithalya Rajput</strong> के नाम से मशहूर संदीप, रिठाला गाँव के रहने वाले
              एक digital creator, website developer और artist हैं। Content creation से लेकर event
              coverage तक, यह पूरा platform उन्होंने खुद ही समर्पण और जुनून के साथ design और
              maintain किया है।
            </p>
            <div className="ab3-founder-tags">
              <span>💻 Website Developer</span>
              <span>🎨 Digital Artist</span>
              <span>📱 Content Creator</span>
              <span>🏡 Rithala Village</span>
            </div>
            <Link href="/sandeep-rajput/" className="ab3-btn-primary">
              पूरी कहानी पढ़ें / Read Full Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ======= FAQ ======= */}
      <section className="ab3-section">
        <div className="container">
          <div className="ab3-section-head">
            <span className="ab3-tag">अक्सर पूछे जाने वाले सवाल / FAQs</span>
            <h2>आपके सवाल, हमारे जवाब</h2>
          </div>
          <div className="ab3-faqs">
            {FAQS.map((f, i) => (
              <details key={i} className="ab3-faq-item">
                <summary>
                  <span className="ab3-faq-q">{f.q}</span>
                  <span className="ab3-faq-qen">{f.qEn}</span>
                  <span className="ab3-faq-plus">+</span>
                </summary>
                <div className="ab3-faq-body">
                  <p>{f.a}</p>
                  <p className="ab3-faq-en">{f.aEn}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="ab3-cta">
        <div className="container ab3-cta-inner">
          <span className="ab3-cta-emoji">🚩</span>
          <h2>रिठाला अपडेट का हिस्सा बनें</h2>
          <p>Be Part of Rithala Update</p>
          <p className="ab3-cta-sub">अपनी फ़ोटो, कहानियाँ या testimonials शेयर करें — और आने वाली पीढ़ियों के लिए गाँव को संरक्षित करने में मदद करें।</p>
          <div className="ab3-cta-btns">
            <Link href="/contact/" className="ab3-btn-white">✉️ अपनी कहानी शेयर करें</Link>
            <Link href="/photos/" className="ab3-btn-outline">📸 फ़ोटो देखें</Link>
          </div>
        </div>
      </section>

    </PublicShell>
  );
}
