"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import ImageModal from '@/components/ImageModal';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  return (
    <div className="flex h-screen w-full bg-[#121212]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#121212]">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Gallery onImageClick={setSelectedImage} />
        </div>
      </main>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
