import { unstable_cache } from 'next/cache';

export type WalletSummary = {
  accountId: string;
  currency: 'USD';
  availableBalanceCents: number;
  pendingBalanceCents: number;
  totalEarnedCents: number;
  nextPayoutDate: string;
  updatedAt: string;
};

const walletSummarySeed: WalletSummary = {
  accountId: 'wallet_faiz_intifada',
  currency: 'USD',
  availableBalanceCents: 248500,
  pendingBalanceCents: 73200,
  totalEarnedCents: 1893400,
  nextPayoutDate: '2026-03-15',
  updatedAt: '2026-03-01T00:00:00.000Z',
};

export const getWalletSummary = unstable_cache(
  async () => walletSummarySeed,
  ['wallet-summary'],
  { revalidate: 300 }
);
