'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/lib/types';

export default function LanguageToggle() {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null;
    const initial = stored || 'en';
    setLanguage(initial);
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ru' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    // Trigger a page refresh or state update to fetch in new language
    window.location.reload();
  };

  if (!mounted) {
    return (
      <button className="px-3 py-2 text-sm font-sans rounded hover:bg-light-divider dark:hover:bg-dark-divider transition-colors" disabled>
        EN
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 text-sm font-sans rounded hover:bg-light-divider dark:hover:bg-dark-divider transition-colors text-light-text dark:text-dark-text"
      title={`Switch to ${language === 'en' ? 'Russian' : 'English'}`}
    >
      {language.toUpperCase()}
    </button>
  );
}
