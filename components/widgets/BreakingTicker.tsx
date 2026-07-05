import Link from 'next/link';
import type { TickerItem } from '@/lib/widgets/breakingTicker';

interface BreakingTickerProps {
  items: TickerItem[];
}

export default function BreakingTicker({ items }: BreakingTickerProps) {
  if (items.length === 0) return null;

  // Duplicate items so the CSS marquee can loop seamlessly.
  const loopItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden bg-light-bg dark:bg-dark-card border border-light-divider dark:border-dark-divider rounded py-2">
      <div className="flex gap-10 whitespace-nowrap animate-marquee w-max">
        {loopItems.map((item, i) => (
          <Link
            key={`${item.id}-${i}`}
            href={`/article/${item.id}`}
            className="text-sm font-mono text-light-text dark:text-dark-text hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2"
          >
            <span className="text-rose-600 dark:text-rose-400 font-semibold mr-2">●</span>
            {item.title}
            <span className="text-light-secondary dark:text-dark-secondary ml-2">
              — {item.source}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
