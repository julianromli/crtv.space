import { NextResponse } from 'next/server';
import {
  unfollowTarget,
  FOLLOWING_COOKIE_NAME,
  getFollowedTargetIdsFromCookieHeader,
  serializeFollowedTargetIdsCookieValue,
} from '@/lib/data/follows';

const FOLLOWING_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ targetId: string }> }
) {
  const { targetId: rawTargetId } = await params;
  const targetId = typeof rawTargetId === 'string' ? rawTargetId.trim() : '';
  const followedTargetIds = getFollowedTargetIdsFromCookieHeader(request.headers.get('cookie'));

  const result = unfollowTarget(targetId, followedTargetIds);
  if (!result) {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
  }

  const response = NextResponse.json({
    followed: result.followed,
    targetId: result.targetId,
    count: result.count,
  });

  if (result.count === 0) {
    response.cookies.set(FOLLOWING_COOKIE_NAME, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      httpOnly: true,
    });
  } else {
    response.cookies.set(FOLLOWING_COOKIE_NAME, serializeFollowedTargetIdsCookieValue(result.followedTargetIds), {
      path: '/',
      maxAge: FOLLOWING_COOKIE_MAX_AGE_SECONDS,
      sameSite: 'lax',
      httpOnly: true,
    });
  }

  return response;
}
