'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import Icon from './Icon';

type Category = { id: number; slug: string; name: string };

/**
 * Clean HTML from Word / Google Docs / web pages while keeping
 * block-level formatting (h1-h6, p, ul/ol, blockquote, strong, em, a, img).
 */
function cleanPastedHtml(html: string): string {
  if (typeof document === 'undefined') return html;

  // 1) Quick string-level scrubs
  let clean = html
    .replace(/<\?xml[^>]*>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/<o:p[^>]*>[\s\S]*?<\/o:p>/gi, '');

  // 2) Parse via DOM to preserve structure
  const tmpl = document.createElement('template');
  tmpl.innerHTML = clean;
  const root = tmpl.content;

  const ALLOWED = new Set([
    'P', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'STRONG', 'B', 'EM', 'I', 'U', 'S', 'STRIKE', 'DEL', 'INS',
    'BLOCKQUOTE', 'PRE', 'CODE',
    'UL', 'OL', 'LI',
    'A', 'IMG', 'FIGURE', 'FIGCAPTION',
    'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD',
    'HR', 'DIV', 'SPAN',
  ]);

  function walk(node: Node) {
    const kids = Array.from(node.childNodes);
    kids.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toUpperCase();

        // Convert Word's bold/italic spans to <strong>/<em>
        const style = (el.getAttribute('style') || '').toLowerCase();
        if (tag === 'SPAN' && /font-weight\s*:\s*(bold|[6-9]00)/.test(style)) {
          const s = document.createElement('strong');
          s.innerHTML = el.innerHTML;
          el.replaceWith(s);
          walk(s);
          return;
        }
        if (tag === 'SPAN' && /font-style\s*:\s*italic/.test(style)) {
          const em = document.createElement('em');
          em.innerHTML = el.innerHTML;
          el.replaceWith(em);
          walk(em);
          return;
        }

        if (!ALLOWED.has(tag)) {
          // Unwrap unknown tag  keep its children
          const parent = el.parentNode!;
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
          walk(parent);
          return;
        }

        // Strip everything except a couple of safe attributes
        const allowedAttrs =
          tag === 'A' ? ['href', 'title', 'target', 'rel'] :
          tag === 'IMG' ? ['src', 'alt', 'title', 'width', 'height'] :
          [];

        Array.from(el.attributes).forEach((a) => {
          if (!allowedAttrs.includes(a.name.toLowerCase())) {
            el.removeAttribute(a.name);
          }
        });

        walk(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        node.removeChild(child);
      }
    });
  }
  walk(root);

  // 3) Serialize back
  const container = document.createElement('div');
  container.appendChild(root.cloneNode(true));
  return container.innerHTML
    // Drop empty paragraphs/spans
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<span>\s*<\/span>/g, '');
}

export default function PostEditor({
  post,
  categories,
  selectedCategoryIds = [],
  authors = [],
}: {
  post?: any;
  categories: Category[];
  selectedCategoryIds?: number[];
  authors?: { id: number; name: string; avatar_url?: string | null }[];
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

  // Media picker
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [mediaTarget, setMediaTarget] = useState<'featured' | 'og' | 'content'>('featured');
  const [mediaLoading, setMediaLoading] = useState(false);
  const fileRefFeatured = useRef<HTMLInputElement>(null);

  function autoSlug(t: string) {
    return slugify(t, { lower: true, strict: true, trim: true });
  }

  async function openMediaPicker(target: 'featured' | 'og' | 'content') {
    setMediaTarget(target);
    setMediaOpen(true);
    setMediaLoading(true);
    try {
      const r = await fetch('/api/media-list');
      if (r.ok) {
        const j = await r.json();
        setMediaItems(j.media || []);
      }
    } catch {}
    setMediaLoading(false);
  }

  function pickMedia(url: string, alt?: string) {
    if (mediaTarget === 'featured') setFeaturedImage(url);
    else if (mediaTarget === 'og') setOgImage(url);
    else if (mediaTarget === 'content') {
      // Insert into content editor
      const imgTag = `<img src="${url}" alt="${alt || ''}" />`;
      // Simplest: append to current content
      setContent((c: string) => c + (c.endsWith('\n') || c === '' ? '' : '\n') + imgTag);
    }
    setMediaOpen(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, target: 'featured' | 'og' = 'featured') {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading image');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      if (target === 'featured') setFeaturedImage(j.url);
      else setOgImage(j.url);
      setMsg('Image uploaded');
      setTimeout(() => setMsg(null), 2000);
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Upload failed');
    }
  }

  async function handleSave(newStatus?: string) {
    setSaving(true);
    setErr(null); setMsg(null);
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
      setMsg('Saved successfully. Live in a few seconds.');
      if (!post?.id) router.push(`/admin/posts/${j.id}`);
      else router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Save failed');
    }
    setSaving(false);
  }

  function toggleCategory(id: number) {
    setCategoryIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  // SEO score
  const titleLen = (metaTitle || title).length;
  const descLen = metaDescription.length;
  const titleStatus = titleLen >= 30 && titleLen <= 60 ? 'good' : titleLen > 0 ? 'warn' : 'bad';
  const descStatus = descLen >= 120 && descLen <= 160 ? 'good' : descLen > 0 ? 'warn' : 'bad';

  return (
    <div className="pe-layout">
      {/* MAIN COLUMN */}
      <div className="pe-main">
        {err && <div className="adm-alert adm-alert-error">{err}</div>}
        {msg && <div className="adm-alert adm-alert-success">{msg}</div>}

        {/* TITLE */}
        <div className="pe-card">
          <input
            type="text"
            className="pe-title-input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!post?.id) setSlug(autoSlug(e.target.value));
            }}
            placeholder="Add title..."
          />
          <div className="pe-slug-row">
            <span>Permalink:</span>
            <code>/blog/</code>
            <input
              type="text"
              className="pe-slug-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-url-slug"
            />
            <code>/</code>
          </div>
        </div>

        {/* CONTENT EDITOR */}
        <div className="pe-card">
          <ContentEditor
            content={content}
            onChange={setContent}
            onInsertImage={() => openMediaPicker('content')}
          />
        </div>

        {/* EXCERPT */}
        <div className="pe-card">
          <h3 className="pe-card-head">Excerpt (Short Summary)</h3>
          <textarea
            className="pe-textarea"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Short summary shown on the homepage and in Google search results."
          />
        </div>

        {/* SEO */}
        <div className="pe-card">
          <h3 className="pe-card-head">SEO Settings</h3>

          <div className="pe-field">
            <label>
              Meta Title
              <span className={`pe-counter pe-counter-${titleStatus}`}>{titleLen}/60</span>
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Defaults to post title"
              maxLength={70}
            />
            <small>Recommended: 30-60 characters. Shown in Google search results.</small>
          </div>

          <div className="pe-field">
            <label>
              Meta Description
              <span className={`pe-counter pe-counter-${descStatus}`}>{descLen}/160</span>
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              placeholder="Short description for Google search results"
              maxLength={170}
            />
            <small>Recommended: 120-160 characters.</small>
          </div>

          <div className="pe-field">
            <label>Focus Keyword</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Main keyword you want to rank for"
            />
          </div>

          {/* Google preview */}
          <div className="pe-google-preview">
            <small>Google Preview:</small>
            <div className="pe-gp-title">{metaTitle || title || 'Post Title'}</div>
            <div className="pe-gp-url">rithalaupdate.online/blog/{slug || 'your-slug'}/</div>
            <div className="pe-gp-desc">{metaDescription || excerpt || 'Description preview will appear here'}</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="pe-sidebar">
        {/* PUBLISH BOX */}
        <div className="pe-card">
          <h3 className="pe-card-head">
            <Icon name="check" size={16} /> Publish
          </h3>
          <div className="pe-field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="published">Published (live)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </div>
          <div className="pe-field">
            <label>Schedule (optional)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <small>Future date + Draft = scheduled publish</small>
          </div>
          <div className="pe-publish-actions">
            <button
              type="button"
              className="adm-btn-primary"
              onClick={() => handleSave('published')}
              disabled={saving || !title}
              style={{ width: '100%' }}
            >
              {saving ? 'Saving' : (post?.id ? 'Update' : 'Publish')}
            </button>
            <button
              type="button"
              className="adm-btn-ghost"
              onClick={() => handleSave('draft')}
              disabled={saving || !title}
              style={{ width: '100%' }}
            >
              Save as Draft
            </button>
          </div>
        </div>

        {/* AUTHOR */}
        <div className="pe-card">
          <h3 className="pe-card-head">
            <Icon name="feather" size={16} /> Author
          </h3>
          <div className="pe-field">
            <AuthorPicker
              authors={authors}
              value={authorName}
              onChange={setAuthorName}
            />
            <small><a href="/admin/authors" target="_blank">Manage authors</a></small>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="pe-card">
          <h3 className="pe-card-head">
            <Icon name="tag" size={16} /> Categories
          </h3>
          <CategoriesPicker
            categories={categories}
            value={categoryIds}
            onChange={setCategoryIds}
          />
        </div>

        {/* FEATURED IMAGE */}
        <div className="pe-card">
          <h3 className="pe-card-head">
            <Icon name="image" size={16} /> Featured Image
          </h3>
          <div className="pe-featured-wrap">
            {featuredImage ? (
              <div className="pe-featured-preview">
                <img src={featuredImage} alt="" />
                <button
                  type="button"
                  className="pe-featured-remove"
                  onClick={() => setFeaturedImage('')}
                  title="Remove image"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            ) : (
              <div className="pe-featured-empty">
                <Icon name="image" size={32} />
                <small>No featured image</small>
              </div>
            )}
            <div className="pe-featured-actions">
              <button type="button" onClick={() => fileRefFeatured.current?.click()} className="adm-btn-ghost" style={{ flex: 1 }}>
                <Icon name="plus" size={13} /> Upload
              </button>
              <button type="button" onClick={() => openMediaPicker('featured')} className="adm-btn-ghost" style={{ flex: 1 }}>
                <Icon name="image" size={13} /> Library
              </button>
              <input
                ref={fileRefFeatured}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'featured')}
                style={{ display: 'none' }}
              />
            </div>
            <input
              type="url"
              className="pe-featured-url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="Or paste image URL..."
            />
          </div>
        </div>
      </aside>

      {/* MEDIA PICKER MODAL */}
      {mediaOpen && (
        <div className="pe-media-modal" onClick={(e) => { if (e.target === e.currentTarget) setMediaOpen(false); }}>
          <div className="pe-media-modal-inner">
            <div className="pe-media-modal-head">
              <h3><Icon name="image" size={18} /> Media Library</h3>
              <button onClick={() => setMediaOpen(false)} className="pe-media-close"><Icon name="close" size={18} /></button>
            </div>
            <div className="pe-media-modal-body">
              {mediaLoading ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Loading</p>
              ) : mediaItems.length === 0 ? (
                <div className="adm-empty">
                  <Icon name="image" size={48} />
                  <h3>No images yet</h3>
                  <p>Upload images first in the Media Library.</p>
                  <a href="/admin/media" target="_blank" className="adm-btn-primary">
                    <Icon name="external" size={14} /> Open Media Library
                  </a>
                </div>
              ) : (
                <div className="pe-media-grid">
                  {mediaItems.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="pe-media-item"
                      onClick={() => pickMedia(m.url, m.alt_text)}
                      title={m.filename || 'Select'}
                    >
                      <img src={m.url} alt={m.alt_text || ''} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================================
   ContentEditor  Visual + HTML with paste-preserve
   =========================================== */

function ContentEditor({
  content,
  onChange,
  onInsertImage,
}: {
  content: string;
  onChange: (v: string) => void;
  onInsertImage: () => void;
}) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === 'visual' && editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [mode]);

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  }

  function insertLink() {
    const url = prompt('Enter URL (https://...):');
    if (url) exec('createLink', url);
  }

  return (
    <div>
      <div className="pe-content-head">
        <h3 className="pe-card-head" style={{ margin: 0, padding: 0, border: 'none' }}>Blog Content</h3>
        <div className="pe-mode-toggle">
          <button type="button" className={mode === 'visual' ? 'active' : ''} onClick={() => setMode('visual')}>Visual</button>
          <button type="button" className={mode === 'html' ? 'active' : ''} onClick={() => setMode('html')}>HTML</button>
        </div>
      </div>

      {mode === 'visual' && (
        <>
          <div className="ce-toolbar">
            <button type="button" onClick={() => exec('formatBlock', '<h2>')} title="Heading 2"><strong>H2</strong></button>
            <button type="button" onClick={() => exec('formatBlock', '<h3>')} title="Heading 3"><strong>H3</strong></button>
            <button type="button" onClick={() => exec('formatBlock', '<p>')} title="Paragraph">P</button>
            <span className="ce-divider"></span>
            <button type="button" onClick={() => exec('bold')} title="Bold (Ctrl+B)"><strong>B</strong></button>
            <button type="button" onClick={() => exec('italic')} title="Italic (Ctrl+I)"><em>I</em></button>
            <button type="button" onClick={() => exec('underline')} title="Underline"><u>U</u></button>
            <button type="button" onClick={() => exec('strikeThrough')} title="Strikethrough"><s>S</s></button>
            <span className="ce-divider"></span>
            <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet list"> List</button>
            <button type="button" onClick={() => exec('insertOrderedList')} title="Numbered list">1. List</button>
            <button type="button" onClick={() => exec('formatBlock', '<blockquote>')} title="Quote">&ldquo; &rdquo;</button>
            <span className="ce-divider"></span>
            <button type="button" onClick={insertLink} title="Add link">Link</button>
            <button type="button" onClick={onInsertImage} title="Insert image from library">
              <Icon name="image" size={14} /> Image
            </button>
            <span className="ce-divider"></span>
            <button type="button" onClick={() => exec('justifyLeft')} title="Align left"></button>
            <button type="button" onClick={() => exec('justifyCenter')} title="Align center"></button>
            <button type="button" onClick={() => exec('justifyRight')} title="Align right"></button>
            <span className="ce-divider"></span>
            <button type="button" onClick={() => exec('removeFormat')} title="Clear formatting">Clear</button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="ce-visual"
            onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
            onPaste={(e) => {
              const html = e.clipboardData.getData('text/html');
              const text = e.clipboardData.getData('text/plain');
              if (html) {
                e.preventDefault();
                const clean = cleanPastedHtml(html);
                // Use insertHTML  keeps block-level tags like h1/h2/h3/blockquote/ul/ol intact
                document.execCommand('insertHTML', false, clean);
                if (editorRef.current) {
                  onChange(editorRef.current.innerHTML);
                }
              } else if (text) {
                e.preventDefault();
                document.execCommand('insertText', false, text);
              }
            }}
          />
          <p className="pe-help">
            Type or paste content. Word / Docs / Google Docs से paste करने पर bold, headings, links  सब preserved रहेंगे।
          </p>
        </>
      )}

      {mode === 'html' && (
        <>
          <textarea
            className="pe-textarea pe-html-textarea"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={20}
            placeholder="<p>Direct HTML लिखें यहाँ.</p>"
          />
          <p className="pe-help">
            HTML mode for power users. Use <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;img&gt;</code>.
          </p>
        </>
      )}
    </div>
  );
}

/* ===========================================
   CategoriesPicker  Author-style dropdown with checkboxes
   =========================================== */
function CategoriesPicker({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: number[];
  onChange: (next: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  function toggle(id: number) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }

  const selectedNames = categories.filter((c) => value.includes(c.id)).map((c) => c.name);
  const label = selectedNames.length === 0
    ? 'Select categories'
    : selectedNames.length === 1
      ? selectedNames[0]
      : `${selectedNames.length} categories selected`;

  return (
    <div className="pe-cat-picker" ref={wrapRef}>
      <button
        type="button"
        className="pe-cat-picker-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
      </button>

      {selectedNames.length > 0 && (
        <div className="pe-cat-chips">
          {categories.filter((c) => value.includes(c.id)).map((c) => (
            <span key={c.id} className="pe-cat-chip">
              {c.name}
              <button type="button" onClick={() => toggle(c.id)} aria-label={`Remove ${c.name}`}>
                <Icon name="close" size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="pe-cat-dropdown">
          {categories.length === 0 ? (
            <small style={{ padding: '10px 14px', display: 'block', color: '#94a3b8' }}>
              No categories yet. <a href="/admin/categories" target="_blank">Add some</a>.
            </small>
          ) : (
            categories.map((c) => (
              <label key={c.id} className="pe-cat-option">
                <input
                  type="checkbox"
                  checked={value.includes(c.id)}
                  onChange={() => toggle(c.id)}
                />
                <span>{c.name}</span>
              </label>
            ))
          )}
        </div>
      )}

      <a href="/admin/categories" target="_blank" className="pe-cat-manage-link">
        <Icon name="plus" size={11} /> New category
      </a>
    </div>
  );
}

/* ===========================================
   AuthorPicker  dropdown with avatars
   =========================================== */
function AuthorPicker({
  authors,
  value,
  onChange,
}: {
  authors: { id: number; name: string; avatar_url?: string | null }[];
  value: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (authors.length === 0) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Author name"
      />
    );
  }

  const current = authors.find((a) => a.name === value);

  return (
    <div className="pe-author-picker" ref={wrapRef}>
      <button
        type="button"
        className="pe-author-trigger"
        onClick={() => setOpen(!open)}
      >
        <span className="pe-author-trigger-left">
          {current?.avatar_url ? (
            <img src={current.avatar_url} alt="" />
          ) : (
            <span className="pe-author-avatar-fallback">{value[0] || '?'}</span>
          )}
          <span>{current?.name || value}</span>
        </span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
      </button>

      {open && (
        <div className="pe-author-dropdown">
          {authors.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`pe-author-option ${a.name === value ? 'is-active' : ''}`}
              onClick={() => { onChange(a.name); setOpen(false); }}
            >
              {a.avatar_url ? (
                <img src={a.avatar_url} alt="" />
              ) : (
                <span className="pe-author-avatar-fallback">{a.name[0]}</span>
              )}
              <span>{a.name}</span>
              {a.name === value && <Icon name="check" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
