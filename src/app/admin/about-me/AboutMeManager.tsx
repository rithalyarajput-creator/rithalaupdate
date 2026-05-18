'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Settings = Record<string, string>;

const ARTWORK_KEYS = ['am_art_1', 'am_art_2', 'am_art_3', 'am_art_4', 'am_art_5'];

export default function AboutMeManager({ initialSettings }: { initialSettings: Settings }) {
  const [s, setS] = useState<Settings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'story' | 'artworks'>('profile');

  function set(key: string, val: string) {
    setS(prev => ({ ...prev, [key]: val }));
  }

  async function save() {
    setSaving(true); setMsg(null); setErr(null);
    try {
      const updates = Object.fromEntries(Object.entries(s).filter(([k]) => k.startsWith('am_')));
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setMsg('Saved successfully!');
        setTimeout(() => setMsg(null), 3000);
      } else {
        setErr('Failed to save');
      }
    } catch {
      setErr('Failed to save');
    }
    setSaving(false);
  }

  return (
    <div className="amm-wrap">
      {msg && <div className="adm-alert adm-alert-success" style={{ marginBottom: 16 }}><Icon name="check" size={14} /> {msg}</div>}
      {err && <div className="adm-alert adm-alert-error" style={{ marginBottom: 16 }}>{err}</div>}

      {/* Live preview banner */}
      <div className="amm-preview-bar">
        <Icon name="eye" size={14} />
        <span>Changes will appear on <strong>/sandeep-rajput/</strong> page after saving</span>
        <a href="/sandeep-rajput/" target="_blank" className="amm-preview-link">View Page ↗</a>
      </div>

      {/* Tabs */}
      <div className="amm-tabs">
        {(['profile', 'story', 'artworks'] as const).map(tab => (
          <button
            key={tab}
            className={`amm-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'profile' ? '👤 Profile' : tab === 'story' ? '📝 Story & Bio' : '🎨 Art Gallery'}
          </button>
        ))}
      </div>

      <div className="adm-card amm-card">
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Basic Profile Info</h3>

            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Full Name</label>
                <input value={s.am_name || 'Sandeep Rajput'} onChange={e => set('am_name', e.target.value)} placeholder="Sandeep Rajput" />
              </div>
              <div className="adm-field">
                <label>Also Known As (Alias)</label>
                <input value={s.am_alias || 'Rithalya Rajput'} onChange={e => set('am_alias', e.target.value)} placeholder="Rithalya Rajput" />
              </div>
            </div>

            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Age / Description</label>
                <input value={s.am_age || '18-year-old'} onChange={e => set('am_age', e.target.value)} placeholder="e.g. 18-year-old" />
              </div>
              <div className="adm-field">
                <label>Location</label>
                <input value={s.am_location || 'Rithala Village, Delhi'} onChange={e => set('am_location', e.target.value)} placeholder="Rithala Village, Delhi" />
              </div>
            </div>

            <div className="adm-field">
              <label>Short Bio / Intro (shown in hero section)</label>
              <textarea rows={4} value={s.am_bio || ''} onChange={e => set('am_bio', e.target.value)}
                placeholder="Hello and welcome! I am an 18-year-old digital creator..." />
            </div>

            <h3 className="amm-section-title" style={{ marginTop: 24 }}>Profile Photos</h3>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Main Portrait Photo URL</label>
                <input value={s.am_portrait || ''} onChange={e => set('am_portrait', e.target.value)} placeholder="https://..." />
                {(s.am_portrait) && <img src={s.am_portrait} alt="" className="amm-img-preview" />}
              </div>
              <div className="adm-field">
                <label>Second Photo URL</label>
                <input value={s.am_portrait2 || ''} onChange={e => set('am_portrait2', e.target.value)} placeholder="https://..." />
                {(s.am_portrait2) && <img src={s.am_portrait2} alt="" className="amm-img-preview" />}
              </div>
            </div>

            <h3 className="amm-section-title" style={{ marginTop: 24 }}>Skills / Passions</h3>
            <small style={{ color: '#94a3b8' }}>One per line — shown as bullet points</small>
            <textarea
              rows={6}
              value={s.am_skills || 'Website Development\nSocial Media Management\nCreative Designing\nDigital Branding & Promotions\nDrawing & Pencil Sketch Art\nCommunity-Based Digital Projects'}
              onChange={e => set('am_skills', e.target.value)}
              placeholder="Website Development&#10;Social Media Management&#10;..."
              style={{ marginTop: 8 }}
            />

            <h3 className="amm-section-title" style={{ marginTop: 24 }}>Social Links</h3>
            <div className="adm-grid-form">
              <div className="adm-field">
                <label>Instagram URL</label>
                <input value={s.am_instagram || ''} onChange={e => set('am_instagram', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
              <div className="adm-field">
                <label>YouTube URL</label>
                <input value={s.am_youtube || ''} onChange={e => set('am_youtube', e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>
        )}

        {/* STORY TAB */}
        {activeTab === 'story' && (
          <div className="amm-section">
            <h3 className="amm-section-title">My Story Sections</h3>
            <small style={{ color: '#94a3b8' }}>These paragraphs appear in the story section of the About Me page</small>

            <div className="adm-field" style={{ marginTop: 16 }}>
              <label>Creative Journey (paragraph)</label>
              <textarea rows={5} value={s.am_story_journey || ''} onChange={e => set('am_story_journey', e.target.value)}
                placeholder="Since childhood, I have always been passionate about creativity..." />
            </div>

            <div className="adm-field">
              <label>Education (paragraph)</label>
              <textarea rows={5} value={s.am_story_education || ''} onChange={e => set('am_story_education', e.target.value)}
                placeholder="I completed my schooling from Rana Pratap Government Boys..." />
            </div>

            <div className="adm-field">
              <label>The Idea Behind Rithala Update (paragraph)</label>
              <textarea rows={5} value={s.am_story_idea || ''} onChange={e => set('am_story_idea', e.target.value)}
                placeholder="The idea behind creating Rithala Update came from a simple vision..." />
            </div>

            <div className="adm-field">
              <label>What I Do (paragraph)</label>
              <textarea rows={5} value={s.am_story_what || ''} onChange={e => set('am_story_what', e.target.value)}
                placeholder="Apart from managing Rithala Update, I also work on..." />
            </div>

            <div className="adm-field">
              <label>Closing Message</label>
              <textarea rows={3} value={s.am_closing || 'Thank you for visiting and being a part of this journey.'} onChange={e => set('am_closing', e.target.value)} />
            </div>
          </div>
        )}

        {/* ARTWORKS TAB */}
        {activeTab === 'artworks' && (
          <div className="amm-section">
            <h3 className="amm-section-title">Art Gallery (up to 5 artworks)</h3>
            <small style={{ color: '#94a3b8' }}>Add images of your artwork — these appear in the horizontal gallery scroll</small>

            {ARTWORK_KEYS.map((key, i) => {
              const img = s[`${key}_img`] || '';
              const title = s[`${key}_title`] || '';
              const sub = s[`${key}_sub`] || '';
              return (
                <div key={key} className="amm-artwork-row">
                  <div className="amm-artwork-num">{i + 1}</div>
                  <div className="amm-artwork-fields">
                    <div className="adm-field">
                      <label>Image URL</label>
                      <input value={img} onChange={e => set(`${key}_img`, e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="adm-grid-form">
                      <div className="adm-field">
                        <label>Title</label>
                        <input value={title} onChange={e => set(`${key}_title`, e.target.value)} placeholder="e.g. Maharana Pratap" />
                      </div>
                      <div className="adm-field">
                        <label>Subtitle</label>
                        <input value={sub} onChange={e => set(`${key}_sub`, e.target.value)} placeholder="e.g. Pencil Sketch by Sandeep Rajput" />
                      </div>
                    </div>
                    {img && <img src={img} alt="" className="amm-img-preview" />}
                  </div>
                </div>
              );
            })}
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
