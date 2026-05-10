'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';

type Category = { id: number; slug: string; name: string };

export default function PostEditor({
  post,
  categories,
  selectedCategoryIds = [],
}: {
  post?: any;
  categories: Category[];
  selectedCategoryIds?: number[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [status, setStatus] = useState(post?.status || 'published');
  const [categoryIds, setCategoryIds] = useState<number[]>(selectedCategoryIds);

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

      <div className="form-row">
        <label>Content (HTML allowed)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          placeholder="<p>Write your post content here. HTML and basic formatting work.</p>"
        />
        <p className="help">
          Tip: Use <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;img src="..."/&gt;</code>.
        </p>
      </div>

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

      <div className="form-row" style={{ marginTop: 24 }}>
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
