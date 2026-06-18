'use client';

import { useEffect, useState } from 'react';

interface AISummaryProps {
  articleId: string;
}

export default function AISummary({ articleId }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(`/api/articles/${articleId}/summarize`);
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        const data = await response.json();
        setSummary(data.summary);
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError('Could not generate summary');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [articleId]);

  if (loading) {
    return (
      <div className="mb-8 p-4 bg-light-bg dark:bg-dark-card rounded border border-light-divider dark:border-dark-divider">
        <div className="space-y-3">
          <div className="h-4 bg-light-divider dark:bg-dark-divider rounded w-full animate-pulse"></div>
          <div className="h-4 bg-light-divider dark:bg-dark-divider rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-light-divider dark:bg-dark-divider rounded w-4/6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return null;
  }

  return (
    <div className="mb-8 p-4 bg-accent/5 dark:bg-accent/10 rounded border border-accent/20 dark:border-accent/30">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-accent mb-2">
        AI Summary
      </h3>
      <p className="text-light-text dark:text-dark-text leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
