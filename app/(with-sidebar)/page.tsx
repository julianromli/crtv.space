import HomeClientShell from '@/components/home/HomeClientShell';
import { getGalleryFeedItems } from '@/lib/data/gallery';

export default async function Home() {
  const images = await getGalleryFeedItems();
  return <HomeClientShell images={images} />;
}
