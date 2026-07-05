import { fetchStockSnapshot } from '@/lib/widgets/twelveData';
import StockChart from './StockChart';

export default async function StockTickerWidget() {
  const series = await fetchStockSnapshot();

  return (
    <div className="bg-light-bg dark:bg-dark-card border border-light-divider dark:border-dark-divider rounded p-4">
      <h3 className="font-display font-bold text-sm uppercase tracking-wide text-light-secondary dark:text-dark-secondary mb-4">
        Markets
      </h3>

      {!series ? (
        <p className="text-sm text-light-secondary dark:text-dark-secondary">
          Market data unavailable
        </p>
      ) : (
        <div className="space-y-4">
          {series.map((s) => (
            <div key={s.symbol}>
              <div className="flex items-center justify-between text-sm font-mono mb-1">
                <span className="font-semibold text-light-text dark:text-dark-text">
                  {s.symbol}
                </span>
                <span
                  className={
                    s.changePercent >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }
                >
                  {s.latest.toFixed(2)} ({s.changePercent >= 0 ? '+' : ''}
                  {s.changePercent.toFixed(2)}%)
                </span>
              </div>
              <StockChart series={s} color={s.changePercent >= 0 ? '#10b981' : '#ef4444'} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
