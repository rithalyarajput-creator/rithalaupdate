// Admin shell — sidebar navigation + content area.
// Auth check is delegated to middleware.ts for /admin/* (excluding login).

import Link from 'next/link';

export const metadata = {
  title: 'Admin — Rithala Update',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
