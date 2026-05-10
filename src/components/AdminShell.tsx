// Sidebar wrapper for protected admin pages.

import Link from 'next/link';

export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>🚩 Rithala Admin</h2>
        <nav>
          <Link href="/admin/dashboard">📊 Dashboard</Link>
          <Link href="/admin/posts">📝 Blog Posts</Link>
          <Link href="/admin/posts/new">➕ New Post</Link>
          <Link href="/admin/media">🖼️ Media Library</Link>
          <Link href="/admin/categories">🏷️ Categories</Link>
          <Link href="/admin/reels">🎬 Reels</Link>
          <Link href="/admin/leads">📨 Leads</Link>
          <Link href="/admin/settings">⚙️ Settings</Link>
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
