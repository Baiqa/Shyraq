'use client';

import { useEffect, useState } from 'react';
import { Theme } from '@/lib/types';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <button
        className="p-2 rounded hover:bg-light-divider dark:hover:bg-dark-divider transition-colors"
        disabled
      >
        <span className="text-light-text dark:text-dark-text text-sm font-sans">◐</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded hover:bg-light-divider dark:hover:bg-dark-divider transition-colors"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="text-light-text dark:text-dark-text text-sm font-sans">
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
