'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Icon from './Icon';

type NavItem = {
  href?: string;
  label: string;
  icon: string;
  children?: NavItem[];
};

const NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  {
    label: 'Blog Posts',
    icon: 'newspaper',
    children: [
      { href: '/admin/posts', label: 'All Blogs', icon: 'blog' },
      { href: '/admin/posts/new', label: 'New Blog', icon: 'plus' },
      { href: '/admin/schedule', label: 'Scheduled', icon: 'clock' },
      { href: '/admin/authors', label: 'Authors', icon: 'feather' },
      { href: '/admin/categories', label: 'Categories', icon: 'tag' },
    ],
  },
  { href: '/admin/photos', label: 'Photos', icon: 'photo' },
  { href: '/admin/media', label: 'Media Library', icon: 'image' },
  { href: '/admin/reels', label: 'Reels', icon: 'video' },
  { href: '/admin/leads', label: 'Leads', icon: 'inbox' },
  { href: '/admin/faqs', label: 'FAQs', icon: 'book' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'star' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname() || '';
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href?: string) {
    if (!href) return false;
    if (href === '/admin/posts/new') return pathname === href;
    if (href === '/admin/posts') return pathname === href || (pathname.startsWith('/admin/posts/') && pathname !== '/admin/posts/new');
    return pathname === href || pathname.startsWith(href + '/');
  }

  function isGroupActive(item: NavItem) {
    return item.children?.some((c) => isActive(c.href)) ?? false;
  }

  return (
    <div className={`admin-shell-v2 ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Mobile topbar */}
      <header className="admin-topbar">
        <button
          className="admin-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} size={20} />
        </button>
        <div className="admin-topbar-brand">
          <Icon name="flag" size={18} />
          <span>Rithala Admin</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="admin-sidebar-v2" aria-label="Admin navigation">
        <div className="admin-sidebar-head">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <Icon name="flag" size={18} />
            </div>
            <div>
              <strong>Rithala</strong>
              <small>Admin Panel</small>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map((item, i) => (
            <NavGroup key={i} item={item} isActive={isActive} isGroupActive={isGroupActive} />
          ))}

          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon"><Icon name="external" size={17} /></span>
            <span className="admin-nav-label">View Site</span>
          </a>
        </nav>

        <div className="admin-sidebar-foot">
          <div className="admin-user">
            <div className="admin-user-avatar">
              {email[0]?.toUpperCase()}
            </div>
            <div className="admin-user-info">
              <small>Logged in as</small>
              <strong>{email}</strong>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="admin-logout-btn">
              <Icon name="logout" size={15} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && <div className="admin-backdrop" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <main className="admin-main-v2">
        <div className="admin-main-inner">{children}</div>
      </main>
    </div>
  );
}

function NavGroup({
  item,
  isActive,
  isGroupActive,
}: {
  item: NavItem;
  isActive: (href?: string) => boolean;
  isGroupActive: (item: NavItem) => boolean;
}) {
  const groupActive = isGroupActive(item);
  const [open, setOpen] = useState(groupActive);

  // Auto-close when user navigates outside this group's pages
  useEffect(() => {
    if (!groupActive) setOpen(false);
    else setOpen(true);
  }, [groupActive]);

  if (item.children) {
    return (
      <div className={`admin-nav-group ${open ? 'open' : ''} ${groupActive ? 'active' : ''}`}>
        <button
          type="button"
          className="admin-nav-item admin-nav-group-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <span className="admin-nav-icon"><Icon name={item.icon as any} size={17} /></span>
          <span className="admin-nav-label">{item.label}</span>
          <span className="admin-nav-chevron">
            <Icon name={open ? 'chevron-down' : 'chevron-right'} size={14} />
          </span>
        </button>

        <div className="admin-nav-children" hidden={!open}>
          {item.children.map((child, i) => (
            <Link
              key={i}
              href={child.href!}
              className={`admin-nav-item admin-nav-child ${isActive(child.href) ? 'is-active' : ''}`}
            >
              <span className="admin-nav-icon"><Icon name={child.icon as any} size={15} /></span>
              <span className="admin-nav-label">{child.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={`admin-nav-item ${isActive(item.href) ? 'is-active' : ''}`}
    >
      <span className="admin-nav-icon"><Icon name={item.icon as any} size={17} /></span>
      <span className="admin-nav-label">{item.label}</span>
    </Link>
  );
}
