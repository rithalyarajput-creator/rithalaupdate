'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/context/LanguageContext';

interface Props {
  hi: string;
  en: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function BiText({ hi, en, as: Tag = 'span', className }: Props) {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  // Before hydration show Hindi (matches server render) to avoid mismatch
  const text = mounted && lang === 'en' ? en : hi;
  return <Tag className={className}>{text}</Tag>;
}
