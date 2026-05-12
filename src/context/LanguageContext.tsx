'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'hi' | 'en';
const LangCtx = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'hi', toggle: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('ru_lang') as Lang | null;
    if (saved === 'en' || saved === 'hi') setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('ru_lang', lang);
  }, [lang]);

  const toggle = () => setLang(l => (l === 'hi' ? 'en' : 'hi'));
  return <LangCtx.Provider value={{ lang, toggle }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
