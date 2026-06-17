import { Article, Category, Language } from './types';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const categoryMap: Record<Category, string> = {
  all: 'general',
  technology: 'technology',
  business: 'business',
  sports: 'sports',
  general: 'general',
  science: 'science',
};

export async function fetchNewsAPI(
  category: Category = 'all',
  language: Language = 'en',
  pageSize: number = 20,
  page: number = 1
): Promise<Article[]> {
  if (!NEWS_API_KEY) {
    console.error('NEXT_PUBLIC_NEWS_API_KEY is not set');
    return [];
  }

  try {
    const apiCategory = categoryMap[category];
    const lang = language === 'ru' ? 'ru' : 'us';

    const url = new URL(`${BASE_URL}/top-headlines`);
    url.searchParams.append('country', lang);
    url.searchParams.append('pageSize', String(pageSize));
    url.searchParams.append('page', String(page));
    url.searchParams.append('apiKey', NEWS_API_KEY);

    if (category !== 'all') {
      url.searchParams.set('category', apiCategory);
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();

    return (data.articles || []).map((article: any, index: number) => ({
      id: `newsapi-${Date.now()}-${index}`,
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.urlToImage,
      url: article.url,
      source: article.source?.name || 'News API',
      author: article.author,
      publishedAt: article.publishedAt,
      category,
    }));
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
}

export async function searchNewsAPI(
  query: string,
  language: Language = 'en',
  pageSize: number = 20,
  page: number = 1
): Promise<Article[]> {
  if (!NEWS_API_KEY) {
    console.error('NEXT_PUBLIC_NEWS_API_KEY is not set');
    return [];
  }

  try {
    const url = new URL(`${BASE_URL}/everything`);
    url.searchParams.append('q', query);
    url.searchParams.append('language', language === 'ru' ? 'ru' : 'en');
    url.searchParams.append('pageSize', String(pageSize));
    url.searchParams.append('page', String(page));
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('apiKey', NEWS_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`NewsAPI search error: ${response.status}`);
    }

    const data = await response.json();

    return (data.articles || []).map((article: any, index: number) => ({
      id: `newsapi-search-${Date.now()}-${index}`,
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.urlToImage,
      url: article.url,
      source: article.source?.name || 'News API',
      author: article.author,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error('Error searching NewsAPI:', error);
    return [];
  }
}
