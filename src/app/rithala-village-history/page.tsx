import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import CountUp from '@/components/CountUp';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Rithala Village History  रिठाला गाँव का इतिहास, Tomar Rajput Heritage',
  description:
    'रिठाला गाँव दिल्ली का प्राचीन ऐतिहासिक गाँव  Tomar Rajput History, Rana Rajpal Singh, लाठी वाला परंपरा, पूठ कलां और 640+ वर्षों की राजपूताना वीरता की पूरी कहानी।',
  keywords: [
    'Rithala Village History', 'रिठाला गाँव का इतिहास', 'Tomar Rajput',
    'Rana Rajpal Singh', 'राणा राजपाल सिंह', 'लाठी वाला',
    'पूठ कलां', 'राजपूताना वीरता', 'Delhi village history',
    'चंद्रवंशी राजपूत', 'Firoz Shah Tughlaq',
  ],
  alternates: { canonical: '/rithala-village-history/' },
  openGraph: {
    title: 'Rithala Village History  रिठाला गाँव का इतिहास',
    description: 'Tomar Rajput history, Rana Rajpal Singh, और राजपूताना वीरता की पूरी कहानी।',
    type: 'article',
    url: `${SITE}/rithala-village-history/`,
  },
};

type Chapter = {
  id: string;
  chapter: string;
  era: string;
  emoji: string;
  title: string;
  body: string;
  pull: string;
};

const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    chapter: 'Chapter 01',
    era: '138485 ईस्वी',
    emoji: '',
    title: 'रिठाला गाँव का इतिहास',
    pull: 'गाँव की नींव राणा राजपाल सिंह ने रखी थी।',
    body:
      'रिठाला गाँव दिल्ली के प्राचीन और ऐतिहासिक गाँवों में से एक है, जो अपनी राजपूताना विरासत, वीरता और सांस्कृतिक गौरव के लिए प्रसिद्ध है। यह गाँव आज भी दिल्ली के Tomar Rajput History और राजपूत परंपरा का जीवंत प्रतीक है। रिठाला गाँव की स्थापना 138485 ईस्वी में हुई थी, जब दिल्ली पर सुल्तान फिरोज शाह तुगलक का शासन था। इस गाँव की नींव राणा राजपाल सिंह (Rana Rajpal Singh) ने रखी थी, जो तोमर चंद्रवंशी राजपूत वंश के साहसी योद्धा थे।',
  },
  {
    id: 'lathi-wala',
    chapter: 'Chapter 02',
    era: 'प्राचीन काल',
    emoji: '',
    title: 'लाठी वाला: रिठाला की वीर गाथा',
    pull: 'यहाँ की सुरक्षा क़िले नहीं, योद्धाओं की बहादुरी पर थी।',
    body:
      'रिठाला गाँव का प्राचीन नाम "लाठी वाला" था। इस नाम का कारण गाँव के निवासियों की योद्धा परंपरा और शस्त्र-कौशल था। यहाँ के लोग लाठी, भाला, तलवार और पारंपरिक हथियारों के प्रयोग में निपुण थे। उस समय गाँव की सुरक्षा किसी क़िले या बड़ी दीवार पर निर्भर नहीं थी, बल्कि युवा योद्धाओं की बहादुरी पर आधारित थी। जब भी आसपास कोई खतरा उत्पन्न होता, लाठी वालों की टोली सबसे पहले आगे बढ़कर अपने गाँव और परिवार की रक्षा करती थी।',
  },
  {
    id: 'puth-kalan',
    chapter: 'Chapter 03',
    era: '104849 ईस्वी',
    emoji: '',
    title: 'राणा राजपाल सिंह और पूठ कलां',
    pull: 'पूठ कलां से रिठाला तक की रणनीतिक यात्रा।',
    body:
      'राणा राजपाल सिंह के पूर्वज प्रारम्भ में पूठ कलां गाँव में रहते थे, जिसकी स्थापना लगभग 104849 ईस्वी में हुई थी। यह इलाका उस समय तोमर राजपूत वंश के नियंत्रण में था। पूठ कलां गाँव कृषि और पशुपालन पर आधारित था और यह राजपूतों की सैन्य शक्ति का प्रतीक माना जाता था। समय के साथ जनसंख्या वृद्धि, सामाजिक विस्तार और सुरक्षा कारणों से राणा राजपाल सिंह ने अपने समुदाय के लिए नई बस्ती बसाने का निर्णय लिया।',
  },
  {
    id: 'rajputana-veerta',
    chapter: 'Chapter 04',
    era: 'सदियों से',
    emoji: '',
    title: 'राजपूताना वीरता और संघर्ष',
    pull: 'लाठी, तलवार और धनुष-बाण से रक्षा की परंपरा।',
    body:
      'रिठाला गाँव की पहचान हमेशा से राजपूताना वीरता और संघर्ष की परंपरा से रही है। गाँव के निवासी तोमर चंद्रवंशी राजपूत थे, जो न केवल अपनी कृषि भूमि की रक्षा करते थे, बल्कि आसपास के क्षेत्र में सुरक्षा और शौर्य का प्रतीक भी थे। जब भी कोई संकट आता, गाँव के युवा योद्धा लाठी, तलवार और धनुष-बाण लेकर मोर्चा संभालते। यही परंपरा आगे चलकर गाँव की सांस्कृतिक धरोहर बनी।',
  },
  {
    id: 'samajik',
    chapter: 'Chapter 05',
    era: 'परंपरा',
    emoji: '',
    title: 'सामाजिक और सांस्कृतिक परंपराएँ',
    pull: 'भाईचारा इस गाँव की सबसे बड़ी ताकत।',
    body:
      'रिठाला गाँव न केवल अपनी वीरता के लिए, बल्कि अपनी सांस्कृतिक एकता और परंपराओं के लिए भी जाना जाता है। त्यौहार, धार्मिक आयोजन, मेलों और पारंपरिक रस्मों को यहाँ पीढ़ी-दर-पीढ़ी पूरी श्रद्धा और उत्साह के साथ निभाया जाता है। भाईचारा और सामाजिक एकता इस गाँव की सबसे बड़ी ताकत रही है। समय के साथ, इस गाँव ने अपनी लोककथाओं, वीर गाथाओं और रीति-रिवाजों के माध्यम से एक समृद्ध सांस्कृतिक पहचान बनाई।',
  },
  {
    id: 'modern',
    chapter: 'Chapter 06',
    era: 'आज',
    emoji: '',
    title: 'वर्तमान में ऐतिहासिक पहचान',
    pull: 'शहर में बदला, पहचान बरकरार।',
    body:
      'आज भले ही रिठाला गाँव शहरीकरण और आधुनिकता की ओर बढ़ चुका है, लेकिन इसका ऐतिहासिक और सांस्कृतिक गौरव आज भी जीवित है। गाँव के पुराने हवेलियाँ, चौपालें और पारंपरिक गलियाँ अभी भी अतीत की झलक दिखाती हैं। बुज़ुर्ग और इतिहास प्रेमी आज भी नई पीढ़ी को पूर्वजों की वीरता और संघर्ष की कहानियाँ सुनाते हैं।',
  },
];

export default function HistoryPage() {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'रिठाला गाँव का इतिहास  Rithala Village History',
    description:
      'रिठाला गाँव की स्थापना 1384-85 ईस्वी में राणा राजपाल सिंह द्वारा। तोमर चंद्रवंशी राजपूत वंश का इतिहास, लाठी वाला परंपरा, और पूठ कलां की जड़ें।',
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString(),
    author: { '@type': 'Person', name: 'Sandeep Rajput' },
    publisher: {
      '@type': 'Organization',
      name: 'Rithala Update',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/rithala-village-history/` },
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* ============ MAGAZINE HERO ============ */}
      <section className="rvh-hero">
        <div className="rvh-hero-bg" aria-hidden="true">
          <div className="rvh-blob rvh-blob-1"></div>
          <div className="rvh-blob rvh-blob-2"></div>
          <div className="rvh-blob rvh-blob-3"></div>
        </div>
        <div className="container">
          <div className="rvh-hero-grid">
            <div className="rvh-hero-text">
              <div className="rvh-badge">
                <span className="rvh-badge-dot"></span>
                Heritage Story · Est. 1384
              </div>
              <h1 className="rvh-title">
                <span className="rvh-title-line-1">रिठाला</span>
                <span className="rvh-title-line-2">गाँव का इतिहास</span>
              </h1>
              <p className="rvh-subtitle">
                The 640-year journey of a Tomar Rajput village 
                from <em>पूठ कलां</em> roots to modern Delhi.
              </p>
              <div className="rvh-hero-actions">
                <a href="#chapter-1" className="rvh-cta-primary">
                  Begin the Story
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
                <a href="/contact/" className="rvh-cta-ghost">Share Your Story</a>
              </div>
            </div>
            <div className="rvh-hero-emblem" aria-hidden="true">
              <div className="rvh-emblem-ring rvh-ring-1"></div>
              <div className="rvh-emblem-ring rvh-ring-2"></div>
              <div className="rvh-emblem-center">
                <span className="rvh-emblem-icon"></span>
                <span className="rvh-emblem-label">राजपूताना</span>
                <span className="rvh-emblem-sub">Heritage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COUNTER STATS ============ */}
      <section className="rvh-stats reveal-on-scroll">
        <div className="container">
          <div className="rvh-stats-grid">
            <div className="rvh-stat">
              <div className="rvh-stat-num">
                <CountUp end={1384} duration={1800} />
                <span className="rvh-stat-tail">85</span>
              </div>
              <div className="rvh-stat-label">ईस्वी में स्थापना</div>
              <div className="rvh-stat-sub">Founding year</div>
            </div>
            <div className="rvh-stat">
              <div className="rvh-stat-num">
                <CountUp end={640} duration={1800} suffix="+" />
              </div>
              <div className="rvh-stat-label">वर्षों का इतिहास</div>
              <div className="rvh-stat-sub">Years of legacy</div>
            </div>
            <div className="rvh-stat">
              <div className="rvh-stat-num">
                <CountUp end={1048} duration={1800} />
                <span className="rvh-stat-tail">49</span>
              </div>
              <div className="rvh-stat-label">पूठ कलां स्थापना</div>
              <div className="rvh-stat-sub">Ancestral village</div>
            </div>
            <div className="rvh-stat">
              <div className="rvh-stat-num">
                <CountUp end={6} duration={1500} />
              </div>
              <div className="rvh-stat-label">गौरवशाली अध्याय</div>
              <div className="rvh-stat-sub">Chapters of history</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHAPTERS ============ */}
      <section className="rvh-chapters">
        <div className="container">
          <div className="rvh-section-head reveal-on-scroll">
            <span className="rvh-section-eyebrow"> The Chapters </span>
            <h2>इतिहास की यात्रा</h2>
            <p>हर अध्याय एक नई कहानी, हर पन्ने पर एक नया सबक।</p>
          </div>

          {CHAPTERS.map((c, i) => (
            <article
              key={c.id}
              id={`chapter-${i + 1}`}
              className={`rvh-chapter reveal-on-scroll ${i % 2 === 1 ? 'rvh-chapter-alt' : ''}`}
            >
              <div className="rvh-chapter-side">
                <div className="rvh-chapter-num">{c.chapter}</div>
                <div className="rvh-chapter-emoji">{c.emoji}</div>
                <div className="rvh-chapter-era">{c.era}</div>
                <div className="rvh-chapter-line"></div>
              </div>
              <div className="rvh-chapter-card">
                <h3 className="rvh-chapter-title">{c.title}</h3>
                <blockquote className="rvh-chapter-pull">
                  <span className="rvh-quote-mark"></span>
                  {c.pull}
                </blockquote>
                <p className="rvh-chapter-body">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ FOUNDER QUOTE ============ */}
      <section className="rvh-quote-section reveal-on-scroll">
        <div className="container">
          <div className="rvh-quote-card">
            <div className="rvh-quote-icon"></div>
            <p className="rvh-quote-text">
              जहाँ राजपूत की तलवार उठती है, वहाँ इतिहास लिखा जाता है।
              रिठाला उसी इतिहास का जीवंत प्रमाण है।
            </p>
            <div className="rvh-quote-author">
              <strong>राणा राजपाल सिंह</strong>
              <span>Founder of Rithala Village · तोमर चंद्रवंशी राजपूत</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="rvh-cta-section reveal-on-scroll">
        <div className="container">
          <div className="rvh-cta-card">
            <div className="rvh-cta-icon"></div>
            <h2>क्या आपके पास कोई पुरानी कहानी है?</h2>
            <p>
              रिठाला से जुड़ी कोई तस्वीर, परिवार की याद या वीरगाथा  हमें भेजें।
              हम उसे इस archive में संजोएँगे।
            </p>
            <div className="rvh-cta-actions">
              <a href="/contact/" className="rvh-cta-primary">
                अपनी कहानी साझा करें
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
