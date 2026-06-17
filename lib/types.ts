export type Category = 'all' | 'technology' | 'business' | 'sports' | 'general' | 'science';

export interface Article {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  image: string | null;
  url: string;
  source: string;
  author: string | null;
  publishedAt: string;
  category?: Category;
}

export interface FetchedArticles {
  articles: Article[];
  totalResults: number;
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ru';
