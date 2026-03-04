import { PlusCircle, Heart } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import type { GalleryFeedItem, GalleryImage } from '@/types/gallery';

export default function Gallery({
  images,
  onImageClick,
}: {
  images: GalleryFeedItem[];
  onImageClick: (img: GalleryImage) => void;
}) {
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="break-inside-avoid group relative rounded-xl overflow-hidden bg-[#1E1E1E] cursor-pointer"
        >
          <button
            type="button"
            className="absolute inset-0 z-10"
            aria-label={`Open ${img.alt}`}
            onClick={() => onImageClick(img)}
          />
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            className="w-full h-auto object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                <Image src={img.avatar} alt={img.username} width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow-md">{img.username}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-colors"
                onClick={(e) => toggleLike(e, img.id)}
              >
                <Heart size={14} className={likedItems[img.id] ? "fill-[#F04E2E] text-[#F04E2E]" : ""} />
              </button>
              <button
                type="button"
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-colors"
                onClick={(e) => { e.stopPropagation(); }}
              >
                <PlusCircle size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
