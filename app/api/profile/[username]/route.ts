import { NextResponse } from 'next/server';
import { getPortfolioByUsername, getProfileByUsername, normalizeUsername } from '@/lib/data/profile';

export const revalidate = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  const profile = await getProfileByUsername(normalizedUsername);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const portfolioItems = await getPortfolioByUsername(normalizedUsername);
  return NextResponse.json({ profile, portfolioItems });
}
