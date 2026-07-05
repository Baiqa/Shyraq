export interface TrendingRepo {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
}

export async function fetchTrendingRepos(revalidateSec = 3600): Promise<TrendingRepo[]> {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', `created:>${since}`);
    url.searchParams.set('sort', 'stars');
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', '6');

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: revalidateSec },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.items || []).map((repo: any) => ({
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
    }));
  } catch (error) {
    console.error('Error fetching GitHub trending repos:', error);
    return [];
  }
}
