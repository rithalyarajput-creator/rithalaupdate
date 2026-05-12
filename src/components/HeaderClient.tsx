'use client';
import { useLang } from '@/context/LanguageContext';
import HeaderSearch from './HeaderSearch';

export default function HeaderClient() {
  const { lang, toggle } = useLang();

  return (
    <div className="header-controls">
      <HeaderSearch />
      <button
        type="button"
        onClick={toggle}
        className="lang-toggle-btn"
        aria-label="Toggle language"
        title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
      >
        <span className={`lang-opt ${lang === 'hi' ? 'lang-active' : ''}`}>हिं</span>
        <span className="lang-divider">|</span>
        <span className={`lang-opt ${lang === 'en' ? 'lang-active' : ''}`}>EN</span>
      </button>
    </div>
  );
}
