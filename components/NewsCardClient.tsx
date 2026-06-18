'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getTimeDifference } from '@/lib/mergeFeeds';
import FreshnessBar from './FreshnessBar';
import SaveButton from './SaveButton';

interface NewsCardClientProps {
  article: Article;
}

export default function NewsCardClient({ article }: NewsCardClientProps) {
  const timeDiff = getTimeDifference(article.publishedAt);
  const timeString = `${timeDiff.value} ${timeDiff.unit}${timeDiff.value > 1 ? 's' : ''} ago`;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link href={`/article/${article.id}`}>
      <article className="group relative flex gap-4 p-4 bg-light-bg dark:bg-dark-card rounded border border-light-divider dark:border-dark-divider hover:border-accent transition-all hover:shadow-sm cursor-pointer animate-slideIn">
        {/* Save Button - Top Right */}
        <div className="absolute top-4 right-4 z-10" onClick={handleSaveClick}>
          <SaveButton articleId={article.id} redirectTo={`/article/${article.id}`} />
        </div>

        {/* Thumbnail */}
        {article.image && (
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative overflow-hidden rounded bg-light-divider dark:bg-dark-divider">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 96px, 128px"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-display font-bold text-base md:text-lg text-light-text dark:text-dark-text line-clamp-3 group-hover:text-accent transition-colors">
              {article.title}
            </h3>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between pt-2 text-xs md:text-sm font-mono text-light-secondary dark:text-dark-secondary">
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
