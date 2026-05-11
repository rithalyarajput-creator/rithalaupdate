'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const blogPaths = ['/admin/posts', '/admin/authors', '/admin/categories', '/admin/schedule'];
  const isBlogSection = blogPaths.some((p) => pathname?.startsWith(p));
  const [blogOpen, setBlogOpen] = useState(isBlogSection);

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(href + '/');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>🚩 Rithala Admin</h2>
        <nav>
          <Link href="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''}>
            📊 Dashboard
          </Link>

          {/* BLOG POSTS GROUP */}
          <button
            type="button"
            className={`admin-group-toggle ${blogOpen ? 'open' : ''} ${isBlogSection ? 'active-group' : ''}`}
            onClick={() => setBlogOpen(!blogOpen)}
          >
            📝 Blog Posts
            <span className="admin-chevron">{blogOpen ? '▾' : '▸'}</span>
          </button>
          {blogOpen && (
            <div className="admin-group">
              <Link href="/admin/posts" className={isActive('/admin/posts') && !pathname?.includes('/new') ? 'active' : ''}>
                📋 All Blogs
              </Link>
              <Link href="/admin/posts/new" className={isActive('/admin/posts/new') ? 'active' : ''}>
                ➕ New Blog
              </Link>
              <Link href="/admin/schedule" className={isActive('/admin/schedule') ? 'active' : ''}>
                ⏰ Scheduled
              </Link>
              <Link href="/admin/authors" className={isActive('/admin/authors') ? 'active' : ''}>
                ✍️ Authors
              </Link>
              <Link href="/admin/categories" className={isActive('/admin/categories') ? 'active' : ''}>
                🏷️ Categories
              </Link>
            </div>
          )}

          <Link href="/admin/media" className={isActive('/admin/media') ? 'active' : ''}>
            🖼️ Media Library
          </Link>
          <Link href="/admin/reels" className={isActive('/admin/reels') ? 'active' : ''}>
            🎬 Reels
          </Link>
          <Link href="/admin/leads" className={isActive('/admin/leads') ? 'active' : ''}>
            📨 Leads
          </Link>
          <Link href="/admin/settings" className={isActive('/admin/settings') ? 'active' : ''}>
            ⚙️ Settings
          </Link>
          <Link href="/" target="_blank" rel="noopener">🌐 View Site</Link>

          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px 20px', fontSize: '0.82rem', color: '#a1a1aa' }}>
            Logged in as<br /><strong>{email}</strong>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              style={{
                background: 'transparent', border: 'none', color: '#fff',
                padding: '12px 20px', cursor: 'pointer', textAlign: 'left',
                width: '100%', fontSize: '0.95rem',
              }}
            >
              🚪 Logout
            </button>
          </form>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
