'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  // Hero
  hp_hero_badge: 'Jai Rajputana',
  hp_hero_h1_hi: 'रिठाला गाँव',
  hp_hero_h1_en: 'Rithala Village',
  hp_hero_desc_en: 'Rithala Village is an ancient and historical village in North-West Delhi, famous for its Rajputana heritage, bravery, and cultural pride. For centuries, this village has been a symbol of traditions, brotherhood, and community unity.',
  hp_hero_desc_hi: 'रिठाला गाँव दिल्ली के उत्तर-पश्चिम क्षेत्र में स्थित एक प्राचीन और ऐतिहासिक गाँव है, जो अपनी राजपूताना विरासत, वीरता और सांस्कृतिक गौरव के लिए प्रसिद्ध है।',
  hp_hero_img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778400974678-_______________________________Rithala_village-chtINXfbEiTju5dah7wgUclR3aSe5k.png',
  // Hero highlights (4 bullet points)
  hp_hi1_en: 'Symbol of centuries-old traditions', hp_hi1_hi: 'सदियों पुरानी परंपराओं का प्रतीक',
  hp_hi2_en: 'Glorious stories of Rajput bravery', hp_hi2_hi: 'राजपूत वीरता की गौरवशाली कहानियाँ',
  hp_hi3_en: 'Cultural heritage and historical sites', hp_hi3_hi: 'सांस्कृतिक धरोहर और ऐतिहासिक स्थल',
  hp_hi4_en: 'Brotherhood and social unity', hp_hi4_hi: 'भाईचारे और सामाजिक एकता',
  // Rajputana section
  hp_rj_p1: 'राजपूताना भारत का एक ऐतिहासिक क्षेत्र है, जिसका अर्थ है "राजपूतों की भूमि"। यह नाम दो शब्दों से बना है — राजा + पुत्र यानी "राजपूत", जो शाही वंश के योद्धा होते थे। राजपूताना में वर्तमान राजस्थान राज्य और उसके आसपास के कुछ हिस्से जैसे हरियाणा, गुजरात और मध्यप्रदेश शामिल थे।',
  hp_rj_p2: 'अंग्रेज़ी शासनकाल में इसे "राजपूताना एजेंसी" कहा जाता था, जिसमें 18 बड़ी और 20 छोटी रियासतें थीं — जैसे मेवाड़, मारवाड़, जयपुर, जोधपुर, बीकानेर, बूंदी और कोटा। यह क्षेत्र अपनी वीरता, शौर्य और संस्कृति के लिए प्रसिद्ध था।',
  hp_rj_p3: 'यहाँ के राजपूत शासकों ने अपने सम्मान, स्वाभिमान और मातृभूमि की रक्षा के लिए अनेक युद्ध लड़े, जिनमें हल्दीघाटी, खानवा और तारागढ़ के युद्ध विशेष रूप से प्रसिद्ध हैं।',
  hp_rj_logo: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401455542-rajputana-heritage-logo-rithala-village.png-JQ1YTLV0RDx0tAyMYICdirpX1RGJa7.png',
  hp_rj_map: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401194056-rajputana-historical-map-rithala-village-rajput-heritage.jpg-EEgVFCLGU390rpOSFvELkE66HIiHge.jpg',
  hp_rj_caption: 'Imperial Gazetteer of India — Rajputana Agency Map',
};

type Tab = 'hero' | 'rajputana';

export default function HomePageManager({ initialSettings }: { initialSettings: Settings }) {
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
      const updates = Object.fromEntries(Object.entries(s).filter(([k]) => k.startsWith('hp_')));
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
        <span>Changes will appear on the <strong>Home Page</strong> after saving</span>
        <a href="/" target="_blank" className="amm-preview-link">View Page ↗</a>
      </div>

      <div className="amm-tabs">
        {(['hero', 'rajputana'] as Tab[]).map(t => (
          <button key={t} className={`amm-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'hero' ? '🏠 Hero Section' : '⚔️ Rajputana Section'}
          </button>
        ))}
      </div>

      <div className="adm-card amm-card">

        {tab === 'hero' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Hero Section</h3>

            <div className="adm-field">
              <label>Hero Image URL</label>
              <input value={s.hp_hero_img || ''} onChange={e => set('hp_hero_img', e.target.value)} />
              {s.hp_hero_img && <img src={s.hp_hero_img} alt="" className="amm-img-preview" style={{ width: 200, height: 120, objectFit: 'cover' }} />}
            </div>

            <F label="Badge Text (e.g. Jai Rajputana)" k="hp_hero_badge" />

            <div className="adm-grid-form">
              <F label="Main Heading (Hindi)" k="hp_hero_h1_hi" />
              <F label="Main Heading (English)" k="hp_hero_h1_en" />
            </div>

            <F label="Description (English)" k="hp_hero_desc_en" rows={3} />
            <F label="Description (Hindi)" k="hp_hero_desc_hi" rows={3} />

            <h3 className="amm-section-title" style={{ marginTop: 24 }}>4 Highlight Points</h3>
            {[1,2,3,4].map(i => (
              <div key={i} className="adm-grid-form">
                <F label={`Point ${i} (Hindi)`} k={`hp_hi${i}_hi`} />
                <F label={`Point ${i} (English)`} k={`hp_hi${i}_en`} />
              </div>
            ))}
          </div>
        )}

        {tab === 'rajputana' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Rajputana Heritage Section</h3>

            <div className="adm-field">
              <label>Logo Image URL</label>
              <input value={s.hp_rj_logo || ''} onChange={e => set('hp_rj_logo', e.target.value)} />
              {s.hp_rj_logo && <img src={s.hp_rj_logo} alt="" className="amm-img-preview" />}
            </div>
            <div className="adm-field">
              <label>Historical Map Image URL</label>
              <input value={s.hp_rj_map || ''} onChange={e => set('hp_rj_map', e.target.value)} />
              {s.hp_rj_map && <img src={s.hp_rj_map} alt="" className="amm-img-preview" style={{ width: 200, height: 130, objectFit: 'cover' }} />}
            </div>
            <F label="Map Caption" k="hp_rj_caption" />

            <F label="Paragraph 1 (Hindi)" k="hp_rj_p1" rows={4} />
            <F label="Paragraph 2 (Hindi)" k="hp_rj_p2" rows={4} />
            <F label="Paragraph 3 (Hindi)" k="hp_rj_p3" rows={4} />
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
