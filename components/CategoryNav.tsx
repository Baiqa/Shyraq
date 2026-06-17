'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Category } from '@/lib/types';

const categories: { label: string; slug: Category }[] = [
  { label: 'All', slug: 'all' },
  { label: 'Tech', slug: 'technology' },
  { label: 'Business', slug: 'business' },
  { label: 'Sports', slug: 'sports' },
  { label: 'World', slug: 'general' },
  { label: 'Science', slug: 'science' },
];

export default function CategoryNav() {
  const pathname = usePathname();

  const isActive = (slug: Category) => {
    if (slug === 'all') {
      return pathname === '/';
    }
    return pathname === `/category/${slug}`;
  };

  return (
    <nav className="flex gap-6 overflow-x-auto pb-2 mb-8 border-b border-light-divider dark:border-dark-divider">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={cat.slug === 'all' ? '/' : `/category/${cat.slug}`}
          className={`whitespace-nowrap px-2 py-2 text-sm font-sans font-semibold transition-colors ${
            isActive(cat.slug)
              ? 'text-accent border-b-2 border-accent'
              : 'text-light-secondary dark:text-dark-secondary hover:text-accent'
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  );
}
