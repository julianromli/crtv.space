export default function SearchPage() {
  return (
    <div className="min-h-screen w-full bg-[#121212] px-6 py-8 text-zinc-100 md:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-[0_0_0_1px_rgba(24,24,27,0.4)]">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Search</p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Search scaffold is ready</h1>
          <p className="max-w-2xl text-sm text-zinc-400">
            Auth-only search experience is scaffolded. Query execution, results ranking, and auth enforcement wiring
            are intentionally deferred.
          </p>
        </header>
      </div>
    </div>
  );
}
