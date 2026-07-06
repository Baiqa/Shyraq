import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = params.id;
    const supabase = await createClient();

    // 1. Check if summary already exists
    const { data: article, error: selectError } = await supabase
      .from('articles')
      .select('ai_summary, title, description, content')
      .eq('id', articleId)
      .single();

    if (selectError || !article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Return cached summary if it exists (available to everyone)
    if (article.ai_summary) {
      return NextResponse.json({
        summary: article.ai_summary,
        cached: true,
      });
    }

    // No cached summary — generating one costs money, so gate it.
    // Bail out gracefully (no summary) instead of throwing when generation
    // isn't possible/allowed; the client just renders nothing.
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ summary: null, cached: false });
    }

    // Only authenticated users may trigger a new (paid) generation. This keeps
    // anonymous traffic from burning the Anthropic key on a public deploy.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ summary: null, cached: false });
    }

    // 2. Generate summary using Anthropic
    const prompt = `Summarize this news article in 3-4 clear, neutral sentences. Do not add opinions or information not in the source text.

Title: ${article.title}
Description: ${article.description || ''}
Content: ${article.content || ''}`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const firstBlock = message.content[0];
    const summary =
      firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

    if (!summary) {
      return NextResponse.json({ summary: null, cached: false });
    }

    // 3. Save summary to database (using service role to bypass RLS)
    const serviceRoleClient = await createServiceRoleClient();
    await serviceRoleClient
      .from('articles')
      .update({ ai_summary: summary })
      .eq('id', articleId);

    return NextResponse.json({
      summary,
      cached: false,
    });
  } catch (error) {
    console.error('Summarize route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
