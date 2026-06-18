import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getTimeDifference } from '@/lib/mergeFeeds';
import AISummary from '@/components/AISummary';
import SaveButton from '@/components/SaveButton';
import NewsCard from '@/components/NewsCard';
import { getRelatedArticles } from '@/lib/relatedArticles';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !article) {
    notFound();
  }

  // Fetch related articles
  const relatedArticles = await getRelatedArticles(article, 5);

  const timeDiff = getTimeDifference(article.published_at);
  const timeString = `${timeDiff.value} ${timeDiff.unit}${timeDiff.value > 1 ? 's' : ''} ago`;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Hero Image */}
      {article.image_url && (
        <div className="mb-8 md:mb-10 w-full h-64 md:h-96 relative overflow-hidden rounded-lg">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Meta Information */}
      <div className="mb-6 flex items-center gap-3 text-sm text-light-secondary dark:text-dark-secondary font-mono">
        <span className="px-2.5 py-1 bg-accent/10 text-accent rounded font-semibold uppercase text-xs">
          {article.category}
        </span>
        <span>•</span>
        <span>{article.source_name}</span>
        <span>•</span>
        <span>{timeString}</span>
      </div>

      {/* Title */}
      <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-display font-bold text-light-text dark:text-dark-text leading-tight">
        {article.title}
      </h1>

      {/* Description / Subtitle */}
      {article.description && (
        <p className="mb-8 text-lg text-light-secondary dark:text-dark-secondary font-sans">
          {article.description}
        </p>
      )}

      {/* AI Summary Section (placeholder - will be filled by client component) */}
      <AISummary articleId={article.id} />

      {/* Main Content */}
      {article.content && (
        <div className="mb-10 prose dark:prose-invert max-w-none">
          <p className="text-base md:text-lg text-light-text dark:text-dark-text leading-relaxed whitespace-pre-wrap">
            {article.content}
          </p>
        </div>
      )}

      {/* Read Full Article Button */}
      <div className="mb-10 flex gap-4 items-center">
        <Link
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded hover:opacity-90 transition-opacity"
        >
          Read full article on {article.source_name} →
        </Link>
        <SaveButton articleId={article.id} redirectTo={`/article/${article.id}`} />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-light-text dark:text-dark-text mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((relatedArticle) => (
              <NewsCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <hr className="my-10 border-light-divider dark:border-dark-divider" />

      {/* Back to Home */}
      <Link
        href="/"
        className="text-accent hover:underline font-semibold transition-colors"
      >
        ← Back to News Feed
      </Link>
    </article>
  );
}
