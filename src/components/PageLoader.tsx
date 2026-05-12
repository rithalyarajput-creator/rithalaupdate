'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function LoaderInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), 900);
    return () => clearTimeout(t);
  }, [pathname, search]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#') || a.target === '_blank') return;
      setActive(true);
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (!active) return null;

  return (
    <div className="pl-wrap" aria-hidden="true">
      {/* Top progress bar */}
      <div className="pl-bar" />

      {/* Swords orb — bottom right corner */}
      <div className="pl-orb">
        <svg className="pl-swords-scene" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Sparks */}
          <circle className="pl-spark pl-spark-1" cx="100" cy="100" r="3" fill="#FFD700" />
          <circle className="pl-spark pl-spark-2" cx="100" cy="100" r="2.5" fill="#FFD700" />
          <circle className="pl-spark pl-spark-3" cx="100" cy="100" r="2.5" fill="#FFD700" />
          <circle className="pl-spark pl-spark-4" cx="100" cy="100" r="2.5" fill="#FF8C00" />
          <circle className="pl-spark pl-spark-5" cx="100" cy="100" r="3.5" fill="#FFD700" />

          {/* Left sword */}
          <g className="pl-sword-left">
            <polygon points="100,10 108,130 92,130" fill="#b91c1c" />
            <polygon points="100,10 104,70 100,70" fill="rgba(255,255,255,0.3)" />
            <rect x="70" y="126" width="60" height="13" rx="2" fill="#7c0d0d" />
            <rect x="62" y="128" width="12" height="9" rx="2" fill="#7c0d0d" />
            <rect x="126" y="128" width="12" height="9" rx="2" fill="#7c0d0d" />
            <rect x="93" y="139" width="14" height="42" rx="4" fill="#92400e" />
            <circle cx="100" cy="188" r="10" fill="#7c0d0d" />
            <circle cx="100" cy="188" r="5" fill="#b45309" />
          </g>

          {/* Right sword */}
          <g className="pl-sword-right">
            <polygon points="100,10 108,130 92,130" fill="#b91c1c" />
            <polygon points="100,10 104,70 100,70" fill="rgba(255,255,255,0.3)" />
            <rect x="70" y="126" width="60" height="13" rx="2" fill="#7c0d0d" />
            <rect x="62" y="128" width="12" height="9" rx="2" fill="#7c0d0d" />
            <rect x="126" y="128" width="12" height="9" rx="2" fill="#7c0d0d" />
            <rect x="93" y="139" width="14" height="42" rx="4" fill="#92400e" />
            <circle cx="100" cy="188" r="10" fill="#7c0d0d" />
            <circle cx="100" cy="188" r="5" fill="#b45309" />
          </g>
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
