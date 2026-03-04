import { NextResponse } from 'next/server';
import { getFollowedTargetIdsFromCookieHeader, getFollowingCount } from '@/lib/data/follows';

export async function GET(request: Request) {
  const followedTargetIds = getFollowedTargetIdsFromCookieHeader(request.headers.get('cookie'));
  return NextResponse.json({ count: getFollowingCount(followedTargetIds) });
}
