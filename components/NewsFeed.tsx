import { Article } from '@/lib/types';
import NewsCard from './NewsCard';

interface NewsFeedProps {
  articles: Article[];
  loading?: boolean;
  layout?: 'list' | 'grid';
}

export default function NewsFeed({ articles, loading = false, layout = 'list' }: NewsFeedProps) {
  const isGrid = layout === 'grid';
  const containerClass = isGrid
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid grid-cols-1 gap-4 md:gap-6';

  if (loading) {
    return (
      <div className={containerClass}>
        {[...Array(isGrid ? 9 : 6)].map((_, i) => (
          <div
            key={i}
            className={`bg-light-divider dark:bg-dark-card rounded animate-pulse ${
              isGrid ? 'h-72' : 'h-24 md:h-32'
            }`}
          />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24">
        <p className="text-light-secondary dark:text-dark-secondary text-lg font-sans">
          No articles found. Try another search or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {articles.map((article, index) => (
        <div key={article.id || index} className="relative">
          <NewsCard article={article} variant={isGrid ? 'vertical' : 'horizontal'} />
        </div>
      ))}
    </div>
  );
}
