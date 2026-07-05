export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  url: string;
  published: string;
}

export async function fetchLatestPapers(
  category = 'cs.AI',
  revalidateSec = 1800
): Promise<ArxivPaper[]> {
  try {
    const url = new URL('https://export.arxiv.org/api/query');
    url.searchParams.set('search_query', `cat:${category}`);
    url.searchParams.set('sortBy', 'submittedDate');
    url.searchParams.set('sortOrder', 'descending');
    url.searchParams.set('max_results', '6');

    const response = await fetch(url.toString(), {
      next: { revalidate: revalidateSec },
    });

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status}`);
    }

    const xml = await response.text();
    return parseArxivFeed(xml);
  } catch (error) {
    console.error('Error fetching from arXiv:', error);
    return [];
  }
}

function parseArxivFeed(xml: string): ArxivPaper[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  return entries.map((entry) => {
    const id = extractTag(entry, 'id') || '';
    const title = (extractTag(entry, 'title') || '').replace(/\s+/g, ' ').trim();
    const summary = (extractTag(entry, 'summary') || '').replace(/\s+/g, ' ').trim();
    const published = extractTag(entry, 'published') || '';
    const authors = [...entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)].map((m) =>
      m[1].trim()
    );

    return { id, title, authors, summary, url: id, published };
  });
}

function extractTag(xml: string, tag: string): string | null {
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(xml);
  return match ? match[1].trim() : null;
}
