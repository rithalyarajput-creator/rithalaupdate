import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import { RulerCard, type Ruler } from './RulerModal';
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

const RULERS: Ruler[] = [
  {
    key: 'pratap',
    modifier: 'rh-ruler-card--pratap',
    name: 'Maharana Pratap',
    era: '1540 – 1597 CE',
    clan: 'Sisodia, Mewar',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780122956511-maharana-pratap-rajput-warrior-rithala-update.jpg-4cWdZpFodaIJNbWHtqBgrxeR7pHmEu.png',
    desc: `The indomitable king who refused Mughal subjugation. Fought the Battle of Haldighati (1576) against Akbar's general Man Singh. Lived in exile but recaptured most of Mewar by 1585. His faithful horse Chetak is as legendary as the king himself.`,
    fullHistory: {
      born: '9 May 1540, Kumbhalgarh, Rajasthan',
      died: '19 January 1597, Chavand, Rajasthan',
      reign: '1572 – 1597 CE (25 years)',
      capital: 'Chittorgarh (lost), then Chavand',
      father: 'Maharana Udai Singh II',
      battles: [
        'Battle of Haldighati (1576) — vs Mughal general Man Singh I; Pratap fought valiantly but was forced to retreat; his horse Chetak carried him to safety despite being mortally wounded',
        'Battle of Dewair (1582) — decisive Rajput victory; Pratap recaptured Dewair and began reconquering Mewar',
        'Guerrilla campaigns (1577–1597) — Pratap used Aravalli hills for guerrilla warfare, continuously harassing Mughal forces and reclaiming territory',
      ],
      achievements: [
        'Refused to submit to Akbar — the only major Rajput ruler who never accepted Mughal sovereignty',
        'Recaptured most of Mewar (except Chittorgarh and Ajmer) by 1585 through relentless guerrilla warfare',
        'Built a new capital at Chavand and revived Mewar\'s administration in exile',
        'Maintained Rajput honour and independence against the mightiest empire in India\'s history',
        'His horse Chetak is immortalised in Rajput folklore for carrying the wounded king to safety before dying',
      ],
      legacy: 'Maharana Pratap is the supreme symbol of Rajput resistance and Hindu pride. He refused luxury and comfort to fight for his motherland — living in forests, eating grass rotis, sleeping on the ground — vowing never to rest until Chittorgarh was free. He is worshipped as a folk hero across Rajasthan and India. The Indian Army\'s Haldighati war cry and countless statues, films, and epics celebrate his unbreakable spirit. His life proves that honour is greater than empire.',
      story: 'Born on 9 May 1540 at the great fortress of Kumbhalgarh, Pratap Singh was the eldest son of Maharana Udai Singh II of Mewar. When his father died in 1572, Pratap was crowned Maharana despite court intrigues favouring a younger brother. Akbar, the Mughal emperor, sent multiple diplomatic missions demanding Pratap\'s submission — all of which Pratap politely but firmly refused. In 1576, Akbar sent a massive army under his Rajput general Man Singh I to crush Mewar. At the narrow pass of Haldighati, Pratap met this force with a smaller army. The battle was fierce — Pratap personally charged at Man Singh\'s elephant but was surrounded and forced to retreat. His beloved horse Chetak, though wounded in the fight, galloped 26 km before collapsing. For the next decade, Pratap lived as a fugitive in the Aravalli forests — yet never surrendered. By 1585, with Akbar distracted by conflicts in the northwest, Pratap launched a series of devastating campaigns and recaptured 36 of Mewar\'s 84 administrative districts. He died peacefully on 19 January 1597 — free, undefeated in spirit, in the forests he had made his kingdom.',
    },
  },
  {
    key: 'prithviraj',
    modifier: 'rh-ruler-card--prithviraj',
    name: 'Prithviraj Chauhan',
    era: '1149 – 1192 CE',
    clan: 'Chauhan (Chahamana), Ajmer',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780122964102-prithviraj-chauhan-rajput-emperor-rithala-update.jpg-g07BjhuXHOlWe81EsYx0Vm4p16naRT.png',
    desc: `The last Hindu emperor of Delhi. Defeated Muhammad of Ghor at the First Battle of Tarain (1191). Known for his legendary archery — shabd-bhedi baan — and his immortal love story with Sanyogita. His fall at Tarain II (1192) changed Indian history.`,
    fullHistory: {
      born: 'c. 1149 CE, Ajmer, Rajasthan',
      died: 'c. 1192 CE, Ajmer (after capture at Tarain)',
      reign: '1178 – 1192 CE (14 years)',
      capital: 'Ajmer and Delhi (Qila Rai Pithora)',
      father: 'Someshwar Chauhan',
      battles: [
        'First Battle of Tarain (1191) — crushing Rajput victory; Muhammad of Ghor was personally wounded and fled the battlefield; Prithviraj showed mercy and released him',
        'Second Battle of Tarain (1192) — catastrophic Rajput defeat; Muhammad of Ghor returned with 120,000 cavalry; Prithviraj was captured and taken to Ghor',
        'Multiple campaigns against Chandelas, Paramaras, and Ghurids throughout his reign establishing dominance over North India',
      ],
      achievements: [
        'United the Rajput confederacy and controlled the entire region from Punjab to Rajasthan',
        'Built the great fortification Qila Rai Pithora at Delhi — foundation of the city of Delhi',
        'Defeated Muhammad of Ghor at First Battle of Tarain (1191) — one of the greatest Rajput military victories',
        'Legendary master of shabd-bhedi baan (sound-guided archery) — could hit a target by sound alone in darkness',
        'His love story with Sanyogita, princess of Kannauj, is one of the greatest romantic epics in Indian literature',
      ],
      legacy: 'Prithviraj Chauhan III is remembered as the last great Hindu emperor of Delhi. His defeat at Tarain II opened the floodgates of Turkic rule in North India — a watershed moment in Indian history. The legend of his shabd-bhedi baan — killing Muhammad of Ghor in Ghor itself after being blinded — though debated by historians, has kept his memory alive for centuries. The epic poem Prithviraj Raso by his court poet Chand Bardai immortalised his deeds. His fort Qila Rai Pithora still stands in South Delhi as testimony to his power.',
      story: 'Prithviraj Chauhan III ascended the throne of Ajmer around 1178 CE at a young age and soon proved himself a warrior of extraordinary ability. He extended his kingdom across North India, defeating rival Rajput kings and establishing his capital at both Ajmer and Delhi. The great romance of his life was his elopement with Sanyogita, daughter of the rival king Jaichand of Kannauj — a love story immortalised in Chand Bardai\'s Prithviraj Raso. In 1191, when Muhammad of Ghor invaded North India, Prithviraj met him at Tarain (near Thanesar, Haryana) and inflicted a crushing defeat — personally wounding Muhammad, who fled in disgrace. In an act of Rajput chivalry, Prithviraj released the defeated Muhammad. This proved fatal: Muhammad returned in 1192 with a vastly larger army and used new tactics — feigning retreat, then attacking with fresh cavalry waves. Prithviraj\'s army was routed and he was captured. Taken to Ghazni, according to legend he used his extraordinary hearing to shoot Muhammad of Ghor with a sound-guided arrow before being killed himself. Whether legend or history, this story of a blinded king defying his captor to the last became the defining image of Rajput honour.',
    },
  },
  {
    key: 'sanga',
    modifier: 'rh-ruler-card--sanga',
    name: 'Rana Sanga',
    era: '1484 – 1527 CE',
    clan: 'Sisodia, Mewar',
    image: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1780122969037-rana-sanga-rajput-warrior-rithala-update.jpg-J1daVJIgGPStF8ndpl3b7V1cgl7heH.png',
    desc: `The mightiest Rajput king of the 16th century, who unified nearly all Rajput clans and came closest to driving out the Mughals. Bore 100 wounds from battle and lost an eye and a hand in combat. Defeated at Khanwa (1527) by Babur's superior artillery and tactics.`,
    fullHistory: {
      born: 'c. 1484 CE, Chittorgarh, Rajasthan',
      died: '30 January 1528, Kalpi (possibly poisoned by his own nobles)',
      reign: '1508 – 1527 CE (19 years)',
      capital: 'Chittorgarh, Rajasthan',
      father: 'Maharana Raimal',
      battles: [
        'Battle of Khatoli (1518) — defeated Ibrahim Lodi, Sultan of Delhi; captured the Sultan\'s commander',
        'Battle of Dholpur (1519) — another defeat inflicted on Ibrahim Lodi\'s Delhi Sultanate forces',
        'Battle of Khanwa (1527) — against Babur\'s Mughal army; Rana Sanga led 100,000+ Rajput warriors but was defeated by Babur\'s superior artillery (tufangchi) and flanking tactics; this battle decided India\'s future',
      ],
      achievements: [
        'United the most powerful Rajput confederacy in history — controlling Rajasthan, Malwa, and parts of the Delhi Sultanate',
        'Bore 80–100 battle wounds, lost one eye, lost one arm, and was permanently lame — yet continued to fight',
        'Repeatedly defeated the weakening Delhi Sultanate under Ibrahim Lodi',
        'At his peak, controlled more territory than any Rajput king since the 12th century',
        'Was on the verge of establishing a Hindu empire over North India before Babur\'s invasion',
      ],
      legacy: 'Rana Sanga came agonisingly close to restoring a great Hindu empire in North India. He was the last Rajput king who had the power to unite all clans and challenge the emerging Mughal empire. His body — marked by 100 wounds, missing an eye, missing an arm, permanently lame — was a living testament to decades of unceasing battle. Had he won at Khanwa, the course of Indian history would have been entirely different. He is revered in Rajasthan as the "last great Rajput" — the final defender of an era.',
      story: 'Rana Sangram Singh, known as Rana Sanga, was born around 1484 and rose to the throne of Mewar in 1508 after a brutal succession struggle in which he lost an eye. Far from weakening him, this forged him into the most formidable warrior-king of his age. Over the next two decades, Rana Sanga\'s body became a map of battles: he lost his left arm in one campaign, his right eye in another, suffered a permanent limp from a lance wound, and accumulated over 100 scars from sword, arrow, and lance. Yet he never stopped fighting. He systematically defeated the weakening Delhi Sultanate and built a confederacy of Rajput clans that stretched from Rajasthan to Malwa. He even initially invited Babur from Kabul to help defeat Ibrahim Lodi — a decision he quickly regretted. After Babur crushed Ibrahim Lodi at Panipat (1526), Rana Sanga gathered a massive Rajput army to eject the newcomers from India. At Khanwa in March 1527, his 100,000-strong force met Babur\'s smaller but technologically superior army. Babur\'s artillery — a new weapon in Indian warfare — decimated the Rajput cavalry charges. Rana Sanga was wounded and carried from the battlefield. He never recovered his former power and died in January 1528, possibly poisoned by his own nobles who feared his reckless courage would destroy them.',
    },
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
        <div style={{ background: '#1a0a00', padding: '8px 0 16px' }}>
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
                <RulerCard key={r.key} ruler={r} />
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
                Rithala Village History
              </a>
              <a href="/sandeep-rajput/" className="rh-btn rh-btn--outline">
                Sandeep Rajput — Rithalya Rajput
              </a>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
