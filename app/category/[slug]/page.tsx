import { notFound } from 'next/navigation';
import CategoryNav from '@/components/CategoryNav';
import HeroCard from '@/components/HeroCard';
import NewsFeed from '@/components/NewsFeed';
import { fetchNewsAPI } from '@/lib/newsapi';
import { fetchGuardian } from '@/lib/guardian';
import { mergeFeeds, sortArticlesByDate } from '@/lib/mergeFeeds';
import { Category } from '@/lib/types';

const validCategories: Category[] = ['all', 'technology', 'business', 'sports', 'general', 'science'];

const categoryLabels: Record<Category, string> = {
  all: 'All News',
  technology: 'Technology',
  business: 'Business',
  sports: 'Sports',
  general: 'World',
  science: 'Science',
};

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

  const language = (searchParams.lang as string) || 'en';
  const articles = await getArticles(category, language);

  const heroArticles = articles.slice(0, 2);
  const feedArticles = articles.slice(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Category Title */}
      <h1 className="text-3xl md:text-4xl font-display font-bold text-light-text dark:text-dark-text mb-8 md:mb-12">
        {categoryLabels[category]}
      </h1>

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
          More in {categoryLabels[category]}
        </h2>
        <NewsFeed articles={feedArticles} />
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    slug: category,
  }));
}
