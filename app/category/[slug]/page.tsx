import { notFound } from 'next/navigation';
import CategoryNav from '@/components/CategoryNav';
import HeroCard from '@/components/HeroCard';
import NewsFeed from '@/components/NewsFeed';
import BreakingTicker from '@/components/widgets/BreakingTicker';
import { fetchNewsAPI } from '@/lib/newsapi';
import { fetchGuardian } from '@/lib/guardian';
import { mergeFeeds, sortArticlesByDate } from '@/lib/mergeFeeds';
import { getBreakingTickerItems } from '@/lib/widgets/breakingTicker';
import { categories, getCategoryTheme } from '@/lib/categories';
import { Category } from '@/lib/types';

const validCategories: Category[] = categories.map((c) => c.slug);

async function getArticles(category: Category, language: string = 'en') {
  try {
    const [newsApiArticles, guardianArticles] = await Promise.all([
      fetchNewsAPI(category, language === 'ru' ? 'ru' : 'en', 20),
      language === 'en' ? fetchGuardian(category, 'en', 10) : Promise.resolve([]),
    ]);

    const allArticles = mergeFeeds([newsApiArticles, guardianArticles]);
    return sortArticlesByDate(allArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Fire-and-forget sync to Supabase (non-blocking)
async function syncArticles(articles: any[]) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/articles/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articles),
    });
  } catch (error) {
    console.error('Error syncing articles:', error);
  }
}

export const revalidate = 300;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = params.slug as Category;

  if (!validCategories.includes(category)) {
    notFound();
  }

  const theme = getCategoryTheme(category)!;
  const Icon = theme.icon;
  const Widget = theme.widget;

  const language = (searchParams.lang as string) || 'en';
  const articles = await getArticles(category, language);

  // Sync articles to Supabase in background
  syncArticles(articles);

  const heroArticles = articles.slice(0, 2);
  const feedArticles = articles.slice(2);
  const tickerItems = category === 'general' ? getBreakingTickerItems(articles) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Category Title */}
      <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-display font-bold text-light-text dark:text-dark-text mb-6">
        <Icon className={`w-7 h-7 md:w-8 md:h-8 ${theme.accentClass}`} />
        {theme.pageTitle}
      </h1>

      {/* Top-banner widget (Sports scores strip, General breaking ticker) */}
      {theme.widgetPlacement === 'top-banner' && (
        <section className="mb-8 md:mb-12">
          {category === 'general' ? <BreakingTicker items={tickerItems} /> : Widget && <Widget />}
        </section>
      )}

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

      {/* Below-hero widget (Science latest papers) */}
      {theme.widgetPlacement === 'below-hero' && Widget && (
        <section className="mb-12 md:mb-16">
          <Widget />
        </section>
      )}

      {/* News Feed (+ sidebar widget for Business/Technology) */}
      <section>
        <h2 className="text-xl md:text-2xl font-display font-bold text-light-text dark:text-dark-text mb-8 uppercase tracking-wide">
          More in {theme.pageTitle}
        </h2>
        {theme.widgetPlacement === 'sidebar' && Widget ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            <NewsFeed articles={feedArticles} />
            <aside>
              <Widget />
            </aside>
          </div>
        ) : (
          <NewsFeed articles={feedArticles} />
        )}
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    slug: category,
  }));
}
