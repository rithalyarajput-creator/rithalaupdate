'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function LoaderInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState(false);

  // Show loader briefly on every route change so the page never feels
  // 'gone' while Next.js fetches the next server render.
  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), 700);
    return () => clearTimeout(t);
  }, [pathname, search]);

  // Intercept link clicks for instant feedback before the actual nav fires
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('#')) return;
      if (a.target === '_blank') return;
      // Same-origin in-app navigation — show loader
      setActive(true);
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (!active) return null;

  return (
    <div className="page-loader" aria-hidden="true">
      <div className="page-loader-bar"></div>
      <div className="page-loader-orb">
        <svg className="pl-swords" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6 2 2-6 6-2-2m-9-4l3 3-2 2-3-3 2-2m5.5-1.5L8 12l2-2 1.5 1.5-2 2M9.5 6.5L11 5l8 8-1.5 1.5-8-8z" />
        </svg>
      </div>
    </div>
  );
}

export default function PageLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderInner />
    </Suspense>
  );
}
