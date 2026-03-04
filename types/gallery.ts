export type GalleryMediaType = 'image' | 'video';

export type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  aspect: string;
  width: number;
  height: number;
  username?: string;
  avatar?: string;
  type?: GalleryMediaType;
};

export type GalleryFeedItem = GalleryImage & {
  username: string;
  avatar: string;
};

export type PortfolioItem = GalleryImage & {
  type: GalleryMediaType;
};
