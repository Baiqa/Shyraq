import { Article } from './types';

// Calculate string similarity using token overlap ratio (0 to 1)
function stringSimilarity(str1: string, str2: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/);

  const tokens1 = normalize(str1);
  const tokens2 = normalize(str2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return tokens1.length === tokens2.length ? 1 : 0;
  }

  const commonTokens = tokens1.filter(t => tokens2.includes(t)).length;
  const totalTokens = new Set([...tokens1, ...tokens2]).size;

  return commonTokens / totalTokens;
}

export function mergeFeeds(articles: Article[][]): Article[] {
  // Flatten all arrays
  const allArticles = articles.flat();

  // Deduplicate using similarity threshold (85%)
  const seen: Article[] = [];
  const SIMILARITY_THRESHOLD = 0.85;

  for (const article of allArticles) {
    let isDuplicate = false;

    for (let i = 0; i < seen.length; i++) {
      const similarity = stringSimilarity(article.title, seen[i].title);

      if (similarity >= SIMILARITY_THRESHOLD) {
        isDuplicate = true;
        // Keep the article with more complete content (prefer one with description)
        if (article.description && !seen[i].description) {
          seen[i] = article;
        }
        break;
      }
    }

    if (!isDuplicate) {
      seen.push(article);
    }
  }

  return seen;
}

export function sortArticlesByDate(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getTimeDifference(dateString: string): {
  value: number;
  unit: 'minute' | 'hour' | 'day';
  isRecent: boolean;
} {
  const publishedDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - publishedDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return { value: diffMinutes, unit: 'minute', isRecent: diffMinutes < 60 };
  } else if (diffHours < 24) {
    return { value: diffHours, unit: 'hour', isRecent: diffHours < 1 };
  } else {
    return { value: diffDays, unit: 'day', isRecent: false };
  }
}

export function getFreshnessColor(dateString: string): 'fresh' | 'stale' {
  const publishedDate = new Date(dateString);
  const now = new Date();
  const diffHours = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);

  // Fresh if less than 1 hour, stale if more than 12 hours
  return diffHours < 1 ? 'fresh' : 'stale';
}

export function interpolateFreshnessColor(dateString: string): string {
  const publishedDate = new Date(dateString);
  const now = new Date();
  const diffHours = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);

  // Clamp between 0 and 12 hours
  const progress = Math.min(diffHours / 12, 1);

  // Linear interpolation from #2563EB (fresh) to #6B7280 (stale)
  const startColor = [37, 99, 235]; // RGB for #2563EB
  const endColor = [107, 114, 128]; // RGB for #6B7280

  const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * progress);
  const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * progress);
  const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}
