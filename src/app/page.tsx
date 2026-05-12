import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import PostCard from '@/components/PostCard';
import HeroSlider from '@/components/HeroSlider';
import ReelsStrip from '@/components/ReelsStrip';
import TestimonialsSection from '@/components/TestimonialsSection';
import BiText from '@/components/BiText';
import { getPublishedPosts, getFeaturedReels, getPublishedReels, sql } from '@/lib/db';

export const revalidate = 60;

const HERO_IMAGE = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778400974678-_______________________________Rithala_village-chtINXfbEiTju5dah7wgUclR3aSe5k.png';
const RAJPUTANA_MAP = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401194056-rajputana-historical-map-rithala-village-rajput-heritage.jpg-EEgVFCLGU390rpOSFvELkE66HIiHge.jpg';
const RAJPUTANA_LOGO = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401455542-rajputana-heritage-logo-rithala-village.png-JQ1YTLV0RDx0tAyMYICdirpX1RGJa7.png';

const galleryCards = [
  { href: '/photos/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-events-cover.jpg.png', title: 'Photos' },
  { href: '/category/events/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-events-cover.jpg.png', title: 'Events' },
  { href: '/category/places/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-places-cover.jpg.png', title: 'Places' },
  { href: '/category/history/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-temples-cover.jpg.png', title: 'History' },
  { href: '/category/brotherhood/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-brotherhood-cover.jpg.png', title: 'Brotherhood' },
  { href: '/category/kawad-yatra-2024/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-kanwar-yatra-2024-cover.jpg.png', title: 'Kanwar 2024' },
  { href: '/category/kawad-yatra-2025/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-kanwar-yatra-2025-cover.jpg.png', title: 'Kanwar 2025' },
];

export default async function HomePage() {
  let posts: any[] = [];
  let featuredReels: any[] = [];
  let allReels: any[] = [];
  let homeFaqs: any[] = [];
  try { posts = await getPublishedPosts(6); } catch {}
  try { featuredReels = await getFeaturedReels(6); } catch {}
  try { allReels = await getPublishedReels(20); } catch {}
  try {
    const r = await sql`SELECT id, question, answer FROM faqs WHERE show_on_home = TRUE AND status = 'published' ORDER BY display_order ASC, created_at DESC LIMIT 8`;
    homeFaqs = r.rows;
  } catch {}

  return (
    <PublicShell>
      {/* ==============================
          UNIQUE HERO SECTION
          ============================== */}
      <section className="hero-v2">
        <div className="hero-decorations" aria-hidden="true">
          <span className="hero-flag">🚩</span>
          <span className="hero-star hero-star-1">✦</span>
          <span className="hero-star hero-star-2">✦</span>
          <span className="hero-star hero-star-3">✦</span>
        </div>

        <div className="container">
          <div className="hero-grid-v2">
            <div className="hero-image-wrap">
              <div className="hero-image-frame">
                <img
                  src={HERO_IMAGE}
                  alt="Rithala Village ke kanwariye Shiv mandir mein - Kawad Yatra Rajput culture"
                  width={600}
                  height={600}
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="hero-image-corner top-left"></div>
                <div className="hero-image-corner top-right"></div>
                <div className="hero-image-corner bottom-left"></div>
                <div className="hero-image-corner bottom-right"></div>
              </div>
              <div className="hero-image-badge">🚩 Jai Rajputana</div>
            </div>

            <div className="hero-content-v2">
              <span className="hero-eyebrow">
                <span className="hero-eyebrow-line"></span>
                <BiText hi="रिठाला में आपका स्वागत है" en="Welcome to Rithala" />
                <span className="hero-eyebrow-line"></span>
              </span>

              <h1 className="hero-title-v2">
                <BiText hi="रिठाला गाँव" en="Rithala Village" />
              </h1>

              <BiText
                as="p"
                className="hero-description"
                hi="रिठाला गाँव दिल्ली के उत्तर-पश्चिम क्षेत्र में स्थित एक प्राचीन और ऐतिहासिक गाँव है, जो अपनी राजपूताना विरासत, वीरता और सांस्कृतिक गौरव के लिए प्रसिद्ध है। सदियों से यह गाँव परंपराओं, भाईचारे और आपसी सहयोग का प्रतीक रहा है।"
                en="Rithala Village is an ancient and historical village in North-West Delhi, famous for its Rajputana heritage, bravery, and cultural pride. For centuries, this village has been a symbol of traditions, brotherhood, and community unity."
              />

              <ul className="hero-highlights">
                <li>
                  <span className="hero-icon">📜</span>
                  <BiText hi="सदियों पुरानी परंपराओं का प्रतीक" en="Symbol of centuries-old traditions" />
                </li>
                <li>
                  <span className="hero-icon">⚔️</span>
                  <BiText hi="राजपूत वीरता की गौरवशाली कहानियाँ" en="Glorious stories of Rajput bravery" />
                </li>
                <li>
                  <span className="hero-icon">🏛️</span>
                  <BiText hi="सांस्कृतिक धरोहर और ऐतिहासिक स्थल" en="Cultural heritage and historical sites" />
                </li>
                <li>
                  <span className="hero-icon">🤝</span>
                  <BiText hi="भाईचारे और सामाजिक एकता" en="Brotherhood and social unity" />
                </li>
              </ul>

              <div className="hero-cta-row">
                <Link href="/about/" className="btn-hero-primary">
                  <BiText as="span" className="btn-hero-text" hi="📖 पूरी कहानी पढ़ें" en="📖 Read Full Story" />
                  <span className="btn-hero-arrow">→</span>
                </Link>
                <Link href="/contact/" className="btn-hero-secondary">
                  <BiText hi="संपर्क करें" en="Contact Us" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          RAJPUTANA HERITAGE SECTION
          ============================== */}
      <section className="rajputana-section reveal-on-scroll">
        <div className="rajputana-decor" aria-hidden="true">
          <span className="rj-deco-1">⚔️</span>
          <span className="rj-deco-2">🏰</span>
          <span className="rj-deco-3">🛡️</span>
        </div>
        <div className="container">
          <div className="rajputana-grid">
            <div className="rajputana-content">
              <img
                src={RAJPUTANA_LOGO}
                alt="राजपूताना heritage logo - Rajput warriors land"
                className="rajputana-logo"
                loading="lazy"
              />
              <p className="rajputana-text">
                <strong>राजपूताना</strong> भारत का एक ऐतिहासिक क्षेत्र है, जिसका
                अर्थ है <strong>"राजपूतों की भूमि"</strong>। यह नाम दो शब्दों से
                बना है — <em>राजा + पुत्र</em> यानी <em>"राजपूत"</em>, जो शाही
                वंश के योद्धा होते थे, और <em>"राजपूताना"</em> यानी वह भूमि जहाँ
                इनका शासन और प्रभाव था। राजपूताना में वर्तमान राजस्थान राज्य और
                उसके आसपास के कुछ हिस्से जैसे हरियाणा, गुजरात और मध्यप्रदेश शामिल
                थे।
              </p>
              <p className="rajputana-text">
                अंग्रेज़ी शासनकाल में इसे <strong>"राजपूताना एजेंसी"</strong> कहा
                जाता था, जिसमें 18 बड़ी और 20 छोटी रियासतें थीं — जैसे मेवाड़,
                मारवाड़, जयपुर, जोधपुर, बीकानेर, बूंदी और कोटा। यह क्षेत्र अपनी
                वीरता, शौर्य और संस्कृति के लिए प्रसिद्ध था।
              </p>
              <p className="rajputana-text">
                यहाँ के राजपूत शासकों ने अपने सम्मान, स्वाभिमान और मातृभूमि की
                रक्षा के लिए अनेक युद्ध लड़े, जिनमें{' '}
                <strong>हल्दीघाटी, खानवा और तारागढ़</strong> के युद्ध विशेष रूप
                से प्रसिद्ध हैं। आज भी राजपूताना का इतिहास भारतीय गौरव और वीरता
                का प्रतीक माना जाता है।
              </p>
            </div>
            <div className="rajputana-image-wrap">
              <div className="rajputana-image-frame">
                <img
                  src={RAJPUTANA_MAP}
                  alt="राजपूताना ऐतिहासिक नक्शा - Historical Rajputana Agency map with princely states Mewar Marwar Jaipur Jodhpur"
                  loading="lazy"
                />
              </div>
              <p className="rajputana-caption">📜 Imperial Gazetteer of India — Rajputana Agency Map</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          HERITAGE IMAGE SLIDER
          ============================== */}
      <div className="reveal-on-scroll">
        <HeroSlider />
      </div>

      {/* Categories */}
      <section className="section reveal-on-scroll">
        <div className="container">
          <h2><BiText hi="श्रेणियाँ" en="Categories" /></h2>
          <div className="cat-cards">
            {galleryCards.map((g) => (
              <Link key={g.href} className="cat-card" href={g.href}>
                <img src={g.img} alt={g.title} loading="lazy" />
                <span>{g.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reels Auto-Scroll Strip */}
      {allReels.length > 0 && (
        <div className="reveal-on-scroll">
          <ReelsStrip reels={allReels} />
        </div>
      )}

      {/* Latest Posts */}
      <section className="lp2-section reveal-on-scroll">
        <div className="container">
          <div className="lp2-head">
            <div>
              <BiText as="span" className="lp2-eyebrow" hi="गाँव से ताज़ा खबर" en="Fresh from the village" />
              <h2 className="lp2-h2"><BiText hi="ताज़े ब्लॉग पोस्ट" en="Latest Blog Posts" /></h2>
              <BiText as="p" className="lp2-sub" hi="रिठाला से ताज़ा कहानियाँ, फ़ोटो और अपडेट" en="Fresh stories, photos and updates from Rithala" />
            </div>
            <Link href="/blog/" className="lp2-view-all"><BiText hi="सभी पोस्ट देखें →" en="View all posts →" /></Link>
          </div>

          {posts.length === 0 ? (
            <div className="lp2-empty">
              <p><BiText hi="अभी कोई पोस्ट नहीं है।" en="No posts yet." /> <Link href="/admin/login"><BiText hi="Admin में लॉगिन करें" en="Login to admin" /></Link></p>
            </div>
          ) : (
            <div className="bc-grid">
              {posts.map((p: any) => (
                <Link key={p.id} href={`/blog/${p.slug}/`} className="bc-card">
                  <div className="bc-img-wrap">
                    {p.featured_image ? (
                      <img src={p.featured_image} alt={p.title} loading="lazy" />
                    ) : (
                      <div className="bc-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <span>Rithala</span>
                      </div>
                    )}
                    <div className="bc-overlay" />
                    <div className="bc-tag">Rithala Village</div>
                  </div>
                  <div className="bc-body">
                    <h3 className="bc-title">{p.title}</h3>
                    <div className="bc-meta">
                      <span className="bc-date">
                        {p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <span className="bc-read">
                        <BiText hi="पढ़ें" en="Read More" />
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <TestimonialsSection />

      {homeFaqs.length > 0 && (
        <section className="home-faq-section">
          <div className="container">
            <div className="home-faq-head">
              <h2><BiText hi="अक्सर पूछे जाने वाले सवाल" en="Frequently Asked Questions" /></h2>
              <Link href="/faqs/" className="home-faq-all"><BiText hi="सभी FAQs देखें →" en="View all FAQs →" /></Link>
            </div>
            <div className="home-faq-grid">
              {homeFaqs.map((f: any) => (
                <details key={f.id} className="home-faq-item">
                  <summary><span>{f.question}</span><span className="home-faq-plus">+</span></summary>
                  <div className="home-faq-ans">{f.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicShell>
  );
}
