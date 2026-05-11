'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';

type Category = { id: number; slug: string; name: string };

export default function PostEditor({
  post,
  categories,
  selectedCategoryIds = [],
  authors = [],
}: {
  post?: any;
  categories: Category[];
  selectedCategoryIds?: number[];
  authors?: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [status, setStatus] = useState(post?.status || 'published');
  const [categoryIds, setCategoryIds] = useState<number[]>(selectedCategoryIds);
  const [authorName, setAuthorName] = useState(post?.author_name || (authors[0]?.name ?? 'Sandeep Rajput'));
  const [scheduledAt, setScheduledAt] = useState(
    post?.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : ''
  );

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || '');
  const [ogImage, setOgImage] = useState(post?.og_image || '');
  const [focusKeyword, setFocusKeyword] = useState(post?.focus_keyword || '');
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonical_url || '');
  const [noindex, setNoindex] = useState(!!post?.noindex);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [showSeo, setShowSeo] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function autoSlug(t: string) {
    return slugify(t, { lower: true, strict: true, trim: true });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, target: 'featured' | 'og' = 'featured') {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading image…');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      if (target === 'featured') setFeaturedImage(j.url);
      else setOgImage(j.url);
      setMsg('Image uploaded ✓');
      setTimeout(() => setMsg(null), 2000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Upload failed');
    }
  }

  async function handleSave(newStatus?: string) {
    setSaving(true);
    setErr(null);
    setMsg(null);
    const body = {
      title,
      slug: slug || autoSlug(title),
      excerpt,
      content,
      featured_image: featuredImage,
      status: newStatus || status,
      category_ids: categoryIds,
      meta_title: metaTitle,
      meta_description: metaDescription,
      og_image: ogImage,
      focus_keyword: focusKeyword,
      canonical_url: canonicalUrl,
      noindex,
      author_name: authorName,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
    };
    const url = post?.id ? `/api/posts/${post.id}` : '/api/posts';
    const method = post?.id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const j = await res.json();
      setMsg('Saved ✓ Live in a few seconds.');
      if (!post?.id) router.push(`/admin/posts/${j.id}`);
      else router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Save failed');
    }
    setSaving(false);
  }

  // SEO score helpers
  const titleLen = (metaTitle || title).length;
  const descLen = metaDescription.length;
  const titleStatus = titleLen >= 30 && titleLen <= 60 ? 'good' : titleLen > 0 ? 'warn' : 'bad';
  const descStatus = descLen >= 120 && descLen <= 160 ? 'good' : descLen > 0 ? 'warn' : 'bad';

  return (
    <div className="admin-card">
      {err && <div className="form-error">{err}</div>}
      {msg && <div className="form-success">{msg}</div>}

      <div className="form-row">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!post?.id) setSlug(autoSlug(e.target.value));
          }}
          placeholder="Post title (Hindi/English)"
          required
        />
      </div>

      <div className="form-row">
        <label>Slug (URL)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated-from-title"
        />
        <p className="help">Will become: /{slug || '...'}/</p>
      </div>

      <div className="form-row">
        <label>Featured Image</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {featuredImage && (
            <img src={featuredImage} alt="" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 6 }} />
          )}
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://... or upload below or pick from media"
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'featured')}
              />
              <a href="/admin/media" target="_blank" className="btn btn-sm btn-secondary" style={{ fontSize: '0.8rem' }}>
                📂 Browse Media
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="form-row">
        <label>Excerpt (short summary)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          style={{ minHeight: 80, fontFamily: 'inherit' }}
          placeholder="Short summary shown on home page and in search results"
        />
      </div>

      <ContentEditor content={content} onChange={setContent} />


      <div className="form-row">
        <label>Categories</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {categories.map((c) => (
            <label key={c.id} style={{ display: 'flex', gap: 6, alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="checkbox"
                checked={categoryIds.includes(c.id)}
                onChange={(e) => {
                  if (e.target.checked) setCategoryIds([...categoryIds, c.id]);
                  else setCategoryIds(categoryIds.filter((x) => x !== c.id));
                }}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {/* SEO Section (collapsible) */}
      <div className="seo-panel" style={{ marginTop: 24, border: '2px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#f9fafb' }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' }}
          onClick={() => setShowSeo(!showSeo)}
        >
          <h3 style={{ margin: 0 }}>🔍 SEO Settings</h3>
          <span>{showSeo ? '▲ Hide' : '▼ Show'}</span>
        </div>

        {showSeo && (
          <div style={{ marginTop: 16 }}>
            <div className="form-row">
              <label>
                Meta Title
                <span style={{ float: 'right', fontSize: '0.8rem', color: titleStatus === 'good' ? 'green' : titleStatus === 'warn' ? 'orange' : 'red' }}>
                  {titleLen}/60 chars {titleStatus === 'good' ? '✓' : titleStatus === 'warn' ? '⚠' : '✗'}
                </span>
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Defaults to post title if empty"
                maxLength={70}
              />
              <p className="help">Recommended: 30-60 characters. Shown on Google.</p>
            </div>

            <div className="form-row">
              <label>
                Meta Description
                <span style={{ float: 'right', fontSize: '0.8rem', color: descStatus === 'good' ? 'green' : descStatus === 'warn' ? 'orange' : 'red' }}>
                  {descLen}/160 chars {descStatus === 'good' ? '✓' : descStatus === 'warn' ? '⚠' : '✗'}
                </span>
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                style={{ minHeight: 60, fontFamily: 'inherit' }}
                placeholder="Short description shown in Google search results"
                maxLength={170}
              />
              <p className="help">Recommended: 120-160 characters.</p>
            </div>

            <div className="form-row">
              <label>Focus Keyword</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="Main keyword you want to rank for (e.g. रिठाला गाँव)"
              />
            </div>

            <div className="form-row">
              <label>Open Graph (Social Share) Image</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {ogImage && (
                  <img src={ogImage} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                )}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://... (optional, uses featured image if empty)"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'og')}
                    style={{ marginTop: 6 }}
                  />
                </div>
              </div>
              <p className="help">Recommended: 1200x630px. Shown on Facebook, WhatsApp, Twitter.</p>
            </div>

            <div className="form-row">
              <label>Canonical URL (advanced)</label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="Leave empty unless duplicating from another site"
              />
            </div>

            <div className="form-row">
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 'normal' }}>
                <input
                  type="checkbox"
                  checked={noindex}
                  onChange={(e) => setNoindex(e.target.checked)}
                />
                Hide from search engines (noindex)
              </label>
              <p className="help">Check this only if you don't want Google to index this post.</p>
            </div>

            {/* Google preview */}
            <div style={{ background: '#fff', padding: 12, borderRadius: 6, border: '1px solid #ddd', marginTop: 12 }}>
              <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>Google Preview:</p>
              <p style={{ color: '#1a0dab', fontSize: '1.1rem', margin: '4px 0', fontWeight: 500 }}>
                {metaTitle || title || 'Post Title'}
              </p>
              <p style={{ color: '#006621', fontSize: '0.85rem', margin: '2px 0' }}>
                rithalaupdate.online/{slug || 'your-slug'}/
              </p>
              <p style={{ color: '#545454', fontSize: '0.85rem', margin: '4px 0' }}>
                {metaDescription || excerpt || 'Description preview will appear here…'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr', marginTop: 24 }}>
        <div className="form-row">
          <label>✍️ Author</label>
          {authors.length > 0 ? (
            <select value={authorName} onChange={(e) => setAuthorName(e.target.value)}>
              {authors.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
          ) : (
            <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Author name" />
          )}
          <p className="help">
            <a href="/admin/authors" target="_blank">Manage authors →</a>
          </p>
        </div>

        <div className="form-row">
          <label>⏰ Schedule (optional)</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
          <p className="help">
            Future date set करें + Draft रखें = scheduled publish के लिए
          </p>
        </div>
      </div>

      <div className="form-row">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="published">Published (live on site)</option>
          <option value="draft">Draft (not visible)</option>
        </select>
      </div>

      <div className="form-actions">
        <button className="btn" onClick={() => handleSave('published')} disabled={saving || !title}>
          {saving ? 'Saving…' : 'Publish'}
        </button>
        <button className="btn btn-secondary" onClick={() => handleSave('draft')} disabled={saving || !title}>
          Save as Draft
        </button>
      </div>
    </div>
  );
}

/* ===========================================
   ContentEditor — Visual + HTML mode toggle
   Visual mode uses contentEditable with basic formatting toolbar.
   =========================================== */

function ContentEditor({ content, onChange }: { content: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const editorRef = useRef<HTMLDivElement>(null);
  const lastExternal = useRef(content);

  // Sync incoming content to visual editor when it changes externally
  useEffect(() => {
    if (mode === 'visual' && editorRef.current) {
      if (lastExternal.current !== content && editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || '';
        lastExternal.current = content;
      }
    }
  }, [content, mode]);

  // When switching to visual mode, populate the div
  useEffect(() => {
    if (mode === 'visual' && editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [mode]);

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      lastExternal.current = editorRef.current.innerHTML;
      editorRef.current.focus();
    }
  }

  function insertLink() {
    const url = prompt('Enter URL (https://...):');
    if (url) exec('createLink', url);
  }

  function insertImage() {
    const url = prompt('Enter image URL (or upload via Media Library first):');
    if (url) exec('insertImage', url);
  }

  function clearFormat() { exec('removeFormat'); }

  return (
    <div className="form-row">
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Blog Content</span>
        <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: 8, padding: 3, gap: 2 }}>
          <button
            type="button"
            onClick={() => {
              if (mode === 'html' && editorRef.current) {
                // already synced via state
              }
              setMode('visual');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: mode === 'visual' ? '#fff' : 'transparent',
              color: mode === 'visual' ? '#dc2626' : '#64748b',
              boxShadow: mode === 'visual' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setMode('html')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: mode === 'html' ? '#fff' : 'transparent',
              color: mode === 'html' ? '#dc2626' : '#64748b',
              boxShadow: mode === 'html' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            HTML
          </button>
        </div>
      </label>

      {mode === 'visual' && (
        <>
          <div className="ce-toolbar">
            <button type="button" onClick={() => exec('formatBlock', '<h2>')} title="Heading 2"><strong>H2</strong></button>
            <button type="button" onClick={() => exec('formatBlock', '<h3>')} title="Heading 3"><strong>H3</strong></button>
            <button type="button" onClick={() => exec('formatBlock', '<p>')} title="Paragraph">P</button>
            <span className="ce-divider"></span>
            <button type="button" onClick={() => exec('bold')} title="Bold"><strong>B</strong></button>
            <button type="button" onClick={() => exec('italic')} title="Italic"><em>I</em></button>
            <button type="button" onClick={() => exec('underline')} title="Underline"><u>U</u></button>
            <span className="ce-divider"></span>
            <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet list">• List</button>
            <button type="button" onClick={() => exec('insertOrderedList')} title="Numbered list">1. List</button>
            <button type="button" onClick={() => exec('formatBlock', '<blockquote>')} title="Quote">&ldquo; &rdquo;</button>
            <span className="ce-divider"></span>
            <button type="button" onClick={insertLink} title="Add link">Link</button>
            <button type="button" onClick={insertImage} title="Insert image">Image</button>
            <button type="button" onClick={clearFormat} title="Clear formatting">Clear</button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="ce-visual"
            onInput={(e) => {
              const html = (e.target as HTMLDivElement).innerHTML;
              onChange(html);
              lastExternal.current = html;
            }}
            onPaste={(e) => {
              // Paste as plain text to avoid messy styles
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
          />
          <p className="help">
            Normal text type karein. Toolbar से heading, bold, list, link add करें. यहाँ जो दिखेगा वो website पर वैसा ही दिखेगा।
          </p>
        </>
      )}

      {mode === 'html' && (
        <>
          <textarea
            value={content}
            onChange={(e) => {
              onChange(e.target.value);
              lastExternal.current = e.target.value;
            }}
            rows={20}
            placeholder="<p>Direct HTML लिखें यहाँ.</p>"
            style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
          />
          <p className="help">
            Direct HTML mode. Use <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;img&gt;</code>, etc.
          </p>
        </>
      )}
    </div>
  );
}
