import TrackEventOnMount from '@/components/analytics/TrackEventOnMount';
import CanvasArea from '@/components/workspace/CanvasArea';
import WorkspaceLeftSidebar from '@/components/workspace/LeftSidebar';
import WorkspaceRightSidebar from '@/components/workspace/RightSidebar';
import WorkspaceTopBar from '@/components/workspace/TopBar';
import { formatUsdCents } from '@/lib/data/wallet-formatting';
import { getWalletSummary } from '@/lib/data/wallet';

export default async function CanvasPage() {
  const wallet = await getWalletSummary();

  return (
    <div className="flex flex-col h-screen w-full bg-[#121212] overflow-hidden">
      <TrackEventOnMount
        eventName="canvas_opened"
        payload={{ surface: 'canvas_page' }}
        source="canvas_page"
      />
      <WorkspaceTopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <WorkspaceLeftSidebar />
        <CanvasArea />
        <WorkspaceRightSidebar />
        <section className="pointer-events-none absolute left-6 top-6 z-20 grid gap-2 rounded-xl border border-zinc-800 bg-zinc-950/85 p-3 text-zinc-100 shadow-lg backdrop-blur sm:grid-cols-2">
          <article>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Available</p>
            <p className="mt-1 text-base font-semibold text-zinc-100">{formatUsdCents(wallet.availableBalanceCents)}</p>
          </article>
          <article>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Pending</p>
            <p className="mt-1 text-base font-semibold text-zinc-100">{formatUsdCents(wallet.pendingBalanceCents)}</p>
          </article>
        </section>
      </div>
    </div>
  );
}
