import { NextResponse } from 'next/server';
import { getFollowingCount } from '@/lib/data/follows';

export async function GET() {
  return NextResponse.json({ count: getFollowingCount() });
}
