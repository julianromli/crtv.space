"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Gallery from '@/components/Gallery';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import type { GalleryFeedItem, GalleryImage } from '@/types/gallery';

const ImageModal = dynamic(() => import('@/components/ImageModal'));

export default function HomeClientShell({
  images,
}: {
  images: GalleryFeedItem[];
}) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="flex h-screen w-full bg-[#121212]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#121212]">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Gallery images={images} onImageClick={setSelectedImage} />
        </div>
      </main>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
