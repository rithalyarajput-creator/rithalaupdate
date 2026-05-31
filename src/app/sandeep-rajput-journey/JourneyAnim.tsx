'use client';
import { useEffect } from 'react';

export default function JourneyAnim() {
  useEffect(() => {
    const items = document.querySelectorAll('.jrn-item--anim');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('jrn-item--visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
