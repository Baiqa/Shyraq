import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, Trophy, Cpu, Microscope, Globe, Newspaper } from 'lucide-react';
import type { Category } from './types';
import StockTickerWidget from '@/components/widgets/StockTickerWidget';
import LiveScoresWidget from '@/components/widgets/LiveScoresWidget';
import TrendingReposWidget from '@/components/widgets/TrendingReposWidget';
import LatestPapersWidget from '@/components/widgets/LatestPapersWidget';

export type WidgetPlacement = 'sidebar' | 'top-banner' | 'below-hero';

export interface CategoryTheme {
  slug: Category;
  label: string;
  pageTitle: string;
  accentClass: string;
  accentBorderClass: string;
  accentBgClass: string;
  icon: LucideIcon;
  widget: ComponentType | null;
  widgetPlacement: WidgetPlacement | null;
}

export const categories: CategoryTheme[] = [
  {
    slug: 'all',
    label: 'All',
    pageTitle: 'All News',
    accentClass: 'text-accent',
    accentBorderClass: 'border-accent',
    accentBgClass: 'bg-accent',
    icon: Newspaper,
    widget: null,
    widgetPlacement: null,
  },
  {
    slug: 'technology',
    label: 'Tech',
    pageTitle: 'Technology',
    accentClass: 'text-violet-600 dark:text-violet-400',
    accentBorderClass: 'border-violet-600 dark:border-violet-400',
    accentBgClass: 'bg-violet-600 dark:bg-violet-400',
    icon: Cpu,
    widget: TrendingReposWidget,
    widgetPlacement: 'sidebar',
  },
  {
    slug: 'business',
    label: 'Business',
    pageTitle: 'Business',
    accentClass: 'text-emerald-600 dark:text-emerald-400',
    accentBorderClass: 'border-emerald-600 dark:border-emerald-400',
    accentBgClass: 'bg-emerald-600 dark:bg-emerald-400',
    icon: TrendingUp,
    widget: StockTickerWidget,
    widgetPlacement: 'sidebar',
  },
  {
    slug: 'sports',
    label: 'Sports',
    pageTitle: 'Sports',
    accentClass: 'text-orange-600 dark:text-orange-400',
    accentBorderClass: 'border-orange-600 dark:border-orange-400',
    accentBgClass: 'bg-orange-600 dark:bg-orange-400',
    icon: Trophy,
    widget: LiveScoresWidget,
    widgetPlacement: 'top-banner',
  },
  {
    slug: 'general',
    label: 'World',
    pageTitle: 'World',
    accentClass: 'text-rose-600 dark:text-rose-400',
    accentBorderClass: 'border-rose-600 dark:border-rose-400',
    accentBgClass: 'bg-rose-600 dark:bg-rose-400',
    icon: Globe,
    // BreakingTicker needs the page's already-fetched articles as a prop,
    // so it's rendered directly in page.tsx instead of through this generic slot.
    widget: null,
    widgetPlacement: 'top-banner',
  },
  {
    slug: 'science',
    label: 'Science',
    pageTitle: 'Science',
    accentClass: 'text-sky-600 dark:text-sky-400',
    accentBorderClass: 'border-sky-600 dark:border-sky-400',
    accentBgClass: 'bg-sky-600 dark:bg-sky-400',
    icon: Microscope,
    widget: LatestPapersWidget,
    widgetPlacement: 'below-hero',
  },
];

export function getCategoryTheme(slug: Category): CategoryTheme | undefined {
  return categories.find((c) => c.slug === slug);
}
