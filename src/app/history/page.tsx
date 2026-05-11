import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';

export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Rithala Village History — रिठाला गाँव का इतिहास, राजपूताना विरासत',
  description:
    'रिठाला गाँव दिल्ली का प्राचीन ऐतिहासिक गाँव — Tomar Rajput History, Rana Rajpal Singh, लाठी वाला, पूठ कलां और राजपूताना वीरता की पूरी कहानी।',
  keywords: [
    'Rithala Village History', 'रिठाला गाँव इतिहास', 'Tomar Rajput',
    'Rana Rajpal Singh', 'राणा राजपाल सिंह', 'लाठी वाला',
    'पूठ कलां', 'राजपूताना वीरता', 'Delhi village history',
  ],
  alternates: { canonical: '/history/' },
  openGraph: {
    title: 'Rithala Village History — रिठाला गाँव का इतिहास',
    description: 'Tomar Rajput history, Rana Rajpal Singh, और राजपूताना वीरता की पूरी कहानी।',
    type: 'article',
  },
};

const STORY_BLOCKS = [
  {
    id: 'intro',
    year: '1384-85',
    icon: '🏛️',
    title: 'रिठाला गाँव का इतिहास',
    body:
      'रिठाला गाँव दिल्ली के प्राचीन और ऐतिहासिक गाँवों में से एक है, जो अपनी राजपूताना विरासत, वीरता और सांस्कृतिक गौरव के लिए प्रसिद्ध है। यह गाँव आज भी दिल्ली के Tomar Rajput History और राजपूत परंपरा का जीवंत प्रतीक है। रिठाला गाँव की स्थापना 1384–85 ईस्वी में हुई थी, जब दिल्ली पर सुल्तान फिरोज शाह तुगलक का शासन था। इस गाँव की नींव राणा राजपाल सिंह (Rana Rajpal Singh) ने रखी थी, जो तोमर चंद्रवंशी राजपूत वंश के साहसी योद्धा थे। यह राजपूत वंश अपनी शौर्य गाथाओं, युद्ध कौशल और सांस्कृतिक धरोहर के लिए प्रसिद्ध था।',
    align: 'left',
  },
  {
    id: 'lathi-wala',
    year: 'प्राचीन काल',
    icon: '🥢',
    title: 'लाठी वाला: रिठाला की वीर गाथा',
    body:
      'रिठाला गाँव का प्राचीन नाम "लाठी वाला" था। इस नाम का कारण गाँव के निवासियों की योद्धा परंपरा और शस्त्र-कौशल था। यहाँ के लोग लाठी, भाला, तलवार और पारंपरिक हथियारों के प्रयोग में निपुण थे। उस समय गाँव की सुरक्षा किसी क़िले या बड़ी दीवार पर निर्भर नहीं थी, बल्कि युवा योद्धाओं की बहादुरी पर आधारित थी। जब भी आसपास कोई खतरा उत्पन्न होता, लाठी वालों की टोली सबसे पहले आगे बढ़कर अपने गाँव और परिवार की रक्षा करती थी। यही कारण है कि यह गाँव अपनी योद्धा पहचान के कारण "लाठी वाला" नाम से प्रसिद्ध हुआ।',
    align: 'right',
  },
  {
    id: 'puth-kalan',
    year: '1048-49',
    icon: '⚔️',
    title: 'राणा राजपाल सिंह और पूठ कलां',
    body:
      'राणा राजपाल सिंह के पूर्वज प्रारम्भ में पूठ कलां गाँव में रहते थे, जिसकी स्थापना लगभग 1048–49 ईस्वी में हुई थी। यह इलाका उस समय तोमर राजपूत वंश के नियंत्रण में था। पूठ कलां गाँव कृषि और पशुपालन पर आधारित था और यह राजपूतों की सैन्य शक्ति का प्रतीक माना जाता था। समय के साथ जनसंख्या वृद्धि, सामाजिक विस्तार और सुरक्षा कारणों से राणा राजपाल सिंह ने अपने समुदाय के लिए नई बस्ती बसाने का निर्णय लिया। इसी निर्णय से रिठाला अस्तित्व में आया, जो रणनीतिक रूप से सुरक्षित और संसाधनों से भरपूर क्षेत्र था।',
    align: 'left',
  },
  {
    id: 'rajputana-veerta',
    year: 'सदियों से',
    icon: '🐎',
    title: 'राजपूताना वीरता और संघर्ष',
    body:
      'रिठाला गाँव की पहचान हमेशा से राजपूताना वीरता और संघर्ष की परंपरा से रही है। गाँव के निवासी तोमर चंद्रवंशी राजपूत थे, जो न केवल अपनी कृषि भूमि की रक्षा करते थे, बल्कि आसपास के क्षेत्र में सुरक्षा और शौर्य का प्रतीक भी थे। जब भी कोई संकट आता, गाँव के युवा योद्धा लाठी, तलवार और धनुष-बाण लेकर मोर्चा संभालते। यही परंपरा आगे चलकर गाँव की सांस्कृतिक धरोहर बनी। आज भी गाँव के बुज़ुर्ग पुरखों की शौर्य गाथाएँ सुनाते हैं, जिससे नई पीढ़ी अपने इतिहास पर गर्व महसूस कर सके।',
    align: 'right',
  },
  {
    id: 'samajik',
    year: 'परंपरा',
    icon: '🤝',
    title: 'सामाजिक और सांस्कृतिक परंपराएँ',
    body:
      'रिठाला गाँव न केवल अपनी वीरता के लिए, बल्कि अपनी सांस्कृतिक एकता और परंपराओं के लिए भी जाना जाता है। त्यौहार, धार्मिक आयोजन, मेलों और पारंपरिक रस्मों को यहाँ पीढ़ी-दर-पीढ़ी पूरी श्रद्धा और उत्साह के साथ निभाया जाता है। भाईचारा और सामाजिक एकता इस गाँव की सबसे बड़ी ताकत रही है। समय के साथ, इस गाँव ने अपनी लोककथाओं, वीर गाथाओं और रीति-रिवाजों के माध्यम से एक समृद्ध सांस्कृतिक पहचान बनाई।',
    align: 'left',
  },
  {
    id: 'modern',
    year: 'आज तक',
    icon: '🏯',
    title: 'वर्तमान में ऐतिहासिक पहचान',
    body:
      'आज भले ही रिठाला गाँव शहरीकरण और आधुनिकता की ओर बढ़ चुका है, लेकिन इसका ऐतिहासिक और सांस्कृतिक गौरव आज भी जीवित है। गाँव के पुराने हवेलियाँ, चौपालें और पारंपरिक गलियाँ अभी भी अतीत की झलक दिखाती हैं। बुज़ुर्ग और इतिहास प्रेमी आज भी नई पीढ़ी को पूर्वजों की वीरता और संघर्ष की कहानियाँ सुनाते हैं, ताकि उनका इतिहास और परंपरा हमेशा जीवित रहे। रिठाला गाँव आज भी राजपूताना शौर्य, सांस्कृतिक गौरव और सामाजिक एकता का प्रतीक माना जाता है।',
    align: 'right',
  },
];

const STATS = [
  { num: '1384-85', label: 'गाँव की स्थापना' },
  { num: '640+', label: 'वर्षों का इतिहास' },
  { num: '1048-49', label: 'पूठ कलां स्थापना' },
  { num: '∞', label: 'राजपूताना गौरव' },
];

export default function HistoryPage() {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'रिठाला गाँव का इतिहास — Rithala Village History',
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
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/history/` },
    keywords: 'Rithala Village History, Tomar Rajput, Rana Rajpal Singh, राजपूताना, लाठी वाला, पूठ कलां',
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* HERO */}
      <section className="history-hero reveal-on-scroll">
        <div className="history-hero-decor" aria-hidden="true">
          <span className="hh-shape hh-shape-1">⚔️</span>
          <span className="hh-shape hh-shape-2">🚩</span>
          <span className="hh-shape hh-shape-3">🏰</span>
          <span className="hh-shape hh-shape-4">🛡️</span>
          <span className="hh-shape hh-shape-5">🐎</span>
        </div>
        <div className="container">
          <span className="history-eyebrow">📜 Heritage · Since 1384</span>
          <h1 className="history-h1">
            <span className="history-h1-hi">रिठाला गाँव का इतिहास</span>
            <span className="history-h1-en">The Story of Rithala Village</span>
          </h1>
          <p className="history-lead">
            तोमर चंद्रवंशी राजपूत परंपरा · राणा राजपाल सिंह · 640+ वर्षों की वीरता
            और संस्कृति की जीवंत कहानी
          </p>
          <div className="history-scroll-hint" aria-hidden="true">
            <span></span>
            <small>scroll to explore</small>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="history-stats reveal-on-scroll">
        <div className="container">
          <div className="hs-grid">
            {STATS.map((s, i) => (
              <div key={i} className="hs-stat-card">
                <div className="hs-stat-num">{s.num}</div>
                <div className="hs-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="history-timeline">
        <div className="container">
          <div className="history-timeline-header reveal-on-scroll">
            <h2>📖 इतिहास की यात्रा</h2>
            <p>हर पड़ाव एक कहानी कहता है — पूठ कलां से रिठाला तक</p>
          </div>

          <div className="timeline-track">
            <div className="timeline-line" aria-hidden="true"></div>
            {STORY_BLOCKS.map((block, i) => (
              <article
                key={block.id}
                id={block.id}
                className={`timeline-block reveal-on-scroll ${block.align === 'right' ? 'tb-right' : 'tb-left'}`}
              >
                <div className="timeline-dot" aria-hidden="true">
                  <span>{block.icon}</span>
                </div>
                <div className="timeline-card">
                  <span className="timeline-year">{block.year}</span>
                  <h3 className="timeline-title">{block.title}</h3>
                  <div className="timeline-image-placeholder" aria-hidden="true">
                    <span>🖼️ Image space</span>
                    <small>Admin → Media → upload & paste URL here</small>
                  </div>
                  <p className="timeline-body">{block.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="history-cta reveal-on-scroll">
        <div className="container">
          <div className="history-cta-inner">
            <h2>🚩 जय राजपूताना!</h2>
            <p>
              क्या आपके पास भी रिठाला से जुड़ी कोई पुरानी तस्वीर, कहानी या याद है?
              हमारे साथ साझा करें — हम उसे यहाँ हमेशा के लिए संजोएँगे।
            </p>
            <div className="history-cta-buttons">
              <a href="/contact/" className="btn-hero-primary">
                <span className="btn-hero-text">📜 अपनी कहानी साझा करें</span>
                <span className="btn-hero-arrow">→</span>
              </a>
              <a href="/category/history/" className="btn-hero-secondary">
                सभी History Posts →
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
