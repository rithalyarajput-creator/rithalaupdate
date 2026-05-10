'use client';

import { useState, useRef } from 'react';

type MenuItem = { label: string; url: string };

export default function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'header' | 'footer' | 'contact' | 'seo' | 'social'>('general');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: string, value: string) {
    setSettings({ ...settings, [key]: value });
  }

  function parseMenu(json: string): MenuItem[] {
    try {
      const arr = JSON.parse(json);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function setMenu(key: string, items: MenuItem[]) {
    set(key, JSON.stringify(items));
  }

  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading…');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      set('site_logo_url', j.url);
      setMsg('✓ Logo uploaded');
      setTimeout(() => setMsg(null), 2000);
    }
  }

  async function handleSave() {
    setSaving(true);
    setErr(null);
    setMsg(null);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setMsg('✓ Settings saved. Live in a few seconds.');
      setTimeout(() => setMsg(null), 3000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Save failed');
    }
    setSaving(false);
  }

  const headerMenu = parseMenu(settings.header_menu_json || '[]');
  const footerMenu = parseMenu(settings.footer_menu_json || '[]');

  function MenuEditor({ menuKey, items }: { menuKey: string; items: MenuItem[] }) {
    return (
      <div>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={item.label}
              placeholder="Label"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], label: e.target.value };
                setMenu(menuKey, next);
              }}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              value={item.url}
              placeholder="URL (e.g. /about/)"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], url: e.target.value };
                setMenu(menuKey, next);
              }}
              style={{ flex: 2 }}
            />
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              disabled={i === 0}
              onClick={() => {
                const next = [...items];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                setMenu(menuKey, next);
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              disabled={i === items.length - 1}
              onClick={() => {
                const next = [...items];
                [next[i], next[i + 1]] = [next[i + 1], next[i]];
                setMenu(menuKey, next);
              }}
            >
              ↓
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => setMenu(menuKey, items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setMenu(menuKey, [...items, { label: 'New Link', url: '/' }])}
        >
          + Add Menu Item
        </button>
      </div>
    );
  }

  return (
    <div>
      {err && <div className="form-error">{err}</div>}
      {msg && <div className="form-success">{msg}</div>}

      <div className="admin-card">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, borderBottom: '1px solid #ddd', paddingBottom: 12 }}>
          {[
            ['general', '🏠 General'],
            ['header', '📐 Header Menu'],
            ['footer', '📋 Footer'],
            ['contact', '📞 Contact'],
            ['social', '📱 Social Links'],
            ['seo', '🔍 SEO Defaults'],
          ].map(([k, label]) => (
            <button
              key={k}
              className={`btn btn-sm ${activeTab === k ? '' : 'btn-secondary'}`}
              onClick={() => setActiveTab(k as any)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
          <div>
            <h3 style={{ marginTop: 0 }}>General Settings</h3>
            <div className="form-row">
              <label>Site Title</label>
              <input
                type="text"
                value={settings.site_title || ''}
                onChange={(e) => set('site_title', e.target.value)}
                placeholder="Rithala Update"
              />
            </div>
            <div className="form-row">
              <label>Site Description (tagline)</label>
              <textarea
                value={settings.site_description || ''}
                onChange={(e) => set('site_description', e.target.value)}
                rows={2}
                style={{ minHeight: 60, fontFamily: 'inherit' }}
              />
            </div>
            <div className="form-row">
              <label>Logo</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {settings.site_logo_url && (
                  <img src={settings.site_logo_url} alt="Logo" style={{ width: 80, height: 80, objectFit: 'contain', background: '#fff', borderRadius: 6, border: '1px solid #ddd' }} />
                )}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <input
                    type="url"
                    value={settings.site_logo_url || ''}
                    onChange={(e) => set('site_logo_url', e.target.value)}
                    placeholder="/logo.png or upload below"
                  />
                  <input ref={fileRef} type="file" accept="image/*" onChange={uploadLogo} style={{ marginTop: 6 }} />
                </div>
              </div>
            </div>
            <div className="form-row">
              <label>Favicon URL</label>
              <input
                type="url"
                value={settings.site_favicon_url || ''}
                onChange={(e) => set('site_favicon_url', e.target.value)}
                placeholder="/favicon.png"
              />
            </div>
          </div>
        )}

        {activeTab === 'header' && (
          <div>
            <h3 style={{ marginTop: 0 }}>Header Navigation Menu</h3>
            <p className="help">Drag-style ordering with ↑↓ buttons. These links appear in the top navigation bar.</p>
            <MenuEditor menuKey="header_menu_json" items={headerMenu} />
          </div>
        )}

        {activeTab === 'footer' && (
          <div>
            <h3 style={{ marginTop: 0 }}>Footer Settings</h3>
            <div className="form-row">
              <label>Footer Copyright Text</label>
              <input
                type="text"
                value={settings.site_footer_text || ''}
                onChange={(e) => set('site_footer_text', e.target.value)}
              />
            </div>
            <div className="form-row">
              <label>Footer About Text</label>
              <textarea
                value={settings.site_footer_about || ''}
                onChange={(e) => set('site_footer_about', e.target.value)}
                rows={3}
                style={{ minHeight: 70, fontFamily: 'inherit' }}
              />
            </div>
            <h4>Footer Menu Links</h4>
            <MenuEditor menuKey="footer_menu_json" items={footerMenu} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <h3 style={{ marginTop: 0 }}>Contact Information</h3>
            <p className="help">Used on the contact page and structured data.</p>
            <div className="form-row">
              <label>Email</label>
              <input type="email" value={settings.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)} />
            </div>
            <div className="form-row">
              <label>Phone</label>
              <input type="tel" value={settings.contact_phone || ''} onChange={(e) => set('contact_phone', e.target.value)} />
            </div>
            <div className="form-row">
              <label>Address</label>
              <textarea
                value={settings.contact_address || ''}
                onChange={(e) => set('contact_address', e.target.value)}
                rows={2}
                style={{ minHeight: 60, fontFamily: 'inherit' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            <h3 style={{ marginTop: 0 }}>Social Media Links</h3>
            <div className="form-row">
              <label>Instagram URL</label>
              <input type="url" value={settings.social_instagram || ''} onChange={(e) => set('social_instagram', e.target.value)} />
            </div>
            <div className="form-row">
              <label>YouTube URL</label>
              <input type="url" value={settings.social_youtube || ''} onChange={(e) => set('social_youtube', e.target.value)} />
            </div>
            <div className="form-row">
              <label>Facebook URL</label>
              <input type="url" value={settings.social_facebook || ''} onChange={(e) => set('social_facebook', e.target.value)} />
            </div>
            <div className="form-row">
              <label>Pinterest URL</label>
              <input type="url" value={settings.social_pinterest || ''} onChange={(e) => set('social_pinterest', e.target.value)} />
            </div>
            <div className="form-row">
              <label>WhatsApp Number (with country code, no +)</label>
              <input type="text" value={settings.social_whatsapp || ''} onChange={(e) => set('social_whatsapp', e.target.value)} placeholder="919876543210" />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div>
            <h3 style={{ marginTop: 0 }}>SEO Defaults</h3>
            <p className="help">Used for the homepage and as fallback for posts that don't have their own SEO fields.</p>
            <div className="form-row">
              <label>Default Meta Title</label>
              <input
                type="text"
                value={settings.seo_default_title || ''}
                onChange={(e) => set('seo_default_title', e.target.value)}
                maxLength={70}
              />
            </div>
            <div className="form-row">
              <label>Default Meta Description</label>
              <textarea
                value={settings.seo_default_description || ''}
                onChange={(e) => set('seo_default_description', e.target.value)}
                rows={2}
                style={{ minHeight: 60, fontFamily: 'inherit' }}
                maxLength={170}
              />
            </div>
            <div className="form-row">
              <label>Default OG Image URL</label>
              <input
                type="url"
                value={settings.seo_default_og_image || ''}
                onChange={(e) => set('seo_default_og_image', e.target.value)}
                placeholder="https://... 1200x630px recommended"
              />
            </div>
            <div className="form-row">
              <label>Google Site Verification Code (optional)</label>
              <input
                type="text"
                value={settings.seo_google_verification || ''}
                onChange={(e) => set('seo_google_verification', e.target.value)}
                placeholder="content value from Search Console"
              />
            </div>
            <div className="form-row">
              <label>Google Analytics ID (optional)</label>
              <input
                type="text"
                value={settings.seo_ga_id || ''}
                onChange={(e) => set('seo_ga_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        )}
      </div>

      <div className="admin-card" style={{ position: 'sticky', bottom: 16 }}>
        <button className="btn" onClick={handleSave} disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Saving…' : '💾 Save All Settings'}
        </button>
      </div>
    </div>
  );
}
