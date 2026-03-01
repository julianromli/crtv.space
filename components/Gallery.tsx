import { PlusCircle, Heart } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const images = [
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

type GalleryImage = (typeof images)[number];

export default function Gallery({ onImageClick }: { onImageClick: (img: GalleryImage) => void }) {
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
