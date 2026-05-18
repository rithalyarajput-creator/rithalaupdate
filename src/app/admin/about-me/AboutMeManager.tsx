'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Settings = Record<string, string>;

const ARTWORK_KEYS = ['am_art_1', 'am_art_2', 'am_art_3', 'am_art_4', 'am_art_5'];

const DEFAULTS: Settings = {
  am_name: 'Sandeep Rajput',
  am_alias: 'Rithalya Rajput',
  am_age: '18-year-old',
  am_location: 'Rithala Village, Delhi',
  am_bio: 'Hello and welcome! I am an 18-year-old digital creator, website developer, artist and social media designer from Rithala Village, Delhi. I am the creator and founder of Rithala Update — a digital platform dedicated to sharing the culture, history, news, events and community updates of Rithala Village with the world.',
  am_portrait: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480814023-sandeep-rajput-rithalya-rajput-rithala-delhi.png-1HotTzrfaJxcggidFmo033DNSHDPMu.webp',
  am_portrait2: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480815703-sandeep-rajput-rithala-village-2-xymbfyECPUpkDzS95iO3FwDK5vkUim.png',
  am_skills: 'Website Development\nSocial Media Management\nCreative Designing\nDigital Branding & Promotions\nDrawing & Pencil Sketch Art\nCommunity-Based Digital Projects',
  am_instagram: 'https://www.instagram.com/rithalya_rajput/',
  am_facebook: 'https://www.facebook.com/rithalya.rajput',
  am_youtube: 'https://www.youtube.com/@RithalaUpdate',
  am_linkedin: 'https://in.linkedin.com/in/sandeep-rajput-sumal',
  am_story_journey: 'Since childhood, I have always been passionate about creativity, technology, and doing something unique. Whether it was drawing, designing, or creating digital content, I always believed in giving my full dedication to everything I create. My creative journey started during my school days when I developed a strong interest in art and pencil sketching. Over time, that creativity slowly transformed into digital designing, social media content creation, and website development.',
  am_story_education: 'I completed my schooling from Rana Pratap Government Boys Senior Secondary School, Rithala, New Delhi. Throughout my school life, I studied in different schools, met many people, and learned valuable life lessons that helped shape my confidence, mindset, and creativity. During the lockdown period, I spent a lot of time improving my artistic and creative skills through drawing and design work.',
  am_story_idea: 'The idea behind creating Rithala Update came from a simple vision — to give Rithala Village a strong digital identity and create one platform where people can stay connected with their culture, community, and local updates. Before launching the website, I started by posting updates, photographs, and local content on Instagram and social media platforms.',
  am_story_what: 'Apart from managing Rithala Update, I also work on website development, social media handling, digital promotions, and creative designing. I independently designed and developed this website myself while also managing Instagram pages, YouTube content, and digital branding projects.',
  am_closing: 'Thank you for visiting and being a part of this journey.',
  am_art_1_img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480852254-rajputs-warrior-art-by-sandeep-rajput-1-EcVAvTjm85N2w0aQvMnINf1q6UJHDc.png',
  am_art_1_title: 'Maharana Pratap',
  am_art_1_sub: 'Legendary Rajput Warrior | Sketch by Sandeep Rajput',
  am_art_2_img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480850386-little-krishna-art-by-sandeep-rajput-My42d3DBHBriELEJVA1mOHJJo1keeD.png',
  am_art_2_title: 'Little Krishna',
  am_art_2_sub: 'Pencil Drawing by Sandeep Rajput',
  am_art_3_img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480848621-karan-aujla-art-by-sandeep-rajput-lBjClfy7IXQpR7wTAV6B57kMszDu6w.png',
  am_art_3_title: 'Karan Aujla',
  am_art_3_sub: 'Punjabi Singer Sketch by Sandeep Rajput',
  am_art_4_img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480846991-little-ram-art-by-sandeep-rajput-CfC5gcy4UkzhNKrzWUXgaWxdUDXvuC.png',
  am_art_4_title: 'Little Ram',
  am_art_4_sub: 'Pencil Art by Sandeep Rajput',
  am_art_5_img: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778480845194-virat-kholi-art-by-sandeep-rajput-yfvTxR9dqTw0jHTXu8nBNxAQBhWGTN.png',
  am_art_5_title: 'Virat Kohli',
  am_art_5_sub: 'Pencil Portrait by Sandeep Rajput',
};

type CustomSection = { id: string; heading: string; content: string; layout: 'text-only' | 'img-left' | 'img-right'; image?: string };

function parseSections(raw: string): CustomSection[] {
  try { return JSON.parse(raw) || []; } catch { return []; }
}

export default function AboutMeManager({ initialSettings }: { initialSettings: Settings }) {
  const [s, setS] = useState<Settings>({ ...DEFAULTS, ...initialSettings });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'story' | 'artworks' | 'sections'>('profile');
  const [sections, setSections] = useState<CustomSection[]>(() =>
    parseSections(initialSettings.am_custom_sections || DEFAULTS.am_custom_sections || '[]')
  );

  function set(key: string, val: string) {
    setS(prev => ({ ...prev, [key]: val }));
  }

  function addSection() {
    setSections(prev => [...prev, { id: Date.now().toString(), heading: '', content: '', layout: 'text-only', image: '' }]);
  }
  function updateSection(id: string, field: keyof CustomSection, val: string) {
    setSections(prev => prev.map(sec => sec.id === id ? { ...sec, [field]: val } : sec));
  }
  function deleteSection(id: string) {
    setSections(prev => prev.filter(sec => sec.id !== id));
  }
  function moveSection(id: string, dir: -1 | 1) {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  async function save() {
    setSaving(true); setMsg(null); setErr(null);
    try {
      const updates = {
        ...Object.fromEntries(Object.entries(s).filter(([k]) => k.startsWith('am_'))),
        am_custom_sections: JSON.stringify(sections),
      };
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
        {(['profile', 'story', 'artworks', 'sections'] as const).map(tab => (
          <button
            key={tab}
            className={`amm-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'profile' ? '👤 Profile' : tab === 'story' ? '📝 Story & Bio' : tab === 'artworks' ? '🎨 Art Gallery' : '➕ Custom Sections'}
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
              <div className="adm-field">
                <label>Facebook URL</label>
                <input value={s.am_facebook || ''} onChange={e => set('am_facebook', e.target.value)} placeholder="https://facebook.com/..." />
              </div>
              <div className="adm-field">
                <label>LinkedIn URL</label>
                <input value={s.am_linkedin || ''} onChange={e => set('am_linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
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

        {/* CUSTOM SECTIONS TAB */}
        {activeTab === 'sections' && (
          <div className="amm-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="amm-section-title">Custom Sections</h3>
                <small style={{ color: '#94a3b8' }}>Add extra sections like "My Achievements", "Awards", "Future Plans" etc.</small>
              </div>
              <button className="adm-btn-primary" onClick={addSection} style={{ flexShrink: 0 }}>
                <Icon name="plus" size={14} /> Add Section
              </button>
            </div>

            {sections.length === 0 && (
              <div className="adm-empty" style={{ padding: '30px 0' }}>
                <Icon name="plus" size={32} />
                <h3>No custom sections yet</h3>
                <p>Click "Add Section" to create a new section on your About Me page.</p>
              </div>
            )}

            {sections.map((sec, idx) => (
              <div key={sec.id} className="amm-csec-row">
                <div className="amm-csec-top">
                  <span className="amm-csec-num">Section {idx + 1}</span>
                  <div className="amm-csec-actions">
                    <button onClick={() => moveSection(sec.id, -1)} disabled={idx === 0} className="amm-csec-btn" title="Move up">↑</button>
                    <button onClick={() => moveSection(sec.id, 1)} disabled={idx === sections.length - 1} className="amm-csec-btn" title="Move down">↓</button>
                    <button onClick={() => deleteSection(sec.id)} className="amm-csec-btn amm-csec-del" title="Delete">
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                </div>

                {/* Layout picker */}
                <div className="adm-field">
                  <label>Layout Template</label>
                  <div className="amm-layout-row">
                    {([
                      { val: 'text-only', label: 'Text Only' },
                      { val: 'img-left', label: 'Image Left' },
                      { val: 'img-right', label: 'Image Right' },
                    ] as { val: CustomSection['layout']; label: string }[]).map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        className={`amm-layout-opt${sec.layout === opt.val ? ' selected' : ''}`}
                        onClick={() => updateSection(sec.id, 'layout', opt.val)}
                      >
                        <div className="amm-layout-preview">
                          {opt.val === 'text-only' ? (
                            <div className="amm-lp-text">
                              <div className="amm-lp-line" style={{ width: '90%' }} />
                              <div className="amm-lp-line" style={{ width: '70%' }} />
                              <div className="amm-lp-line" style={{ width: '80%' }} />
                            </div>
                          ) : opt.val === 'img-left' ? (
                            <>
                              <div className="amm-lp-img" />
                              <div className="amm-lp-text">
                                <div className="amm-lp-line" style={{ width: '90%' }} />
                                <div className="amm-lp-line" style={{ width: '70%' }} />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="amm-lp-text">
                                <div className="amm-lp-line" style={{ width: '90%' }} />
                                <div className="amm-lp-line" style={{ width: '70%' }} />
                              </div>
                              <div className="amm-lp-img" />
                            </>
                          )}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image URL — only for split layouts */}
                {sec.layout !== 'text-only' && (
                  <div className="adm-field">
                    <label>Image URL</label>
                    <input
                      value={sec.image || ''}
                      onChange={e => updateSection(sec.id, 'image', e.target.value)}
                      placeholder="https://... (paste image URL from Media Library)"
                    />
                    {sec.image && <img src={sec.image} alt="" className="amm-img-preview" style={{ width: 160, height: 100, objectFit: 'cover' }} />}
                  </div>
                )}

                <div className="adm-field">
                  <label>Section Heading</label>
                  <input
                    value={sec.heading}
                    onChange={e => updateSection(sec.id, 'heading', e.target.value)}
                    placeholder="e.g. My Achievements, Awards, Future Plans..."
                  />
                </div>
                <div className="adm-field">
                  <label>Content</label>
                  <textarea
                    rows={5}
                    value={sec.content}
                    onChange={e => updateSection(sec.id, 'content', e.target.value)}
                    placeholder="Write the content for this section..."
                  />
                </div>
              </div>
            ))}
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
