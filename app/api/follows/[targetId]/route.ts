import { NextResponse } from 'next/server';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ targetId: string }> }
) {
  const { targetId: rawTargetId } = await params;
  const targetId = typeof rawTargetId === 'string' ? rawTargetId.trim() : '';

  if (!targetId) {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
  }

  return NextResponse.json({
    followed: false,
    targetId,
    count: 0,
  });
}
