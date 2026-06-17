import { Article, Category, Language } from './types';

const GUARDIAN_API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
const BASE_URL = 'https://content.guardianapis.com/search';

const categoryMap: Record<Category, string> = {
  all: 'news',
  technology: 'technology',
  business: 'business',
  sports: 'sport',
  general: 'news',
  science: 'science',
};

export async function fetchGuardian(
  category: Category = 'all',
  language: Language = 'en',
  pageSize: number = 20,
  page: number = 1
): Promise<Article[]> {
  if (!GUARDIAN_API_KEY) {
    console.error('NEXT_PUBLIC_GUARDIAN_API_KEY is not set');
    return [];
  }

  try {
    const guardianCategory = categoryMap[category];

    const url = new URL(BASE_URL);
    url.searchParams.append('section', guardianCategory);
    url.searchParams.append('page-size', String(pageSize));
    url.searchParams.append('page', String(page));
    url.searchParams.append('show-fields', 'thumbnail,byline,publication');
    url.searchParams.append('api-key', GUARDIAN_API_KEY);

    // Guardian API doesn't support Russian language natively through this method,
    // so we only fetch for English
    if (language === 'ru') {
      return [];
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.response?.results || []).map((article: any, index: number) => ({
      id: `guardian-${Date.now()}-${index}`,
      title: article.webTitle,
      description: null,
      content: null,
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
    console.error('NEXT_PUBLIC_GUARDIAN_API_KEY is not set');
    return [];
  }

  try {
    if (language === 'ru') {
      return [];
    }

    const url = new URL(BASE_URL);
    url.searchParams.append('q', query);
    url.searchParams.append('page-size', String(pageSize));
    url.searchParams.append('page', String(page));
    url.searchParams.append('show-fields', 'thumbnail,byline,publication');
    url.searchParams.append('api-key', GUARDIAN_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Guardian API search error: ${response.status}`);
    }

    const data = await response.json();

    return (data.response?.results || []).map((article: any, index: number) => ({
      id: `guardian-search-${Date.now()}-${index}`,
      title: article.webTitle,
      description: null,
      content: null,
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
