const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League
const POPULAR_LEAGUE_IDS = [39, 140, 135, 78, 61, 2];

export interface Fixture {
  id: number;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}

export async function fetchLiveFixtures(revalidateSec = 1800): Promise<Fixture[] | null> {
  if (!API_FOOTBALL_KEY) {
    console.error('API_FOOTBALL_KEY is not set');
    return null;
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = new URL(`${BASE_URL}/fixtures`);
    url.searchParams.set('date', today);

    const response = await fetch(url.toString(), {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY },
      next: { revalidate: revalidateSec },
    });

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.status}`);
    }

    const data = await response.json();

    const fixtures: Fixture[] = (data.response || [])
      .filter((f: any) => POPULAR_LEAGUE_IDS.includes(f.league?.id))
      .slice(0, 8)
      .map((f: any) => ({
        id: f.fixture.id,
        league: f.league.name,
        homeTeam: f.teams.home.name,
        awayTeam: f.teams.away.name,
        homeScore: f.goals.home,
        awayScore: f.goals.away,
        status: f.fixture.status.short,
      }));

    return fixtures.length > 0 ? fixtures : null;
  } catch (error) {
    console.error('Error fetching from API-Football:', error);
    return null;
  }
}
