'use client';

import { useState, useRef } from 'react';

type MenuItem = { label: string; url: string; children?: MenuItem[] };

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

  function MenuEditor({ menuKey, items, supportDropdown = true }: { menuKey: string; items: MenuItem[]; supportDropdown?: boolean }) {
    return (
      <div>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 10, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={item.label}
                placeholder="Label"
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], label: e.target.value };
                  setMenu(menuKey, next);
                }}
                style={{ flex: 1, minWidth: 120 }}
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
                style={{ flex: 2, minWidth: 150 }}
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
              >↑</button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                disabled={i === items.length - 1}
                onClick={() => {
                  const next = [...items];
                  [next[i], next[i + 1]] = [next[i + 1], next[i]];
                  setMenu(menuKey, next);
                }}
              >↓</button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => setMenu(menuKey, items.filter((_, j) => j !== i))}
              >×</button>
            </div>

            {supportDropdown && (
              <div style={{ marginTop: 10, paddingLeft: 16, borderLeft: '3px solid #fde68a' }}>
                <p style={{ fontSize: '0.78rem', color: '#666', margin: '4px 0' }}>
                  Dropdown items (sub-menu) — leave empty for no dropdown:
                </p>
                {(item.children || []).map((child, j) => (
                  <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={child.label}
                      placeholder="Sub-label"
                      onChange={(e) => {
                        const next = [...items];
                        const children = [...(next[i].children || [])];
                        children[j] = { ...children[j], label: e.target.value };
                        next[i] = { ...next[i], children };
                        setMenu(menuKey, next);
                      }}
                      style={{ flex: 1, fontSize: '0.85rem', padding: '6px 8px' }}
                    />
                    <input
                      type="text"
                      value={child.url}
                      placeholder="Sub-URL"
                      onChange={(e) => {
                        const next = [...items];
                        const children = [...(next[i].children || [])];
                        children[j] = { ...children[j], url: e.target.value };
                        next[i] = { ...next[i], children };
                        setMenu(menuKey, next);
                      }}
                      style={{ flex: 2, fontSize: '0.85rem', padding: '6px 8px' }}
                    />
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => {
                        const next = [...items];
                        const children = (next[i].children || []).filter((_, k) => k !== j);
                        next[i] = { ...next[i], children };
                        setMenu(menuKey, next);
                      }}
                      style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                    >×</button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    const next = [...items];
                    const children = [...(next[i].children || []), { label: 'Sub Item', url: '/' }];
                    next[i] = { ...next[i], children };
                    setMenu(menuKey, next);
                  }}
                  style={{ fontSize: '0.8rem', marginTop: 4 }}
                >+ Add Sub-Item</button>
              </div>
            )}
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
              <label>Site Logo (shown in header + footer)</label>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap', padding: '10px 0' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={settings.site_logo_url || '/logo.png'}
                    alt="Logo"
                    style={{ width: 96, height: 96, objectFit: 'contain', background: '#fff', borderRadius: 12, border: '2px solid #e5e7eb', padding: 6 }}
                  />
                  {settings.site_logo_url && (
                    <button
                      type="button"
                      onClick={() => set('site_logo_url', '')}
                      style={{
                        position: 'absolute', top: -8, right: -8,
                        width: 26, height: 26, borderRadius: '50%',
                        background: '#ef4444', color: '#fff',
                        border: '2px solid #fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      }}
                      title="Remove logo (use default)"
                    >×</button>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="url"
                    value={settings.site_logo_url || ''}
                    onChange={(e) => set('site_logo_url', e.target.value)}
                    placeholder="https://... or leave empty for default /logo.png"
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{
                        background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                        color: '#fff', padding: '8px 16px', border: 'none',
                        borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >Upload New Logo</button>
                    {settings.site_logo_url && (
                      <button
                        type="button"
                        onClick={() => set('site_logo_url', '')}
                        style={{
                          background: 'transparent', color: '#ef4444',
                          padding: '8px 16px', border: '1.5px solid #ef4444',
                          borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >Remove</button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={uploadLogo} style={{ display: 'none' }} />
                  <p className="help" style={{ margin: 0 }}>Recommended: square PNG with transparent background, at least 256×256px.</p>
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>Site Favicon (browser tab icon)</label>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap', padding: '10px 0' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={settings.site_favicon_url || '/favicon.png'}
                    alt="Favicon"
                    style={{ width: 64, height: 64, objectFit: 'contain', background: '#fff', borderRadius: 8, border: '2px solid #e5e7eb', padding: 6 }}
                  />
                  {settings.site_favicon_url && (
                    <button
                      type="button"
                      onClick={() => set('site_favicon_url', '')}
                      style={{
                        position: 'absolute', top: -8, right: -8,
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#ef4444', color: '#fff',
                        border: '2px solid #fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      }}
                      title="Remove favicon"
                    >×</button>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="url"
                    value={settings.site_favicon_url || ''}
                    onChange={(e) => set('site_favicon_url', e.target.value)}
                    placeholder="https://... or leave empty for default /favicon.png"
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <FaviconUploadButton onUploaded={(url) => set('site_favicon_url', url)} />
                    {settings.site_favicon_url && (
                      <button
                        type="button"
                        onClick={() => set('site_favicon_url', '')}
                        style={{
                          background: 'transparent', color: '#ef4444',
                          padding: '8px 16px', border: '1.5px solid #ef4444',
                          borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >Remove</button>
                    )}
                  </div>
                  <p className="help" style={{ margin: 0 }}>Square PNG/ICO. 32×32 or 64×64 recommended.</p>
                </div>
              </div>
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
            <MenuEditor menuKey="footer_menu_json" items={footerMenu} supportDropdown={false} />
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
              <label>Email Address (header icon)</label>
              <input
                type="email"
                value={settings.social_email || ''}
                onChange={(e) => set('social_email', e.target.value)}
                placeholder="rithalyarajput@gmail.com"
              />
              <p className="help">Shown as email icon in header. Use the Contact tab for the contact-page email.</p>
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

function FaviconUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      onUploaded(j.url);
    }
  }
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        style={{
          background: 'linear-gradient(135deg, #dc2626, #ea580c)',
          color: '#fff', padding: '8px 16px', border: 'none',
          borderRadius: 8, cursor: 'pointer', fontWeight: 600,
          fontSize: '0.85rem',
        }}
      >Upload Favicon</button>
      <input ref={ref} type="file" accept="image/*,.ico" onChange={handle} style={{ display: 'none' }} />
    </>
  );
}
