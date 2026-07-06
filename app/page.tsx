import { Suspense } from 'react';
import CategoryNav from '@/components/CategoryNav';
import HeroCard from '@/components/HeroCard';
import NewsFeed from '@/components/NewsFeed';
import { fetchGuardian } from '@/lib/guardian';
import { mergeFeeds, sortArticlesByDate } from '@/lib/mergeFeeds';
import { syncArticlesToDb } from '@/lib/syncArticles';

async function getArticles(_language: string = 'en') {
  try {
    // The Guardian is the only source that legally serves full article text on
    // its free tier, so we can render the story on our own site. mergeFeeds is
    // kept for when additional legal sources are added.
    const guardianArticles = await fetchGuardian('all', 'en', 30);

    const allArticles = mergeFeeds([guardianArticles]);
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

  const leadArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  const feedArticles = articles.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Hero Section: one dominant lead + stacked secondary stories */}
      {leadArticle && (
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className={secondaryArticles.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <HeroCard article={leadArticle} variant="lead" />
            </div>
            {secondaryArticles.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 lg:h-[500px]">
                {secondaryArticles.map((article) => (
                  <HeroCard key={article.id} article={article} variant="secondary" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* News Feed */}
      <section>
        <h2 className="text-xl md:text-2xl font-display font-bold text-light-text dark:text-dark-text mb-8 uppercase tracking-wide">
          Latest News
        </h2>
        <Suspense fallback={<NewsFeed articles={[]} loading layout="grid" />}>
          <NewsFeed articles={feedArticles} layout="grid" />
        </Suspense>
      </section>
    </div>
  );
}
