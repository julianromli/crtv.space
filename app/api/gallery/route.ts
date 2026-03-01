import { NextResponse } from 'next/server';
import { getGalleryFeedItems } from '@/lib/data/gallery';

export const revalidate = 120;

export async function GET() {
  const items = await getGalleryFeedItems();
  return NextResponse.json({ items });
}
