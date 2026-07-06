import { createServiceRoleClient } from '@/lib/supabase/server';
import { Article } from '@/lib/types';

/**
 * Upsert fetched articles into Supabase (service-role, bypasses RLS).
 * Runs server-side only — never expose this over an unauthenticated HTTP route.
 * Fire-and-forget friendly: swallows errors and returns instead of throwing.
 */
export async function syncArticlesToDb(articles: Article[]): Promise<void> {
  if (!Array.isArray(articles) || articles.length === 0) {
    return;
  }

  try {
    const supabase = await createServiceRoleClient();

    const rows = articles.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      image_url: article.image,
      source_url: article.url,
      source_name: article.source,
      category: article.category || 'general',
      published_at: article.publishedAt,
      language: 'en', // Default to English; expand if language is tracked per article
    }));

    // On conflict keep the existing row (never overwrite already-synced articles).
    const { error } = await supabase
      .from('articles')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('syncArticlesToDb upsert error:', error);
    }
  } catch (err) {
    console.error('syncArticlesToDb error:', err);
  }
}
