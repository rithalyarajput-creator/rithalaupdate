import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import './styles.css';

export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rithalaupdate.online';

export const metadata: Metadata = {
  title: 'Rajputana History — History of Rajputs in India | Rithala Update',
  description:
    'Complete history of Rajputs in India — Suryavanshi, Chandravanshi, Agnivanshi clans, Rajput dynasties, lineages and heritage. Rithala Village Rajput heritage.',
  keywords:
    'Rajputana history, history of Rajputs in India, Rajput clans, Suryavanshi, Chandravanshi, Agnivanshi, Rajput dynasties, Rajput heritage, Rithala Rajput',
  alternates: { canonical: '/rajputana-history/' },
  openGraph: {
    title: 'Rajputana History — History of Rajputs in India | Rithala Update',
    description:
      'Complete history of Rajputs in India — Suryavanshi, Chandravanshi, Agnivanshi clans, Rajput dynasties, lineages and heritage. Rithala Village Rajput heritage.',
    url: `${SITE}/rajputana-history/`,
    type: 'article',
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────── */

const VANSH = [
  {
    key: 'surya',
    icon: '☀️',
    name: 'Suryavanshi',
    hindi: 'सूर्यवंशी राजपूत',
    sanskrit: 'सूर्यवंश — Solar Dynasty',
    modifier: 'rh-vansh-card--surya',
    desc: `Suryavanshi Rajputs trace their lineage to Surya, the Sun God. This is considered the most ancient of the three royal lineages, with roots reaching back to the legendary Solar dynasty (Ikshvaku Vamsha) of the Vedic age. Lord Rama of the Ramayana was himself a Suryavanshi king.`,
    elaboration: `In the medieval period, Suryavanshi clans dominated large parts of Rajasthan, Punjab, and Central India. They were celebrated for their adherence to dharma, their warrior code, and their patronage of temples and arts.`,
    clans: 'Key clans: Rathore, Sisodia, Bhati, Kachwaha, Jadeja, Katoch',
  },
  {
    key: 'chandra',
    icon: '🌙',
    name: 'Chandravanshi',
    hindi: 'चंद्रवंशी राजपूत',
    sanskrit: 'चंद्रवंश — Lunar Dynasty',
    modifier: 'rh-vansh-card--chandra',
    desc: `Chandravanshi Rajputs claim descent from Chandra, the Moon God. Their lineage passes through the legendary king Puru and the great Pandavas of the Mahabharata. The Chandravanshis are celebrated in the Mahabharata as rulers of Hastinapur and Indraprastha (modern Delhi).`,
    elaboration: `The Tomar Rajputs — founders of Delhi — are among the most distinguished Chandravanshi clans. Rithala village itself is connected to this proud Tomar/Chandravanshi tradition, making this lineage particularly relevant to the history of North Delhi.`,
    clans: 'Key clans: Tomar/Tanwar, Yadav (Bhati branch), Chandel, Baghel, Haihaya',
  },
  {
    key: 'agni',
    icon: '🔥',
    name: 'Agnivanshi',
    hindi: 'अग्निवंशी राजपूत',
    sanskrit: 'अग्निवंश — Fire Dynasty',
    modifier: 'rh-vansh-card--agni',
    desc: `Agnivanshi Rajputs believe their ancestors emerged from a sacred fire (Agnikund) on Mount Abu during a Vedic yagna performed by sages to create warriors who could protect dharma. The Agnivansha narrative is enshrined in the bardic text Prithviraj Raso by the poet Chand Bardai.`,
    elaboration: `This lineage includes some of the most formidable military clans in Indian history — the Chauhans, Paramaras, Solankis, and Pratiharas. They ruled vast kingdoms and repeatedly repelled foreign invasions during the early medieval period.`,
    clans: 'Key clans: Chauhan (Chahamana), Paramara, Solanki (Chaulukya), Pratihara',
  },
];

const CLANS = [
  {
    name: 'Rathore — राठौड़',
    badge: 'Marwar / Jodhpur',
    vansh: 'Suryavanshi',
    desc: `The Rathore clan is one of the largest and most powerful Rajput clans, ruling the Marwar kingdom from their capital at Jodhpur in present-day Rajasthan. Founded by Rao Siha in the 13th century, the Rathores expanded their kingdom over centuries through military prowess and strategic alliances.`,
    detail: `The iconic Mehrangarh Fort of Jodhpur stands as the greatest testament to Rathore power and architectural ambition. Rao Jodha founded Jodhpur in 1459 CE and built Mehrangarh on a rocky promontory, 122 metres above the plains. The Rathores gave India heroes like Rao Chandrasen, who resisted Mughal expansion, and the revered Durgadas Rathore, who famously protected prince Ajit Singh from Aurangzeb's forces.`,
    facts: ['Founded: ~1226 CE', 'Capital: Jodhpur', 'Fort: Mehrangarh', 'Region: Marwar, Rajasthan'],
  },
  {
    name: 'Sisodia — सिसोदिया',
    badge: 'Mewar / Chittorgarh',
    vansh: 'Suryavanshi',
    desc: `The Sisodia clan of Mewar is perhaps the most celebrated in all of Rajputana, renowned for their unbroken tradition of resistance against foreign domination. Claiming descent from the sun god Surya through the Guhila dynasty, the Sisodias ruled Mewar from Chittorgarh.`,
    detail: `Maharana Pratap Singh (1540–1597 CE) remains their greatest hero — the warrior king who refused to submit to Akbar's Mughal empire and fought the legendary Battle of Haldighati in 1576 CE. Even after losing his kingdom, Pratap lived in the Aravalli forests, surviving on grass rotis, vowing never to sleep in a bed until Chittorgarh was reclaimed. His fierce loyalty to Rajput honour and Hindu dharma made him an immortal symbol of resistance. Mewar's motto — "Jo Dridh Raakhe Dharm Ko, Tahi Raakhe Kartar" (He who stands firm in dharma, God protects him) — captures the Sisodia spirit.`,
    facts: ['Founded: 566 CE (Guhila origin)', 'Capital: Chittorgarh, Udaipur', 'Hero: Maharana Pratap', 'Motto: Jai Eklingji'],
  },
  {
    name: 'Chauhan — चौहान',
    badge: 'Ajmer / Sambhar',
    vansh: 'Agnivanshi',
    desc: `The Chahamana (Chauhan) dynasty ruled the Sapadalaksha kingdom centered on Ajmer and Sambhar in Rajasthan. At their height in the 12th century, the Chauhans controlled large parts of north India including Delhi and Hansi.`,
    detail: `Prithviraj Chauhan III (1149–1192 CE) — also called Rai Pithora — was the last Hindu emperor of Delhi and the greatest of all Chauhan rulers. He defeated Muhammad of Ghor at the First Battle of Tarain (1191 CE) but was defeated and captured at the Second Battle of Tarain (1192 CE), a watershed moment that opened North India to Turkic rule. The ballad of Prithviraj-Sanyogita remains one of the most beloved romantic epics in Rajput literary tradition. Chand Bardai's Prithviraj Raso immortalised his deeds for centuries.`,
    facts: ['Capital: Ajmer, Sambhar', 'Famous ruler: Prithviraj Chauhan III', 'Battle: Tarain 1191 & 1192', 'Region: Rajasthan, Haryana'],
  },
  {
    name: 'Kachwaha — कछवाहा',
    badge: 'Jaipur / Amber',
    vansh: 'Suryavanshi',
    desc: `The Kachwaha clan ruled the kingdom of Amber (later Jaipur) from their magnificent hilltop fortress of Amer. They are distinguished by their early and pragmatic alliance with the Mughal empire, which brought them enormous power and influence.`,
    detail: `Raja Man Singh I served as one of Akbar's nine gems (Navaratnas) and led Mughal armies across the subcontinent. His successor Mirza Raja Jai Singh I further cemented the Kachwaha position. The great astronomer-king Sawai Jai Singh II (1688–1743) founded the planned city of Jaipur in 1727 CE — one of India's first planned cities — and built the famous Jantar Mantar observatories. The stunning Amber Fort and the City Palace of Jaipur remain their greatest architectural legacies, drawing millions of visitors each year.`,
    facts: ['Capital: Amber, then Jaipur', 'Founded: ~967 CE', 'Famous: Jai Singh II, Man Singh I', 'Fort: Amber Fort'],
  },
  {
    name: 'Bhati — भाटी',
    badge: 'Jaisalmer',
    vansh: 'Chandravanshi (Yadava branch)',
    desc: `The Bhati Rajputs claim descent from the Yadava branch of the Chandravansha through Bhati, a descendant of Krishna. They established the desert kingdom of Jaisalmer in the heart of the Thar desert — one of the most dramatic medieval fortifications in the world.`,
    detail: `Rawal Jaisal founded Jaisalmer in 1156 CE on the strategic Trikuta Hill, the golden sandstone fortress rising from the desert sands becoming a vital waypoint on the trade routes between India and Central Asia. The Bhati rulers accumulated vast wealth from taxing these trade caravans. Jaisalmer Fort — known as the "Golden Fort" (Sonar Quila) — is one of the few living forts in the world, with thousands of people still residing within its walls. The exquisite Jain temples inside the fort, with their intricate carved marble, showcase the cultural patronage of the Bhati rulers.`,
    facts: ['Capital: Jaisalmer', 'Founded: 1156 CE', 'Fort: Sonar Quila (Golden Fort)', 'Region: Thar Desert, Rajasthan'],
  },
  {
    name: 'Jadeja — जाडेजा',
    badge: 'Kutch / Kathiawar',
    vansh: 'Chandravanshi (Yadava)',
    desc: `The Jadeja clan rules the Kutch region of Gujarat, claiming descent from the Samma Rajputs and ultimately from the Yadava-Chandravanshi lineage. They established their kingdom around the 10th–11th century in the Kutch peninsula.`,
    detail: `The Jadejas founded the town of Bhuj as their capital, and their kingdom of Kutch remained one of the longest-surviving independent princely states in western India, only merging with the Indian Union in 1948. They were celebrated patrons of Kutchi embroidery, music, and the unique Kutchi culture that blended Sindhi, Gujarati, and Rajasthani influences. The Aina Mahal (Palace of Mirrors) and Prag Mahal in Bhuj are testimony to their artistic patronage. The clan produced numerous warrior-kings and was known for its naval prowess in the Arabian Sea trade routes.`,
    facts: ['Capital: Bhuj', 'Region: Kutch, Gujarat', 'Known for: Kutchi arts & crafts', 'Merged with India: 1948'],
  },
  {
    name: 'Katoch — कटोच',
    badge: 'Kangra / Trigarta',
    vansh: 'Chandravanshi',
    desc: `The Katoch dynasty of Kangra (Trigarta) in Himachal Pradesh is considered the oldest surviving royal dynasty in the world, with a lineage spanning over 4,000 years. They ruled from the impregnable Kangra Fort, perched high in the Himalayas.`,
    detail: `Ancient texts including the Mahabharata and the Puranas mention the Trigarta kingdom, making the Katoch heritage one of the oldest documented royal lineages in human history. The Katoch kings were devoted to goddess Vajreshwari (Kangra Devi), whose temple at Kangra is one of the most ancient and revered shakti peethas in India. Kangra Fort — also called Nagarkot — was besieged countless times by Mahmud of Ghazni, Firuz Shah Tughlaq, Akbar, and Maharaja Ranjit Singh, yet the Katoch rulers defended it with remarkable tenacity for millennia.`,
    facts: ['Lineage: 4,000+ years', 'Capital: Kangra (Nagarkot)', 'Region: Himachal Pradesh', 'Ancient name: Trigarta'],
  },
  {
    name: 'Tomar / Tanwar — तोमर / तँवर',
    badge: 'Delhi / Haryana',
    vansh: 'Chandravanshi',
    desc: `The Tomar (Tanwar) Rajputs are the founders of Delhi — one of the most historically consequential acts in South Asian history. They established Dhillika (ancient Delhi) around the 8th century CE, making them the progenitors of what would become the capital of empires.`,
    detail: `The Tomar king Anangpal II is credited with founding Delhi in 736 CE and constructing the Lal Kot fortress. He also installed the famous Iron Pillar of Delhi (originally from Mathura) at the Quwwat-ul-Islam mosque site. After the Tomaras, the Chauhans took control of Delhi, but the Tomar legacy endures in the very soil of the city. The village of Rithala in North Delhi has ancient roots connected to the Tomar-Chandravanshi Rajput tradition, with local families preserving this heritage across generations.`,
    facts: ['Founded Delhi: ~736 CE', 'King: Anangpal II', 'Fort: Lal Kot (Delhi)', 'Legacy: Rithala Village connection'],
  },
];

const RULERS = [
  {
    key: 'pratap',
    modifier: 'rh-ruler-card--pratap',
    name: 'Maharana Pratap',
    era: '1540 – 1597 CE',
    clan: 'Sisodia, Mewar',
    image: '/maharana-pratap.jpg',
    desc: `The indomitable king who refused Mughal subjugation. Fought the Battle of Haldighati (1576) against Akbar's general Man Singh. Lived in exile but recaptured most of Mewar by 1585. His faithful horse Chetak is as legendary as the king himself.`,
  },
  {
    key: 'prithviraj',
    modifier: 'rh-ruler-card--prithviraj',
    name: 'Prithviraj Chauhan',
    era: '1149 – 1192 CE',
    clan: 'Chauhan, Ajmer',
    image: '/prithviraj-chauhan.jpg',
    desc: `The last Hindu emperor of Delhi. Defeated Muhammad of Ghor at the First Battle of Tarain (1191). Known for his legendary archery — shabd-bhedi baan — and his immortal love story with Sanyogita. His fall at Tarain II (1192) changed Indian history.`,
  },
  {
    key: 'sanga',
    modifier: 'rh-ruler-card--sanga',
    name: 'Rana Sanga',
    era: '1484 – 1527 CE',
    clan: 'Sisodia, Mewar',
    image: null,
    desc: `The mightiest Rajput king of the 16th century, who unified nearly all Rajput clans and came closest to driving out the Mughals. Bore 100 wounds from battle and lost an eye and a hand in combat. Defeated at Khanwa (1527) by Babur's superior artillery and tactics.`,
  },
];

/* ─── Timeline data ─────────────────────────────────────────────────────── */
const TIMELINE = [
  { year: '~3000 BCE', label: 'Vedic Solar & Lunar dynasties mentioned in Puranas' },
  { year: '736 CE', label: 'Tomar Rajputs found Delhi (Dhillika)' },
  { year: '738 CE', label: 'Bappa Rawal defeats Arab invaders at Battle of Rajasthan' },
  { year: '1156 CE', label: 'Rawal Jaisal founds Jaisalmer Fort' },
  { year: '1191 CE', label: 'Prithviraj Chauhan defeats Ghor at First Battle of Tarain' },
  { year: '1576 CE', label: 'Battle of Haldighati — Maharana Pratap vs Mughals' },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function RajputanaHistoryPage() {
  return (
    <PublicShell>
      <main className="rh-page" itemScope itemType="https://schema.org/Article">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="rh-hero" aria-label="Page hero">
          <div className="rh-hero-inner">
            <span className="rh-hero-badge">राजपूताना • Rajputana • Heritage</span>
            <h1 itemProp="headline">Rajputana History</h1>
            <p className="rh-hero-subtitle">
              राजपुताना का गौरवशाली इतिहास — History of Rajputs in India
            </p>
          </div>
        </section>

        {/* ── Timeline strip ──────────────────────────────────────────────── */}
        <div style={{ background: '#1a0a00', padding: '0 0 4px' }}>
          <div className="rh-container">
            <div className="rh-timeline" role="list" aria-label="Key dates in Rajput history">
              {TIMELINE.map((t) => (
                <div className="rh-timeline-item" key={t.year} role="listitem">
                  <div className="rh-timeline-dot" aria-hidden="true"></div>
                  <span className="rh-timeline-year">{t.year}</span>
                  <span className="rh-timeline-label">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Intro ───────────────────────────────────────────────────────── */}
        <section className="rh-section" aria-labelledby="intro-heading">
          <div className="rh-container">
            <h2 className="rh-section-title" id="intro-heading">Who Are the Rajputs?</h2>
            <div className="rh-intro-grid">
              <div className="rh-intro-text" itemProp="articleBody">
                <p>
                  The word <strong>Rajput</strong> derives from the Sanskrit <em>rājaputra</em> (राजपुत्र),
                  meaning <em>&quot;son of a king&quot;</em> or <em>&quot;son of a ruler.&quot;</em> As a
                  social, martial, and political identity, the Rajputs rose to prominence between the
                  <strong> 6th and 12th centuries CE</strong>, consolidating control over vast swaths of
                  northern, western, and central India — a region that came to be known as{' '}
                  <strong>Rajputana</strong> (the &quot;Land of the Rajputs,&quot; roughly present-day Rajasthan).
                </p>
                <p>
                  Rajput identity is defined not merely by lineage but by a rigorous warrior code —{' '}
                  <em>Kshatriya dharma</em>. This code valorised courage (<em>veer rasa</em>), honour (
                  <em>maryada</em>), protection of women and the weak, loyalty to one&apos;s lord, and death in
                  battle over the disgrace of surrender. The practice of <strong>Jauhar</strong> (mass
                  self-immolation by women to avoid dishonour) and <strong>Saka</strong> (the last suicidal
                  charge by men) exemplified this code at its most extreme.
                </p>
                <p>
                  At their zenith, Rajput clans controlled kingdoms stretching from Sindh to Bengal, from
                  the Himalayas to the Deccan plateau. They were prolific builders of temples, stepwells, and
                  forts; generous patrons of Sanskrit literature, music, painting, and dance; and fierce
                  defenders of regional cultures and Hindu religious traditions.
                </p>
                <p>
                  Today, the Rajput community numbers over <strong>100 million people</strong> across India,
                  concentrated in Rajasthan, Haryana, Uttar Pradesh, Gujarat, Himachal Pradesh, Punjab, and
                  Delhi — including historic villages like Rithala in North Delhi, whose Rajput families
                  preserve centuries of this living heritage.
                </p>
              </div>
              <div>
                <div className="rh-intro-highlight">
                  <strong>राजपुत्र → Rajput</strong>
                  <em>&quot;Son of a King&quot;</em> — the word itself encodes nobility, dharma, and the
                  warrior ethos that shaped Indian history for over a millennium.
                  <br /><br />
                  The Rajput age (c. 650–1200 CE) was one of extraordinary creativity: the temples of
                  Khajuraho, Dilwara, and Somnath; the epics of Prithviraj Raso and Alha-Udal; the
                  miniature paintings of Rajputana — all bear witness to a civilization as artistically
                  brilliant as it was militarily formidable.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Three Vansh ─────────────────────────────────────────────────── */}
        <section className="rh-section-alt" aria-labelledby="vansh-heading">
          <div className="rh-container">
            <h2 className="rh-section-title" id="vansh-heading">The Three Royal Lineages (Vansha)</h2>
            <p className="rh-section-lead">
              All Rajput clans trace their ancestry to one of three primordial lineages — the Solar
              dynasty (Suryavansha), the Lunar dynasty (Chandravansha), or the Fire dynasty (Agnivansha).
              These mythological origins gave each clan its spiritual identity and legitimised royal authority.
            </p>
            <div className="rh-vansh-grid">
              {VANSH.map((v) => (
                <article
                  key={v.key}
                  className={`rh-vansh-card ${v.modifier}`}
                  itemScope
                  itemType="https://schema.org/Thing"
                >
                  <span className="rh-vansh-icon" aria-hidden="true"></span>
                  <h3 itemProp="name">{v.name}</h3>
                  <span className="rh-vansh-sanskrit">{v.sanskrit} | {v.hindi}</span>
                  <p>{v.desc}</p>
                  <p>{v.elaboration}</p>
                  <div className="rh-vansh-clans">
                    <strong>Major Clans — </strong>{v.clans.replace('Key clans: ', '')}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Major Clans ─────────────────────────────────────────────────── */}
        <section className="rh-section" aria-labelledby="clans-heading">
          <div className="rh-container">
            <h2 className="rh-section-title" id="clans-heading">Major Rajput Clans</h2>
            <p className="rh-section-lead">
              There are 36 royal clans (chattis rajkulas) recognised in classical Rajput tradition.
              Each clan has a distinct origin legend, territorial homeland, clan deity (kul devi),
              and historical legacy. Below are the most historically significant clans.
            </p>
            <div className="rh-clans-list">
              {CLANS.map((clan) => (
                <details key={clan.name} className="rh-clan-details">
                  <summary className="rh-clan-summary">
                    <span className="rh-clan-summary-left">
                      <span>{clan.name}</span>
                      <span className="rh-clan-badge">{clan.badge}</span>
                    </span>
                    <span className="rh-clan-arrow" aria-hidden="true">▾</span>
                  </summary>
                  <div className="rh-clan-body">
                    <p><strong>Lineage:</strong> {clan.vansh}</p>
                    <p>{clan.desc}</p>
                    <p>{clan.detail}</p>
                    <div className="rh-clan-facts">
                      {clan.facts.map((f) => (
                        <span key={f} className="rh-fact-tag">{f}</span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Famous Rulers ───────────────────────────────────────────────── */}
        <section className="rh-section-alt" aria-labelledby="rulers-heading">
          <div className="rh-container">
            <h2 className="rh-section-title" id="rulers-heading">Famous Rajput Rulers</h2>
            <p className="rh-section-lead">
              From the desert fortresses of Rajputana to the hills of Himachal, these warrior-kings
              left an indelible mark on Indian history — their deeds celebrated in ballads, epics, and
              folk memory across generations.
            </p>
            <div className="rh-rulers-grid">
              {RULERS.map((r) => (
                <article
                  key={r.key}
                  className={`rh-ruler-card ${r.modifier}`}
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  {r.image ? (
                    <img src={r.image} alt={r.name} className="rh-ruler-img" />
                  ) : (
                    <div className="rh-ruler-img-placeholder" role="img" aria-label={r.name}></div>
                  )}
                  <div className="rh-ruler-info">
                    <span className="rh-ruler-era">{r.era} · {r.clan}</span>
                    <h3 itemProp="name">{r.name}</h3>
                    <p itemProp="description">{r.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rithala Village Connection ──────────────────────────────────── */}
        <section className="rh-rithala-section" aria-labelledby="rithala-heading">
          <div className="rh-container">
            <div className="rh-rithala-inner">
              <div className="rh-rithala-text">
                <h2 id="rithala-heading">
                  Rithala Village — रिठाला गाँव का राजपूत गौरव
                </h2>
                <p>
                  Rithala village in North Delhi carries within it the living memory of Rajput heritage.
                  Its roots are tied to the <strong>Tomar (Tanwar) Rajput</strong> lineage —
                  the Chandravanshi warriors who founded Delhi itself. For over six centuries, Rithala&apos;s
                  Rajput families have preserved their clan traditions, martial values, and cultural identity
                  amid the rapid urbanisation of the Delhi NCR region.
                </p>
                <p>
                  The village&apos;s Rajput identity is not merely historical — it is vibrantly alive. Community
                  leaders and public figures who have emerged from Rithala carry the values of the{' '}
                  <em>Kshatriya</em> tradition: service to community (<em>seva</em>), protection of the
                  vulnerable, and pride in cultural heritage. This commitment is embodied by figures like{' '}
                  <strong>Sandeep Rajput (Rithalya Rajput)</strong>, whose deep roots in the village
                  community reflect the enduring Rajput ethos of honour and public service.
                </p>
                <p>
                  Rithala&apos;s Rajput families celebrate traditional clan festivals, maintain the veneration of
                  clan deities (kul devis), and continue practices that connect them to the grand sweep of
                  Rajputana history — from the founding of Delhi by the Tomaras to the valor of Maharana
                  Pratap in the jungles of Mewar.
                </p>
              </div>
              <blockquote className="rh-rithala-quote">
                रजपूती खून है, रिठाला की पहचान है —
                जब तक सूरज चाँद रहेगा, राजपूत का नाम रहेगा।
                <br /><br />
                Rajput blood is Rithala&apos;s identity —
                as long as the sun and moon endure, so will the name of the Rajput.
                <cite>— Rithala Village Rajput Saying</cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── Rajputana Heritage Summary ──────────────────────────────────── */}
        <section className="rh-section" aria-labelledby="heritage-heading">
          <div className="rh-container">
            <h2 className="rh-section-title" id="heritage-heading">Rajputana Heritage — A Living Legacy</h2>
            <p className="rh-section-lead">
              The story of the Rajputs is not confined to medieval battlefields. It is a living, breathing
              cultural tradition that continues to shape identity, art, architecture, and community across
              India — and in villages like Rithala, it remains a source of pride and purpose.
            </p>
            <div className="rh-intro-grid">
              <div className="rh-intro-text">
                <p>
                  <strong>Architecture:</strong> The great Rajput forts — Mehrangarh, Amer, Chittorgarh,
                  Jaisalmer, Kangra — are UNESCO-recognised wonders that attract millions of visitors annually.
                  Their engineering sophistication, aesthetic grandeur, and strategic ingenuity continue to
                  astonish historians and architects worldwide.
                </p>
                <p>
                  <strong>Art & Literature:</strong> Rajput miniature painting, a distinct tradition that
                  flourished from the 16th–19th centuries, is celebrated in major museums globally. The bardic
                  tradition — <em>Charans</em> and <em>Bhats</em> preserving clan histories — created a rich
                  oral and written literature unique in the world.
                </p>
                <p>
                  <strong>Military tradition:</strong> From Maharana Pratap&apos;s guerrilla warfare to the
                  Rajput regiments of the British Indian Army (among the most decorated units in both World
                  Wars), the martial tradition has never died. Today, Rajput soldiers serve with distinction
                  in the Indian Army&apos;s Rajput Regiment, founded in 1778.
                </p>
                <p>
                  <strong>Cultural identity:</strong> Rajput festivals (Gangaur, Teej), marriage customs
                  (the sacred baraat), clan deity worship, and the folk songs (geet) of Rajputana are
                  practised by millions of families from the Thar Desert to the hills of Delhi — including
                  the proud Rajput families of Rithala village.
                </p>
              </div>
              <div className="rh-intro-highlight">
                <strong>36 Royal Clans — Chattis Rajkulas</strong>
                Classical texts enumerate 36 royal clans as the pillars of Rajput civilization. These
                include the Suryavanshi, Chandravanshi, and Agnivanshi lineages, each subdivided into
                dozens of sub-clans across the Indian subcontinent.
                <br /><br />
                Whether in the golden forts of Rajasthan, the green fields of Haryana, the mountain
                kingdoms of Himachal, or the ancient lanes of Delhi villages like Rithala, the Rajput
                legacy is India&apos;s most durable living connection to its medieval warrior past.
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="rh-cta-section" aria-label="Explore more">
          <div className="rh-container">
            <h2>Explore Rithala&apos;s Rajput Heritage</h2>
            <p>
              Discover the full history of Rithala village and the story of Sandeep Rajput —
              two pillars of Rajput pride in North Delhi.
            </p>
            <div className="rh-cta-buttons">
              <a href="/rithala-village-history/" className="rh-btn rh-btn--gold">
                📖 Rithala Village History
              </a>
              <a href="/sandeep-rajput/" className="rh-btn rh-btn--outline">
                👤 Sandeep Rajput — Rithalya Rajput
              </a>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
