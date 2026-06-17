import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)'],
        sans: ['var(--font-inter)'],
        mono: ['var(--font-inter-mono)'],
      },
      colors: {
        light: {
          bg: '#FFFFFF',
          text: '#111111',
          secondary: '#6B7280',
          divider: '#E5E7EB',
        },
        dark: {
          bg: '#0F0F0F',
          card: '#1A1A1A',
          text: '#FFFFFF',
          secondary: '#D1D5DB',
          divider: '#333333',
        },
        accent: '#2563EB',
        'fresh': '#2563EB',
        'stale': '#6B7280',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideIn: 'slideIn 0.3s ease-in-out',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
