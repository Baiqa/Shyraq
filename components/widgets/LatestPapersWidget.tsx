import { fetchLatestPapers } from '@/lib/widgets/arxiv';

export default async function LatestPapersWidget() {
  const papers = await fetchLatestPapers();

  return (
    <div className="bg-light-bg dark:bg-dark-card border border-light-divider dark:border-dark-divider rounded p-4 md:p-6">
      <h3 className="font-display font-bold text-sm uppercase tracking-wide text-light-secondary dark:text-dark-secondary mb-4">
        Latest on arXiv
      </h3>

      {papers.length === 0 ? (
        <p className="text-sm text-light-secondary dark:text-dark-secondary">
          Papers unavailable
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map((paper) => (
            <a
              key={paper.id}
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded border border-light-divider dark:border-dark-divider hover:border-sky-600 dark:hover:border-sky-400 transition-colors"
            >
              <h4 className="font-semibold text-sm text-light-text dark:text-dark-text line-clamp-2 mb-1">
                {paper.title}
              </h4>
              <p className="text-xs text-light-secondary dark:text-dark-secondary truncate">
                {paper.authors.slice(0, 2).join(', ')}
                {paper.authors.length > 2 ? ' et al.' : ''}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
