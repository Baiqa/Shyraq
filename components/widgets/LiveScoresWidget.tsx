import { fetchLiveFixtures } from '@/lib/widgets/apiFootball';

export default async function LiveScoresWidget() {
  const fixtures = await fetchLiveFixtures();

  return (
    <div className="bg-light-bg dark:bg-dark-card border border-light-divider dark:border-dark-divider rounded p-4">
      <h3 className="font-display font-bold text-sm uppercase tracking-wide text-light-secondary dark:text-dark-secondary mb-3">
        Today&apos;s Scores
      </h3>

      {!fixtures ? (
        <p className="text-sm text-light-secondary dark:text-dark-secondary">
          Scores unavailable
        </p>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-1">
          {fixtures.map((f) => (
            <div key={f.id} className="flex-shrink-0 text-sm font-mono whitespace-nowrap">
              <div className="text-xs text-light-secondary dark:text-dark-secondary">
                {f.league}
              </div>
              <div className="text-light-text dark:text-dark-text">
                {f.homeTeam} {f.homeScore ?? '-'} : {f.awayScore ?? '-'} {f.awayTeam}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
