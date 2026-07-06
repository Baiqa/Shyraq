import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getTimeDifference } from '@/lib/mergeFeeds';
import FreshnessBar from './FreshnessBar';

interface HeroCardProps {
  article: Article;
  featured?: boolean;
  variant?: 'lead' | 'secondary';
}

export default function HeroCard({ article, featured = false, variant = 'lead' }: HeroCardProps) {
  const timeDiff = getTimeDifference(article.publishedAt);
  const timeString = `${timeDiff.value} ${timeDiff.unit}${timeDiff.value > 1 ? 's' : ''} ago`;
  const isLead = variant === 'lead';

  return (
    <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <article
        className={`group relative overflow-hidden rounded bg-light-divider dark:bg-dark-card border border-light-divider dark:border-dark-divider hover:border-accent transition-all cursor-pointer ${
          isLead ? 'h-96 md:h-[500px]' : 'h-64 lg:h-full'
        }`}
      >
        {/* Background Image */}
        {article.image && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes={isLead ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 50vw, 33vw'}
            priority={isLead}
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className={`absolute inset-0 flex flex-col justify-end ${isLead ? 'p-6 md:p-8' : 'p-4 md:p-5'}`}>
          <h2
            className={`font-display font-bold text-white line-clamp-3 group-hover:text-accent transition-colors ${
              isLead ? 'text-2xl md:text-4xl mb-3 md:mb-4' : 'text-lg md:text-xl mb-2'
            }`}
          >
            {article.title}
          </h2>

          {isLead && article.description && (
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
