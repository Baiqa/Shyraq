import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

// Note: For Inter Mono, we'll use the regular Inter as fallback
// since next/font doesn't have a direct Inter Mono export
const interMono = Inter({
  subsets: ['latin'],
  variable: '--font-inter-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PULSE - Premium News Aggregator',
  description: 'Stay informed with curated news from top sources worldwide',
  keywords: ['news', 'aggregator', 'technology', 'business', 'sports'],
  authors: [{ name: 'Shyraq' }],
  openGraph: {
    title: 'PULSE - Premium News Aggregator',
    description: 'Stay informed with curated news from top sources worldwide',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0F0F0F" media="(prefers-color-scheme: dark)" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${interMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
          {children}
        </main>
        <footer className="bg-light-divider dark:bg-dark-card border-t border-light-divider dark:border-dark-divider py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-light-secondary dark:text-dark-secondary text-sm font-sans">
            <p>&copy; 2024 PULSE. Powered by NewsAPI and The Guardian Open Platform.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
