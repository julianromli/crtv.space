import { NextResponse } from 'next/server';

type FollowRequestBody = {
  targetId?: unknown;
};

export async function POST(request: Request) {
  let body: FollowRequestBody;

  try {
    body = (await request.json()) as FollowRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const targetId = typeof body.targetId === 'string' ? body.targetId.trim() : '';

  if (!targetId) {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
  }

  return NextResponse.json({
    followed: true,
    targetId,
    count: 1,
  });
}
