import { Article, Category, Language } from './types';

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
const BASE_URL = 'https://content.guardianapis.com/search';

const categoryMap: Record<Category, string> = {
  all: 'news',
  technology: 'technology',
  business: 'business',
  sports: 'sport',
  general: 'news',
  science: 'science',
};

// Simple hash function for generating stable article IDs from URLs
function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// trailText can contain inline markup (<a>, <strong>); the feed/subtitle expect
// plain text, so strip tags. The full article HTML (`body`) is kept intact and
// sanitized at render time instead.
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function fetchGuardian(
  category: Category = 'all',
  language: Language = 'en',
  pageSize: number = 20,
  page: number = 1
): Promise<Article[]> {
  if (!GUARDIAN_API_KEY) {
    console.error('GUARDIAN_API_KEY is not set');
    return [];
  }

  try {
    // The Guardian does not have native Russian-language content in their API.
    if (language === 'ru') {
      return [];
    }

    const guardianCategory = categoryMap[category];

    const url = new URL(BASE_URL);
    url.searchParams.append('section', guardianCategory);
    url.searchParams.append('page-size', String(pageSize));
    url.searchParams.append('page', String(page));
    // trailText = article standfirst/summary, body = full article text as HTML.
    // The Guardian Open Platform licence permits displaying this content with attribution.
    url.searchParams.append('show-fields', 'thumbnail,byline,publication,trailText,body');
    url.searchParams.append('api-key', GUARDIAN_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.response?.results || []).map((article: any) => ({
      id: `guardian-${hashString(article.webUrl)}`,
      title: article.webTitle,
      description: article.fields?.trailText ? stripHtml(article.fields.trailText) : null,
      content: article.fields?.body || null,
      image: article.fields?.thumbnail || null,
      url: article.webUrl,
      source: 'The Guardian',
      author: article.fields?.byline || null,
      publishedAt: article.webPublicationDate,
      category,
    }));
  } catch (error) {
    console.error('Error fetching from Guardian API:', error);
    return [];
  }
}

export async function searchGuardian(
  query: string,
  language: Language = 'en',
  pageSize: number = 20,
  page: number = 1
): Promise<Article[]> {
  if (!GUARDIAN_API_KEY) {
    console.error('GUARDIAN_API_KEY is not set');
    return [];
  }

  try {
    // The Guardian does not have native Russian-language content in their API.
    if (language === 'ru') {
      return [];
    }

    const url = new URL(BASE_URL);
    url.searchParams.append('q', query);
    url.searchParams.append('page-size', String(pageSize));
    url.searchParams.append('page', String(page));
    url.searchParams.append('show-fields', 'thumbnail,byline,publication,trailText,body');
    url.searchParams.append('api-key', GUARDIAN_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Guardian API search error: ${response.status}`);
    }

    const data = await response.json();

    return (data.response?.results || []).map((article: any) => ({
      id: `guardian-${hashString(article.webUrl)}`,
      title: article.webTitle,
      description: article.fields?.trailText ? stripHtml(article.fields.trailText) : null,
      content: article.fields?.body || null,
      image: article.fields?.thumbnail || null,
      url: article.webUrl,
      source: 'The Guardian',
      author: article.fields?.byline || null,
      publishedAt: article.webPublicationDate,
    }));
  } catch (error) {
    console.error('Error searching Guardian API:', error);
    return [];
  }
}
