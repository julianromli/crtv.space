import { NextResponse } from 'next/server';
import { getWalletSummary } from '@/lib/data/wallet';

export const revalidate = 300;

export async function GET() {
  const wallet = await getWalletSummary();
  return NextResponse.json({ wallet });
}
