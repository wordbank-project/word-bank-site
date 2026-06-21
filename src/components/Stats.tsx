import { useEffect, useState } from 'react';

type WordRow = { word: string; count: number };
type DayRow = { day: string; count: number };
type StatsData = { total: number; top: WordRow[]; perDay: DayRow[] };

/** Build an SVG polyline `points` string for the per-day sparkline. */
function sparklinePoints(perDay: DayRow[], width: number, height: number): string {
    if (perDay.length === 0) return '';
    const max = Math.max(1, ...perDay.map((d) => d.count));
    const stepX = perDay.length > 1 ? width / (perDay.length - 1) : 0;
    return perDay
        .map((d, i) => {
            const x = perDay.length > 1 ? i * stepX : width / 2;
            const y = height - (d.count / max) * height;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');
}

/**
 * Live stats from the words feed server: total words collected, the most-saved
 * word, and a per-day sparkline. Renders nothing unless VITE_WORDS_API_URL is set
 * and the fetch succeeds, so the page is unaffected when there's no backend.
 */
export default function Stats() {
    const [stats, setStats] = useState<StatsData | null>(null);

    useEffect(() => {
        const base = import.meta.env.VITE_WORDS_API_URL as string | undefined;
        if (!base) return; // No server configured — render nothing.

        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${base}/stats?limit=1`, { signal: controller.signal });
                if (!res.ok) return;
                const data = (await res.json()) as StatsData;
                if (data && typeof data.total === 'number') setStats(data);
            } catch {
                // Network error, abort, or bad JSON — keep the section hidden.
            }
        })();
        return () => controller.abort();
    }, []);

    if (!stats || stats.total === 0) return null;

    const wordOfTheWeek = stats.top[0]?.word;
    const points = sparklinePoints(stats.perDay, 240, 48);

    return (
        <section className="section stats" aria-label="Live word stats">
            <div className="container stats-inner">
                <div className="stat">
                    <span className="stat-value">{stats.total.toLocaleString()}</span>
                    <span className="stat-label">words readers have collected</span>
                </div>

                {wordOfTheWeek ? (
                    <div className="stat">
                        <span className="stat-value accent">{wordOfTheWeek}</span>
                        <span className="stat-label">most-saved word</span>
                    </div>
                ) : null}

                {points ? (
                    <div className="stat stat-spark">
                        <svg viewBox="0 0 240 48" width="240" height="48" aria-hidden="true">
                            <polyline
                                points={points}
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="stat-label">words added per day</span>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
