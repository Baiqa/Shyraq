import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getTimeDifference } from '@/lib/mergeFeeds';
import FreshnessBar from './FreshnessBar';

interface HeroCardProps {
  article: Article;
  featured?: boolean;
}

export default function HeroCard({ article, featured = false }: HeroCardProps) {
  const timeDiff = getTimeDifference(article.publishedAt);
  const timeString = `${timeDiff.value} ${timeDiff.unit}${timeDiff.value > 1 ? 's' : ''} ago`;

  return (
    <Link href={article.url} target="_blank" rel="noopener noreferrer">
      <article className="group h-96 md:h-[500px] relative overflow-hidden rounded bg-light-divider dark:bg-dark-card border border-light-divider dark:border-dark-divider hover:border-accent transition-all cursor-pointer">
        {/* Background Image */}
        {article.image && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
          <h2 className="font-display font-bold text-2xl md:text-4xl text-white mb-3 md:mb-4 line-clamp-3 group-hover:text-accent transition-colors">
            {article.title}
          </h2>

          {article.description && (
            <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2 hidden md:block">
              {article.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-xs md:text-sm font-mono text-gray-300">
            <span className="truncate">{article.source}</span>
            <span className="flex-shrink-0">{timeString}</span>
          </div>
        </div>

        {/* Freshness Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <FreshnessBar publishedAt={article.publishedAt} />
        </div>
      </article>
    </Link>
  );
}
