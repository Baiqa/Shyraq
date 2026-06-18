import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getTimeDifference } from '@/lib/mergeFeeds';
import FreshnessBar from './FreshnessBar';
import NewsCardClient from './NewsCardClient';

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  return <NewsCardClient article={article} />;
}
