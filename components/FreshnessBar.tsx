'use client';

import { interpolateFreshnessColor } from '@/lib/mergeFeeds';
import { useEffect, useState } from 'react';

interface FreshnessBarProps {
  publishedAt: string;
}

export default function FreshnessBar({ publishedAt }: FreshnessBarProps) {
  const [color, setColor] = useState('rgb(37, 99, 235)');

  useEffect(() => {
    setColor(interpolateFreshnessColor(publishedAt));

    // Update color periodically
    const interval = setInterval(() => {
      setColor(interpolateFreshnessColor(publishedAt));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [publishedAt]);

  return (
    <div
      className="h-1 w-full transition-colors duration-300"
      style={{ backgroundColor: color }}
      title={`Published: ${new Date(publishedAt).toLocaleString()}`}
    />
  );
}
