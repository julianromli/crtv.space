import { unstable_cache } from 'next/cache';
import type { GalleryFeedItem } from '@/types/gallery';

const galleryFeedSeed: GalleryFeedItem[] = [
  { id: 1, src: 'https://picsum.photos/seed/1/600/800', alt: 'Portrait', aspect: 'aspect-[3/4]', username: '@alex-smith', avatar: 'https://picsum.photos/seed/u1/32/32', width: 600, height: 800 },
  { id: 2, src: 'https://picsum.photos/seed/2/600/600', alt: 'Architecture', aspect: 'aspect-square', username: '@sarah-j', avatar: 'https://picsum.photos/seed/u2/32/32', width: 600, height: 600 },
  { id: 3, src: 'https://picsum.photos/seed/3/600/800', alt: 'Texture', aspect: 'aspect-[3/4]', username: '@mike-design', avatar: 'https://picsum.photos/seed/u3/32/32', width: 600, height: 800 },
  { id: 4, src: 'https://picsum.photos/seed/4/600/600', alt: 'Object', aspect: 'aspect-square', username: '@emma-art', avatar: 'https://picsum.photos/seed/u4/32/32', width: 600, height: 600 },
  { id: 5, src: 'https://picsum.photos/seed/5/600/800', alt: 'Shadows', aspect: 'aspect-[3/4]', username: '@david-k', avatar: 'https://picsum.photos/seed/u5/32/32', width: 600, height: 800 },
  { id: 6, src: 'https://picsum.photos/seed/6/600/600', alt: 'Lifestyle', aspect: 'aspect-square', username: '@lisa-m', avatar: 'https://picsum.photos/seed/u6/32/32', width: 600, height: 600 },
  { id: 7, src: 'https://picsum.photos/seed/7/600/800', alt: 'Product', aspect: 'aspect-[3/4]', username: '@tom-h', avatar: 'https://picsum.photos/seed/u7/32/32', width: 600, height: 800 },
  { id: 8, src: 'https://picsum.photos/seed/8/600/600', alt: 'Fashion', aspect: 'aspect-square', username: '@anna-v', avatar: 'https://picsum.photos/seed/u8/32/32', width: 600, height: 600 },
  { id: 9, src: 'https://picsum.photos/seed/9/600/800', alt: 'Minimal', aspect: 'aspect-[3/4]', username: '@chris-p', avatar: 'https://picsum.photos/seed/u9/32/32', width: 600, height: 800 },
  { id: 10, src: 'https://picsum.photos/seed/10/600/600', alt: 'Abstract', aspect: 'aspect-square', username: '@julia-r', avatar: 'https://picsum.photos/seed/u10/32/32', width: 600, height: 600 },
  { id: 11, src: 'https://picsum.photos/seed/11/600/800', alt: '3D', aspect: 'aspect-[3/4]', username: '@sam-w', avatar: 'https://picsum.photos/seed/u11/32/32', width: 600, height: 800 },
  { id: 12, src: 'https://picsum.photos/seed/12/600/600', alt: 'Interior', aspect: 'aspect-square', username: '@nina-b', avatar: 'https://picsum.photos/seed/u12/32/32', width: 600, height: 600 },
];

export const getGalleryFeedItems = unstable_cache(
  async () => galleryFeedSeed,
  ['gallery-feed-items'],
  { revalidate: 120 }
);
