const FOLLOWING_UNLOCK_THRESHOLD = 5;

type FollowSuggestion = {
  id: string;
  handle: string;
  displayName: string;
};

const SEEDED_SUGGESTIONS: FollowSuggestion[] = [
  { id: 'u_001', handle: 'nina.codes', displayName: 'Nina Calder' },
  { id: 'u_002', handle: 'alexwave', displayName: 'Alex Watanabe' },
  { id: 'u_003', handle: 'mara.pixel', displayName: 'Mara Chen' },
  { id: 'u_004', handle: 'devonfield', displayName: 'Devon Fielding' },
  { id: 'u_005', handle: 'zara.builds', displayName: 'Zara Ibrahim' },
];

function getDeterministicFollowingCount(rawCount: unknown) {
  const firstCount = Array.isArray(rawCount) ? rawCount[0] : rawCount;

  if (typeof firstCount !== "string" || !/^\d+$/.test(firstCount)) {
    return 0;
  }

  const parsedCount = Number(firstCount);

  if (!Number.isSafeInteger(parsedCount) || parsedCount < 0) {
    return 0;
  }

  return parsedCount;
}

type FollowingPageProps = {
  searchParams?: Promise<{
    count?: string | string[];
  }>;
};

export default async function FollowingPage({ searchParams }: FollowingPageProps) {
  const resolvedSearchParams = await searchParams;
  const followingCount = getDeterministicFollowingCount(resolvedSearchParams?.count);

  if (followingCount < FOLLOWING_UNLOCK_THRESHOLD) {
    return (
      <div className="min-h-screen w-full bg-[#121212] px-6 py-8 text-zinc-100 md:px-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Following</p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Unlock your following feed</h1>
            <p className="max-w-2xl text-sm text-zinc-400">
              Follow at least {FOLLOWING_UNLOCK_THRESHOLD} creators to access this page.
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-[0_0_0_1px_rgba(24,24,27,0.4)]">
            <p className="text-sm font-medium text-zinc-200">
              Progress: {followingCount}/{FOLLOWING_UNLOCK_THRESHOLD}
            </p>
            <p className="text-sm leading-relaxed text-zinc-300">
              Follow a few creators below to start shaping your feed.
            </p>

            <ul className="mt-4 space-y-3">
              {SEEDED_SUGGESTIONS.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">{suggestion.displayName}</p>
                    <p className="truncate text-xs text-zinc-400">@{suggestion.handle}</p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
                  >
                    Follow
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#121212] px-6 py-8 text-zinc-100 md:px-10">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <p className="text-sm text-zinc-300">Following feed unlocked.</p>
      </div>
    </div>
  );
}
