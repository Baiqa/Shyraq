import { createClient } from '@/lib/supabase/server';
import { Article } from '@/lib/types';

export async function getRelatedArticles(
  article: any,
  limit: number = 5
): Promise<Article[]> {
  const supabase = await createClient();

  // Query articles with the same category, excluding the current article
  const { data: relatedArticles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', article.category)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }

  // Transform database results to Article type
  return (relatedArticles || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    content: item.content,
    image: item.image_url,
    url: item.source_url,
    source: item.source_name,
    author: null,
    publishedAt: item.published_at,
    category: item.category,
  }));
}
