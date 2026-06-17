'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-xs">
      <div className="relative">
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 text-sm font-sans rounded bg-light-divider dark:bg-dark-divider text-light-text dark:text-dark-text placeholder-light-secondary dark:placeholder-dark-secondary border-none focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-secondary dark:text-dark-secondary hover:text-accent transition-colors"
        >
          🔍
        </button>
      </div>
    </form>
  );
}
