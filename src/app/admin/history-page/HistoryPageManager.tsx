'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Settings = Record<string, string>;

const CHAPTER_DEFAULTS = [
  { title: 'रिठाला गाँव का इतिहास', era: '1384–85 ईस्वी', pull: 'गाँव की नींव राणा राजपाल सिंह ने रखी थी।', body: 'रिठाला गाँव दिल्ली के प्राचीन और ऐतिहासिक गाँवों में से एक है, जो अपनी राजपूताना विरासत, वीरता और सांस्कृतिक गौरव के लिए प्रसिद्ध है। रिठाला गाँव की स्थापना 1384–85 ईस्वी में हुई थी, जब दिल्ली पर सुल्तान फिरोज शाह तुगलक का शासन था। इस गाँव की नींव राणा राजपाल सिंह (Rana Rajpal Singh) ने रखी थी, जो तोमर चंद्रवंशी राजपूत वंश के साहसी योद्धा थे।' },
  { title: 'लाठी वाला: रिठाला की वीर गाथा', era: 'प्राचीन काल', pull: 'यहाँ की सुरक्षा क़िले नहीं, योद्धाओं की बहादुरी पर थी।', body: 'रिठाला गाँव का प्राचीन नाम "लाठी वाला" था। इस नाम का कारण गाँव के निवासियों की योद्धा परंपरा और शस्त्र-कौशल था। यहाँ के लोग लाठी, भाला, तलवार और पारंपरिक हथियारों के प्रयोग में निपुण थे।' },
  { title: 'राणा राजपाल सिंह और पूठ कलां', era: '1048–49 ईस्वी', pull: 'पूठ कलां से रिठाला तक की रणनीतिक यात्रा।', body: 'राणा राजपाल सिंह के पूर्वज प्रारम्भ में पूठ कलां गाँव में रहते थे, जिसकी स्थापना लगभग 1048–49 ईस्वी में हुई थी। यह इलाका उस समय तोमर राजपूत वंश के नियंत्रण में था।' },
  { title: 'राजपूताना वीरता और संघर्ष', era: 'सदियों से', pull: 'लाठी, तलवार और धनुष-बाण से रक्षा की परंपरा।', body: 'रिठाला गाँव की पहचान हमेशा से राजपूताना वीरता और संघर्ष की परंपरा से रही है। गाँव के निवासी तोमर चंद्रवंशी राजपूत थे, जो न केवल अपनी कृषि भूमि की रक्षा करते थे, बल्कि आसपास के क्षेत्र में सुरक्षा और शौर्य का प्रतीक भी थे।' },
  { title: 'सामाजिक और सांस्कृतिक परंपराएँ', era: 'परंपरा', pull: 'भाईचारा इस गाँव की सबसे बड़ी ताकत।', body: 'रिठाला गाँव न केवल अपनी वीरता के लिए, बल्कि अपनी सांस्कृतिक एकता और परंपराओं के लिए भी जाना जाता है। त्यौहार, धार्मिक आयोजन, मेलों और पारंपरिक रस्मों को यहाँ पीढ़ी-दर-पीढ़ी पूरी श्रद्धा और उत्साह के साथ निभाया जाता है।' },
  { title: 'वर्तमान में ऐतिहासिक पहचान', era: 'आज', pull: 'शहर में बदला, पहचान बरकरार।', body: 'आज भले ही रिठाला गाँव शहरीकरण और आधुनिकता की ओर बढ़ चुका है, लेकिन इसका ऐतिहासिक और सांस्कृतिक गौरव आज भी जीवित है। बुज़ुर्ग और इतिहास प्रेमी आज भी नई पीढ़ी को पूर्वजों की वीरता और संघर्ष की कहानियाँ सुनाते हैं।' },
];

const DEFAULTS: Settings = {
  rvh_hero_badge: 'Heritage Story · Est. 1384',
  rvh_hero_sub: 'The 640-year journey of a Tomar Rajput village — from पूठ कलां roots to modern Delhi.',
  rvh_stat1_n: '1384', rvh_stat1_l: 'ईस्वी में स्थापना',
  rvh_stat2_n: '640+', rvh_stat2_l: 'Years of legacy',
  rvh_stat3_n: '1048–49', rvh_stat3_l: 'पूठ कलां स्थापना',
  rvh_stat4_n: '6', rvh_stat4_l: 'गौरवशाली अध्याय',
  rvh_big_quote: 'जहाँ राजपूत की तलवार उठती है, वहाँ इतिहास लिखा जाता है।',
  rvh_cta_h: 'क्या आपके पास कोई पुरानी कहानी है?',
  rvh_cta_p: 'अगर आपके पास रिठाला गाँव से जुड़ी कोई पुरानी कहानी, तस्वीर या जानकारी है, तो हमारे साथ ज़रूर साझा करें।',
};

// Add chapter defaults
for (let i = 0; i < 6; i++) {
  const d = CHAPTER_DEFAULTS[i];
  DEFAULTS[`rvh_ch${i+1}_title`] = d.title;
  DEFAULTS[`rvh_ch${i+1}_era`] = d.era;
  DEFAULTS[`rvh_ch${i+1}_pull`] = d.pull;
  DEFAULTS[`rvh_ch${i+1}_body`] = d.body;
}

type Tab = 'hero' | 'chapters' | 'cta';

export default function HistoryPageManager({ initialSettings }: { initialSettings: Settings }) {
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
      const updates = Object.fromEntries(Object.entries(s).filter(([k]) => k.startsWith('rvh_')));
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
        <span>Changes will appear on <strong>/rithala-village-history/</strong> after saving</span>
        <a href="/rithala-village-history/" target="_blank" className="amm-preview-link">View Page ↗</a>
      </div>

      <div className="amm-tabs">
        {(['hero', 'chapters', 'cta'] as Tab[]).map(t => (
          <button key={t} className={`amm-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'hero' ? '🏛️ Hero & Stats' : t === 'chapters' ? '📜 6 Chapters' : '📣 CTA Section'}
          </button>
        ))}
      </div>

      <div className="adm-card amm-card">

        {tab === 'hero' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Hero Section</h3>
            <F label="Badge Text" k="rvh_hero_badge" />
            <F label="Subtitle" k="rvh_hero_sub" rows={2} />
            <F label="Big Quote (shown in middle of page)" k="rvh_big_quote" rows={2} />

            <h3 className="amm-section-title" style={{ marginTop: 24 }}>Stats (4 numbers)</h3>
            {[1,2,3,4].map(i => (
              <div key={i} className="adm-grid-form">
                <F label={`Stat ${i} — Number`} k={`rvh_stat${i}_n`} />
                <F label={`Stat ${i} — Label`} k={`rvh_stat${i}_l`} />
              </div>
            ))}
          </div>
        )}

        {tab === 'chapters' && (
          <div className="amm-section">
            <h3 className="amm-section-title">6 History Chapters</h3>
            <small style={{ color: '#94a3b8' }}>Edit each chapter title, era, pull quote and full body text</small>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="amm-artwork-row" style={{ marginTop: 16 }}>
                <div className="amm-artwork-num">{i}</div>
                <div className="amm-artwork-fields">
                  <div className="adm-grid-form">
                    <F label="Chapter Title" k={`rvh_ch${i}_title`} />
                    <F label="Era / Time Period" k={`rvh_ch${i}_era`} />
                  </div>
                  <F label="Pull Quote (highlighted quote)" k={`rvh_ch${i}_pull`} />
                  <F label="Full Body Text" k={`rvh_ch${i}_body`} rows={5} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'cta' && (
          <div className="amm-section">
            <h3 className="amm-section-title">CTA Section (bottom of page)</h3>
            <F label="Heading" k="rvh_cta_h" />
            <F label="Description" k="rvh_cta_p" rows={3} />
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
