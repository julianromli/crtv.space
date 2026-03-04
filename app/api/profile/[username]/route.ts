import { NextResponse } from 'next/server';
import { getPortfolioByUsername, getProfileByUsername, normalizeUsername, resolveViewerMode } from '@/lib/data/profile';

export const revalidate = 300;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const normalizedUsername = normalizeUsername(username);
  const viewerMode = resolveViewerMode(new URL(request.url).searchParams.get('viewerMode'));
  if (!normalizedUsername) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  const profile = await getProfileByUsername(normalizedUsername, viewerMode);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const portfolioItems = await getPortfolioByUsername(normalizedUsername);
  return NextResponse.json({ profile, portfolioItems });
}
