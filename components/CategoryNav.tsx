'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/categories';
import { Category } from '@/lib/types';

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
      {categories.map((cat) => {
        const Icon = cat.icon;
        const active = isActive(cat.slug);
        return (
          <Link
            key={cat.slug}
            href={cat.slug === 'all' ? '/' : `/category/${cat.slug}`}
            className={`flex items-center gap-1.5 whitespace-nowrap px-2 py-2 text-sm font-sans font-semibold transition-colors ${
              active
                ? `${cat.accentClass} border-b-2 ${cat.accentBorderClass}`
                : 'text-light-secondary dark:text-dark-secondary hover:text-accent'
            }`}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </Link>
        );
      })}
    </nav>
  );
}
