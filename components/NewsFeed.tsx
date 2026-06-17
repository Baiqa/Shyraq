import { Article } from '@/lib/types';
import NewsCard from './NewsCard';

interface NewsFeedProps {
  articles: Article[];
  loading?: boolean;
}

export default function NewsFeed({ articles, loading = false }: NewsFeedProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 md:h-32 bg-light-divider dark:bg-dark-card rounded animate-pulse"
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
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {articles.map((article, index) => (
        <div key={article.id || index} className="relative">
          <NewsCard article={article} />
        </div>
      ))}
    </div>
  );
}
