import { getWalletSummary } from '@/lib/data/wallet';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

function formatCents(value: number) {
  return currencyFormatter.format(value / 100);
}

function formatPayoutDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export default async function BillingPage() {
  const wallet = await getWalletSummary();

  return (
    <div className="min-h-screen w-full bg-[#121212] px-6 py-8 text-zinc-100 md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Billing</p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Credits Wallet</h1>
          <p className="max-w-2xl text-sm text-zinc-400">
            Unified wallet balances used across your creator workspace.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.4)]">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Available</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-100">{formatCents(wallet.availableBalanceCents)}</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.4)]">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Pending</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-100">{formatCents(wallet.pendingBalanceCents)}</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.4)]">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Total Earned</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-100">{formatCents(wallet.totalEarnedCents)}</p>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Next payout date</p>
          <p className="mt-2 text-lg font-medium text-zinc-100">{formatPayoutDate(wallet.nextPayoutDate)}</p>
          <p className="mt-3 text-xs text-zinc-500">Account {wallet.accountId}</p>
        </section>
      </div>
    </div>
  );
}
