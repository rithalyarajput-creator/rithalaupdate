import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import PostCard from '@/components/PostCard';
import { getPublishedPosts, getFeaturedReels } from '@/lib/db';

export const revalidate = 60;

const HERO_IMAGE = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778400974678-_______________________________Rithala_village-chtINXfbEiTju5dah7wgUclR3aSe5k.png';
const RAJPUTANA_MAP = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401194056-rajputana-historical-map-rithala-village-rajput-heritage.jpg-EEgVFCLGU390rpOSFvELkE66HIiHge.jpg';
const RAJPUTANA_LOGO = 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401455542-rajputana-heritage-logo-rithala-village.png-JQ1YTLV0RDx0tAyMYICdirpX1RGJa7.png';

const galleryCards = [
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
  try { posts = await getPublishedPosts(6); } catch {}
  try { featuredReels = await getFeaturedReels(6); } catch {}

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
                Welcome to Rithala
                <span className="hero-eyebrow-line"></span>
              </span>

              <h1 className="hero-title-v2">
                <span className="hero-title-hindi">रिठाला गाँव</span>
                <span className="hero-title-english">Rithala Village</span>
              </h1>

              <p className="hero-description">
                रिठाला गाँव दिल्ली के उत्तर-पश्चिम क्षेत्र में स्थित एक प्राचीन और
                ऐतिहासिक गाँव है, जो अपनी राजपूताना विरासत, वीरता और सांस्कृतिक
                गौरव के लिए प्रसिद्ध है। सदियों से यह गाँव परंपराओं, भाईचारे और
                आपसी सहयोग का प्रतीक रहा है, जहाँ के लोग मेहनती, साहसी और अपने
                इतिहास पर गर्व करने वाले हैं।
              </p>

              <ul className="hero-highlights">
                <li>
                  <span className="hero-icon">📜</span>
                  <span>सदियों पुरानी परंपराओं का प्रतीक</span>
                </li>
                <li>
                  <span className="hero-icon">⚔️</span>
                  <span>राजपूत वीरता की गौरवशाली कहानियाँ</span>
                </li>
                <li>
                  <span className="hero-icon">🏛️</span>
                  <span>सांस्कृतिक धरोहर और ऐतिहासिक स्थल</span>
                </li>
                <li>
                  <span className="hero-icon">🤝</span>
                  <span>भाईचारे और सामाजिक एकता</span>
                </li>
              </ul>

              <div className="hero-cta-row">
                <Link href="/about/" className="btn-hero-primary">
                  <span className="btn-hero-text">📖 Read Full Story</span>
                  <span className="btn-hero-arrow">→</span>
                </Link>
                <Link href="/contact/" className="btn-hero-secondary">
                  Contact Us
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

      {/* Categories */}
      <section className="section reveal-on-scroll">
        <div className="container">
          <h2>Categories</h2>
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

      {/* Featured Reels */}
      {featuredReels.length > 0 && (
        <section className="section reveal-on-scroll" style={{ background: '#fff8e7' }}>
          <div className="container">
            <h2>🎬 Featured Reels</h2>
            <div className="reel-public-grid">
              {featuredReels.map((r) => (
                <a key={r.id} href={r.instagram_url} target="_blank" rel="noopener" className="reel-public-card">
                  <div className="reel-public-thumb">
                    {r.thumbnail_url ? (
                      <img src={r.thumbnail_url} alt={r.title} />
                    ) : (
                      <div className="reel-placeholder">▶ Reel</div>
                    )}
                    <div className="reel-play-overlay">▶</div>
                  </div>
                  <div style={{ padding: 12 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{r.title}</h3>
                  </div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: 20 }}>
              <Link className="btn btn-secondary" href="/reels/">View All Reels →</Link>
            </p>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="section reveal-on-scroll">
        <div className="container">
          <h2>Latest Posts</h2>
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>
              No posts yet. <Link href="/admin/login">Login to admin</Link> to add the first post.
            </p>
          ) : (
            <div className="card-grid">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
