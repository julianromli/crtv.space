import { NextResponse } from 'next/server';
import { unfollowTarget } from '@/lib/data/follows';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ targetId: string }> }
) {
  const { targetId: rawTargetId } = await params;
  const targetId = typeof rawTargetId === 'string' ? rawTargetId.trim() : '';

  const result = unfollowTarget(targetId);
  if (!result) {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
  }

  return NextResponse.json(result);
}
