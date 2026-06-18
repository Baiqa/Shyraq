import Link from 'next/link';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import AuthButton from './AuthButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-light-bg dark:bg-dark-bg border-b border-light-divider dark:border-dark-divider">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-light-text dark:text-dark-text">
              PULSE
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs">
            <SearchBar />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <AuthButton />
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
