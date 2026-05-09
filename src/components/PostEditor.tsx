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
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function autoSlug(title: string) {
    return slugify(title, { lower: true, strict: true, trim: true });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('Uploading image…');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const j = await res.json();
      setFeaturedImage(j.url);
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
      if (!post?.id) {
        router.push(`/admin/posts/${j.id}`);
      } else {
        router.refresh();
      }
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Save failed');
    }
    setSaving(false);
  }

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
          placeholder="Post title in any language (Hindi/English)"
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
              placeholder="https://... or upload below"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: 6 }}
            />
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
          Tip: paste images using <code>&lt;img src="..."/&gt;</code> tags. Use{' '}
          <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, etc.
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

      <div className="form-row">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="published">Published (live on site)</option>
          <option value="draft">Draft (not visible)</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          className="btn"
          onClick={() => handleSave('published')}
          disabled={saving || !title}
        >
          {saving ? 'Saving…' : 'Publish'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleSave('draft')}
          disabled={saving || !title}
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
}
