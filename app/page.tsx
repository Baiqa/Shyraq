import { Suspense } from 'react';
import CategoryNav from '@/components/CategoryNav';
import HeroCard from '@/components/HeroCard';
import NewsFeed from '@/components/NewsFeed';
import { fetchNewsAPI } from '@/lib/newsapi';
import { fetchGuardian } from '@/lib/guardian';
import { mergeFeeds, sortArticlesByDate } from '@/lib/mergeFeeds';
import { syncArticlesToDb } from '@/lib/syncArticles';

async function getArticles(language: string = 'en') {
  try {
    // Fetch from both APIs
    const [newsApiArticles, guardianArticles] = await Promise.all([
      fetchNewsAPI('all', language === 'ru' ? 'ru' : 'en', 20),
      language === 'en' ? fetchGuardian('all', 'en', 10) : Promise.resolve([]),
    ]);

    // Merge and sort
    const allArticles = mergeFeeds([newsApiArticles, guardianArticles]);
    return sortArticlesByDate(allArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const language = (searchParams.lang as string) || 'en';
  const articles = await getArticles(language);

  // Sync articles to Supabase in background (fire-and-forget)
  syncArticlesToDb(articles);

  const heroArticles = articles.slice(0, 2);
  const feedArticles = articles.slice(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Hero Section */}
      {heroArticles.length > 0 && (
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {heroArticles.map((article) => (
              <HeroCard key={article.id} article={article} featured />
            ))}
          </div>
        </section>
      )}

      {/* News Feed */}
      <section>
        <h2 className="text-xl md:text-2xl font-display font-bold text-light-text dark:text-dark-text mb-8 uppercase tracking-wide">
          Latest News
        </h2>
        <Suspense fallback={<div>Loading news...</div>}>
          <NewsFeed articles={feedArticles} />
        </Suspense>
      </section>
    </div>
  );
}
