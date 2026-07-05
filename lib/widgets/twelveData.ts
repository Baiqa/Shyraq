const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

export interface StockPoint {
  time: string;
  value: number;
}

export interface StockSeries {
  symbol: string;
  points: StockPoint[];
  latest: number;
  changePercent: number;
}

export async function fetchStockSnapshot(
  symbols: string[] = ['SPY', 'QQQ', 'AAPL'],
  revalidateSec = 300
): Promise<StockSeries[] | null> {
  if (!TWELVE_DATA_API_KEY) {
    console.error('TWELVE_DATA_API_KEY is not set');
    return null;
  }

  try {
    const url = new URL(`${BASE_URL}/time_series`);
    url.searchParams.set('symbol', symbols.join(','));
    url.searchParams.set('interval', '15min');
    url.searchParams.set('outputsize', '20');
    url.searchParams.set('apikey', TWELVE_DATA_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: revalidateSec },
    });

    if (!response.ok) {
      throw new Error(`Twelve Data error: ${response.status}`);
    }

    const data = await response.json();

    // A single-symbol request returns the series object directly instead of
    // nesting it under the symbol key like a multi-symbol request does.
    const seriesBySymbol: Record<string, any> =
      symbols.length === 1 ? { [symbols[0]]: data } : data;

    const result = symbols
      .map((symbol): StockSeries | null => {
        const series = seriesBySymbol[symbol];
        if (!series || series.status === 'error' || !Array.isArray(series.values)) {
          return null;
        }

        const points: StockPoint[] = [...series.values]
          .reverse()
          .map((v: any) => ({ time: v.datetime, value: parseFloat(v.close) }));

        if (points.length === 0) return null;

        const latest = points[points.length - 1].value;
        const first = points[0].value;
        const changePercent = first ? ((latest - first) / first) * 100 : 0;

        return { symbol, points, latest, changePercent };
      })
      .filter((s): s is StockSeries => s !== null);

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error('Error fetching from Twelve Data:', error);
    return null;
  }
}
