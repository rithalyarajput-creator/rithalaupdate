'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  // Hero
  ab_hero_label: 'About Us',
  ab_hero_h1: 'The Story Behind Rithala Update',
  ab_hero_sub: 'A digital platform preserving the identity, culture and heritage of Rithala Village, Delhi — created by Sandeep Rajput (Rithalya Rajput).',
  ab_hero_sub_hi: 'रिठाला गाँव की पहचान, संस्कृति और विरासत को डिजिटल रूप में संरक्षित करने के लिए बनाया गया मंच।',
  ab_launch_text: 'Social Media: 2020 onwards',
  ab_launch_date: 'Website: 17 May 2026',
  // Stats
  ab_stat1_n: '640+', ab_stat1_l: 'Years of Heritage',
  ab_stat2_n: 'May 2026', ab_stat2_l: 'Website Launched',
  ab_stat3_n: '1384', ab_stat3_l: 'Village Founded',
  ab_stat4_n: '1', ab_stat4_l: 'Founder & Creator',
  // Mission
  ab_mission_en: 'To digitally connect the people of Rithala and preserve the identity, culture, and heritage of the village for future generations — so that every story, festival, photograph and memory of Rithala lives on in the modern digital age.',
  ab_mission_hi: 'रिठाला के लोगों को डिजिटल रूप से जोड़ना और गाँव की पहचान, संस्कृति और विरासत को आने वाली पीढ़ियों के लिए संरक्षित करना।',
  // Pillars
  ab_pillar1_en: 'Local News & Updates', ab_pillar1_hi: 'ताज़ा खबरें', ab_pillar1_text: 'Latest news, village updates, government announcements and important information related to Rithala Village, Delhi delivered in one place.', ab_pillar1_texthi: 'रिठाला गाँव की ताज़ा खबरें, सरकारी घोषणाएँ और सामुदायिक अपडेट एक ही जगह पर।',
  ab_pillar2_en: 'Village History', ab_pillar2_hi: 'गाँव का इतिहास', ab_pillar2_text: 'Documenting 640+ years of Rithala history, founded in 1384-85 by Rana Rajpal Singh, preserving Tomar Chandravanshi Rajput heritage.', ab_pillar2_texthi: '640+ वर्षों के रिठाला के इतिहास को संरक्षित करना — 1384 में राणा राजपाल सिंह द्वारा बसाया गया।',
  ab_pillar3_en: 'Photos & Memories', ab_pillar3_hi: 'फ़ोटो और यादें', ab_pillar3_text: 'Galleries from Kawad Yatra, Janmashtami, temple events, festivals and everyday village life — old memories preserved digitally.', ab_pillar3_texthi: 'कावड़ यात्रा, जन्माष्टमी, मंदिर उत्सव और रोज़मर्रा की गाँव की ज़िंदगी की यादें डिजिटल रूप में सहेजी गई हैं।',
  ab_pillar4_en: 'Reels & Videos', ab_pillar4_hi: 'रील्स और वीडियो', ab_pillar4_text: 'Bhakti reels, cultural moments, temple darshan and Rajputana pride videos shared through Instagram, YouTube and our website.', ab_pillar4_texthi: 'भक्ति रील्स, सांस्कृतिक पल और राजपूताना गर्व के वीडियो Instagram, YouTube और वेबसाइट पर।',
  ab_pillar5_en: 'Community Connection', ab_pillar5_hi: 'समुदाय जुड़ाव', ab_pillar5_text: 'Connecting Rithala residents around the world through stories, testimonials, festivals and shared cultural identity.', ab_pillar5_texthi: 'दुनिया भर में रिठाला के लोगों को कहानियों, त्योहारों और सांस्कृतिक पहचान से जोड़ना।',
  // Story
  ab_story_h2: 'From Instagram to a Village\'s Digital Home',
  ab_story_p1: 'In today\'s fast-moving digital world, local communities and their stories often get ignored. Rithala Update was created to ensure that the traditions, history, festivals, achievements, and daily life of Rithala Village continue to reach people through modern digital platforms.',
  ab_story_p2: 'What started in 2020 as a small social media initiative on Instagram gradually became one of the growing local digital platforms representing Rithala online. On 17 May 2026 — the official Rithala Update website was launched, connecting the entire Rithala community digitally.',
  ab_story_hi: 'Instagram से शुरू हुई यात्रा आज रिठाला गाँव का पूर्ण डिजिटल घर बन चुकी है।',
  // Timeline
  ab_tl1_year: '2020', ab_tl1_text: 'Rithala Update started on Instagram and social media — sharing village updates, photos and local news', ab_tl1_hi: '2020 में Instagram और social media पर रिठाला अपडेट की शुरुआत हुई',
  ab_tl2_year: '2026', ab_tl2_text: 'Official Rithala Update website launched on 17 May 2026', ab_tl2_hi: '17 मई 2026 को आधिकारिक Rithala Update वेबसाइट लॉन्च हुई',
  ab_tl3_year: '2024', ab_tl3_text: 'Photo archives, Reels and community submissions expanded', ab_tl3_hi: 'फ़ोटो आर्काइव, Reels और सामुदायिक सबमिशन का विस्तार हुआ',
  ab_tl4_year: '2026', ab_tl4_text: 'Full digital platform with AI chatbot, FAQs and Testimonials', ab_tl4_hi: 'AI chatbot, FAQs और Testimonials के साथ पूर्ण डिजिटल प्लेटफ़ॉर्म',
  // Founder
  ab_founder_img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480814023-sandeep-rajput-rithalya-rajput-rithala-delhi.png-1HotTzrfaJxcggidFmo033DNSHDPMu.webp',
  ab_founder_h2: 'Created & Managed by Sandeep Rajput',
  ab_founder_p: 'Popularly known online as Rithalya Rajput, Sandeep is a resident of Rithala Village and an 18-year-old digital creator, website developer and artist. From content creation to event coverage, the entire platform has been independently designed and maintained with dedication and passion.',
  ab_founder_hi: 'संदीप राजपूत — रिठाला गाँव के रहने वाले digital creator, website developer और artist। पूरा platform उन्होंने खुद ही डिज़ाइन और maintain किया है।',
  ab_founder_skills: 'Website Development\nContent Creation\nDigital Branding\nPencil Sketch Art',
  // FAQ
  ab_faq1_q: 'When did Rithala Update start?', ab_faq1_qhi: 'रिठाला अपडेट कब शुरू हुआ?', ab_faq1_a: 'The Rithala Update website was officially launched on 17 May 2026. Before that, updates were shared on Instagram and social media since 2020.', ab_faq1_ahi: 'रिठाला अपडेट वेबसाइट 17 मई 2026 को लॉन्च हुई। इससे पहले 2020 से Instagram पर अपडेट शेयर होती थीं।',
  ab_faq2_q: 'Who created Rithala Update?', ab_faq2_qhi: 'रिठाला अपडेट किसने बनाया?', ab_faq2_a: 'Rithala Update was created and is managed by Sandeep Rajput (Rithalya Rajput) — a digital creator, website developer and artist from Rithala Village, Delhi.', ab_faq2_ahi: 'रिठाला अपडेट को संदीप राजपूत (Rithalya Rajput) ने बनाया — जो रिठाला गाँव के एक digital creator, website developer और artist हैं।',
  ab_faq3_q: 'What is the history of Rithala Village?', ab_faq3_qhi: 'रिठाला गाँव का इतिहास क्या है?', ab_faq3_a: 'Rithala Village was founded in 1384-85 by Rana Rajpal Singh (Tomar Chandravanshi Rajput). Located in North-West Delhi, it is a historic village known for its Rajputana heritage and bravery.', ab_faq3_ahi: 'रिठाला गाँव की स्थापना 1384-85 में राणा राजपाल सिंह (तोमर चंद्रवंशी राजपूत) ने की थी।',
  ab_faq4_q: 'Can I share my photos and stories?', ab_faq4_qhi: 'क्या मैं अपनी फ़ोटो और कहानी शेयर कर सकता हूँ?', ab_faq4_a: 'Yes! You can share your photos, memories and stories with us through the Contact page. We welcome all community contributions to preserve Rithala\'s heritage.', ab_faq4_ahi: 'हाँ! Contact page के ज़रिए आप अपनी फ़ोटो, यादें और कहानियाँ हमारे साथ शेयर कर सकते हैं।',
  // CTA
  ab_cta_h2: 'Be Part of Rithala Update',
  ab_cta_hi: 'रिठाला अपडेट का हिस्सा बनें',
  ab_cta_sub: 'Share your photos, stories, or testimonials — and help us preserve the village for future generations.',
};

const TABS = ['hero', 'mission', 'pillars', 'story', 'founder', 'faqs', 'cta'] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  hero: '🏠 Hero',
  mission: '🎯 Mission',
  pillars: '🏛️ Pillars',
  story: '📖 Story',
  founder: '👤 Founder',
  faqs: '❓ FAQs',
  cta: '📣 CTA',
};

export default function AboutPageManager({ initialSettings }: { initialSettings: Settings }) {
  const [s, setS] = useState<Settings>({ ...DEFAULTS, ...initialSettings });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('hero');

  function set(key: string, val: string) {
    setS(prev => ({ ...prev, [key]: val }));
  }

  async function save() {
    setSaving(true); setMsg(null); setErr(null);
    try {
      const updates = Object.fromEntries(Object.entries(s).filter(([k]) => k.startsWith('ab_')));
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) { setMsg('Saved!'); setTimeout(() => setMsg(null), 3000); }
      else setErr('Failed to save');
    } catch { setErr('Failed to save'); }
    setSaving(false);
  }

  const F = ({ label, k, rows }: { label: string; k: string; rows?: number }) => (
    <div className="adm-field">
      <label>{label}</label>
      {rows ? (
        <textarea rows={rows} value={s[k] || ''} onChange={e => set(k, e.target.value)} />
      ) : (
        <input value={s[k] || ''} onChange={e => set(k, e.target.value)} />
      )}
    </div>
  );

  return (
    <div className="amm-wrap">
      {msg && <div className="adm-alert adm-alert-success"><Icon name="check" size={14} /> {msg}</div>}
      {err && <div className="adm-alert adm-alert-error">{err}</div>}

      <div className="amm-preview-bar">
        <Icon name="eye" size={14} />
        <span>Changes will appear on <strong>/about/</strong> page after saving</span>
        <a href="/about/" target="_blank" className="amm-preview-link">View Page ↗</a>
      </div>

      <div className="amm-tabs">
        {TABS.map(t => (
          <button key={t} className={`amm-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="adm-card amm-card">

        {/* HERO */}
        {tab === 'hero' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Hero Section</h3>
            <div className="adm-grid-form">
              <F label="Label (above heading)" k="ab_hero_label" />
              <F label="Launch Info Line" k="ab_launch_text" />
            </div>
            <F label="Main Heading" k="ab_hero_h1" />
            <F label="Subtitle (English)" k="ab_hero_sub" rows={3} />
            <F label="Subtitle (Hindi)" k="ab_hero_sub_hi" rows={2} />
            <F label="Launch Date Text" k="ab_launch_date" />

            <h3 className="amm-section-title" style={{ marginTop: 24 }}>Stats (4 numbers)</h3>
            {[1,2,3,4].map(i => (
              <div key={i} className="adm-grid-form">
                <F label={`Stat ${i} — Number`} k={`ab_stat${i}_n`} />
                <F label={`Stat ${i} — Label`} k={`ab_stat${i}_l`} />
              </div>
            ))}
          </div>
        )}

        {/* MISSION */}
        {tab === 'mission' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Our Mission</h3>
            <F label="Mission Text (English)" k="ab_mission_en" rows={4} />
            <F label="Mission Text (Hindi)" k="ab_mission_hi" rows={3} />
          </div>
        )}

        {/* PILLARS */}
        {tab === 'pillars' && (
          <div className="amm-section">
            <h3 className="amm-section-title">5 Pillars of Rithala Update</h3>
            <small style={{ color: '#94a3b8' }}>Edit each pillar title and description</small>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="amm-artwork-row" style={{ marginTop: 12 }}>
                <div className="amm-artwork-num">{i}</div>
                <div className="amm-artwork-fields">
                  <div className="adm-grid-form">
                    <F label="Title (English)" k={`ab_pillar${i}_en`} />
                    <F label="Title (Hindi)" k={`ab_pillar${i}_hi`} />
                  </div>
                  <F label="Description (English)" k={`ab_pillar${i}_text`} rows={2} />
                  <F label="Description (Hindi)" k={`ab_pillar${i}_texthi`} rows={2} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STORY */}
        {tab === 'story' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Story Section</h3>
            <F label="Section Heading" k="ab_story_h2" />
            <F label="Paragraph 1 (English)" k="ab_story_p1" rows={4} />
            <F label="Paragraph 2 (English)" k="ab_story_p2" rows={4} />
            <F label="Hindi Summary Line" k="ab_story_hi" rows={2} />

            <h3 className="amm-section-title" style={{ marginTop: 24 }}>Timeline (4 entries)</h3>
            {[1,2,3,4].map(i => (
              <div key={i} className="amm-artwork-row" style={{ marginTop: 12 }}>
                <div className="amm-artwork-num">{i}</div>
                <div className="amm-artwork-fields">
                  <div className="adm-grid-form">
                    <F label="Year" k={`ab_tl${i}_year`} />
                    <F label="Text (English)" k={`ab_tl${i}_text`} />
                  </div>
                  <F label="Text (Hindi)" k={`ab_tl${i}_hi`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOUNDER */}
        {tab === 'founder' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Founder Section</h3>
            <F label="Section Heading" k="ab_founder_h2" />
            <div className="adm-field">
              <label>Founder Photo URL</label>
              <input value={s.ab_founder_img || ''} onChange={e => set('ab_founder_img', e.target.value)} />
              {s.ab_founder_img && <img src={s.ab_founder_img} alt="" className="amm-img-preview" />}
            </div>
            <F label="Paragraph (English)" k="ab_founder_p" rows={4} />
            <F label="Paragraph (Hindi)" k="ab_founder_hi" rows={3} />
            <div className="adm-field">
              <label>Skills (one per line)</label>
              <textarea rows={5} value={s.ab_founder_skills || ''} onChange={e => set('ab_founder_skills', e.target.value)} />
            </div>
          </div>
        )}

        {/* FAQS */}
        {tab === 'faqs' && (
          <div className="amm-section">
            <h3 className="amm-section-title">FAQs (4 questions)</h3>
            {[1,2,3,4].map(i => (
              <div key={i} className="amm-artwork-row" style={{ marginTop: 12 }}>
                <div className="amm-artwork-num">{i}</div>
                <div className="amm-artwork-fields">
                  <div className="adm-grid-form">
                    <F label="Question (English)" k={`ab_faq${i}_q`} />
                    <F label="Question (Hindi)" k={`ab_faq${i}_qhi`} />
                  </div>
                  <F label="Answer (English)" k={`ab_faq${i}_a`} rows={3} />
                  <F label="Answer (Hindi)" k={`ab_faq${i}_ahi`} rows={3} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {tab === 'cta' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Call to Action Section</h3>
            <F label="Heading" k="ab_cta_h2" />
            <F label="Hindi Subheading" k="ab_cta_hi" />
            <F label="Description" k="ab_cta_sub" rows={3} />
          </div>
        )}

      </div>

      <div className="amm-save-bar">
        <button className="adm-btn-primary" onClick={save} disabled={saving} style={{ minWidth: 140 }}>
          <Icon name={saving ? 'clock' : 'check'} size={14} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Changes go live immediately after saving</span>
      </div>
    </div>
  );
}
