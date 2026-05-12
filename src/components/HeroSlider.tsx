'use client';

import { useEffect, useState } from 'react';

const IMAGES = [
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401739643-rithala-village-990-bus-stand-banner.jpg-2-XLI4otRnMtLUBhErG2AC1lqz3yPUJ4.png',
    alt: 'Rithala Village 990 Bus Stand',
  },
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401736707-rithala-gaon-krishi-parivartan-1981-2011.jpg-CRr6fnnM9nyWXqF4TN0M14qbBDzhbF.png',
    alt: 'Rithala Gaon Krishi Parivartan 1981-2011',
  },
  {
    src: 'https://9qidomuaf1nvlbrh.public.blob.vercel-storage.com/uploads/1778401734203-shri-jageshwar-nath-katyayani-dham-rithala-village-history-2002-2013-2025-banner.jpg-p4FKSwgKMCY4IYPWvjYa2G2JHTCHqG.png',
    alt: 'Shri Jageshwar Nath Katyayani Dham Rithala',
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="heritage-banner-wrap">
      {IMAGES.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className={`heritage-banner-img${i === index ? ' active' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}
