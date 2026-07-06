import { notFound } from 'next/navigation';
import CategoryNav from '@/components/CategoryNav';
import NewsFeed from '@/components/NewsFeed';
import { searchGuardian } from '@/lib/guardian';
import { mergeFeeds, sortArticlesByDate } from '@/lib/mergeFeeds';
import { syncArticlesToDb } from '@/lib/syncArticles';

async function searchArticles(query: string, _language: string = 'en') {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    // Guardian-only: the sole free source with legally reusable full text.
    const guardianResults = await searchGuardian(query, 'en', 30);

    const allArticles = mergeFeeds([guardianResults]);
    return sortArticlesByDate(allArticles);
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

export const revalidate = 300;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.q as string | undefined;
  const language = (searchParams.lang as string) || 'en';

  if (!query) {
    notFound();
  }

  const articles = await searchArticles(query, language);

  // Sync articles to Supabase in background (fire-and-forget)
  syncArticlesToDb(articles);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Search Title */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-light-text dark:text-dark-text mb-2">
          Search Results
        </h1>
        <p className="text-light-secondary dark:text-dark-secondary font-sans">
          Found {articles.length} result{articles.length !== 1 ? 's' : ''} for{' '}
          <span className="font-semibold text-accent">"{query}"</span>
        </p>
      </div>

      {/* Results Feed */}
      <section>
        <NewsFeed articles={articles} />
      </section>
    </div>
  );
}
