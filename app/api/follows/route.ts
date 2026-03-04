import { NextResponse } from 'next/server';
import {
  followTarget,
  FOLLOWING_COOKIE_NAME,
  getFollowedTargetIdsFromCookieHeader,
  serializeFollowedTargetIdsCookieValue,
} from '@/lib/data/follows';

type FollowRequestBody = {
  targetId?: unknown;
};

const FOLLOWING_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  let body: FollowRequestBody;

  try {
    body = (await request.json()) as FollowRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const targetId = typeof body.targetId === 'string' ? body.targetId.trim() : '';
  const followedTargetIds = getFollowedTargetIdsFromCookieHeader(request.headers.get('cookie'));

  const result = followTarget(targetId, followedTargetIds);
  if (!result) {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
  }

  const response = NextResponse.json({
    followed: result.followed,
    targetId: result.targetId,
    count: result.count,
  });

  response.cookies.set(FOLLOWING_COOKIE_NAME, serializeFollowedTargetIdsCookieValue(result.followedTargetIds), {
    path: '/',
    maxAge: FOLLOWING_COOKIE_MAX_AGE_SECONDS,
    sameSite: 'lax',
    httpOnly: true,
  });

  return response;
}
