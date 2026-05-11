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
        <span className="pl-tarla pl-tarla-1"></span>
        <span className="pl-tarla pl-tarla-2"></span>
        <span className="pl-tarla pl-tarla-3"></span>
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
