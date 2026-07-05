import type { Article } from '../types';

export interface TickerItem {
  id: string;
  title: string;
  source: string;
}

export function getBreakingTickerItems(articles: Article[], limit = 8): TickerItem[] {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
    .map((a) => ({ id: a.id, title: a.title, source: a.source }));
}
