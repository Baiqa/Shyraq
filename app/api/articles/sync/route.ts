import { createServiceRoleClient } from '@/lib/supabase/server';
import { Article } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const articles: Article[] = await request.json();

    if (!Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles provided' },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Prepare articles data for insertion/upsert
    const articlesToSync = articles.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      image_url: article.image,
      source_url: article.url,
      source_name: article.source,
      category: article.category || 'general',
      published_at: article.publishedAt,
      language: 'en', // Default to English; expand this if you track language per article
    }));

    // Upsert articles (on conflict, do nothing - don't overwrite existing rows)
    const { data, error } = await supabase
      .from('articles')
      .upsert(articlesToSync, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json(
        { error: 'Failed to sync articles' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      synced: articlesToSync.length,
    });
  } catch (err) {
    console.error('Sync route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
