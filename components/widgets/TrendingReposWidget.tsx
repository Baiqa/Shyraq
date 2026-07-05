import { fetchTrendingRepos } from '@/lib/widgets/github';

export default async function TrendingReposWidget() {
  const repos = await fetchTrendingRepos();

  return (
    <div className="bg-light-bg dark:bg-dark-card border border-light-divider dark:border-dark-divider rounded p-4">
      <h3 className="font-display font-bold text-sm uppercase tracking-wide text-light-secondary dark:text-dark-secondary mb-3">
        Trending on GitHub
      </h3>

      {repos.length === 0 ? (
        <p className="text-sm text-light-secondary dark:text-dark-secondary">
          Trending repos unavailable
        </p>
      ) : (
        <ul className="space-y-3">
          {repos.map((repo) => (
            <li key={repo.fullName}>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <div className="font-semibold text-sm text-light-text dark:text-dark-text truncate">
                  {repo.fullName}
                </div>
                {repo.description && (
                  <p className="text-xs text-light-secondary dark:text-dark-secondary line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="text-xs font-mono text-light-secondary dark:text-dark-secondary mt-1">
                  ★ {repo.stars.toLocaleString()} {repo.language ? `· ${repo.language}` : ''}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
