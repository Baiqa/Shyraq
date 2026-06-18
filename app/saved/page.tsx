import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CategoryNav from '@/components/CategoryNav';
import NewsFeed from '@/components/NewsFeed';

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?redirect=/saved');
  }

  // Fetch saved articles for this user
  const { data: savedArticles, error } = await supabase
    .from('saved_articles')
    .select('article_id, articles(*)')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved articles:', error);
  }

  // Transform data to match Article type
  const articles = (savedArticles || []).map((item: any) => {
    const article = item.articles;
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.image_url,
      url: article.source_url,
      source: article.source_name,
      author: null,
      publishedAt: article.published_at,
      category: article.category,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Category Navigation */}
      <CategoryNav />

      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-display font-bold text-light-text dark:text-dark-text mb-8 md:mb-12">
        Saved Articles
      </h1>

      {/* Saved Articles Feed */}
      {articles.length > 0 ? (
        <section>
          <NewsFeed articles={articles} />
        </section>
      ) : (
        <div className="text-center py-16">
          <p className="text-light-secondary dark:text-dark-secondary text-lg mb-4">
            No saved articles yet
          </p>
          <a
            href="/"
            className="text-accent hover:underline font-semibold transition-colors"
          >
            Browse news →
          </a>
        </div>
      )}
    </div>
  );
}
