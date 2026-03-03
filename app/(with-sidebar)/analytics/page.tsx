const engagementCards = [
  {
    label: 'Profile Views',
    value: '12,480',
    delta: '+12.4% vs last 7 days',
  },
  {
    label: 'New Followers',
    value: '326',
    delta: '+8.1% vs last 7 days',
  },
  {
    label: 'Portfolio Saves',
    value: '91',
    delta: '+4.7% vs last 7 days',
  },
  {
    label: 'Avg Session Time',
    value: '3m 42s',
    delta: '+0m 26s vs last 7 days',
  },
];

const insightCards = [
  {
    title: 'Top discovery source',
    insight: '63% of traffic comes from profile shares this week.',
  },
  {
    title: 'Most engaged format',
    insight: 'Carousels are outperforming single-image posts by 1.8x.',
  },
  {
    title: 'Best posting window',
    insight: 'Engagement peaks between 7:00 PM and 9:00 PM local time.',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen w-full bg-[#121212] px-6 py-8 text-zinc-100 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Analytics</p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Engagement Overview</h1>
          <p className="max-w-2xl text-sm text-zinc-400">
            A lightweight snapshot of audience engagement and performance signals.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {engagementCards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.4)]"
            >
              <p className="text-xs uppercase tracking-wide text-zinc-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-zinc-100">{card.value}</p>
              <p className="mt-2 text-xs text-emerald-300">{card.delta}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {insightCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <h2 className="text-sm font-medium text-zinc-200">{card.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.insight}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
