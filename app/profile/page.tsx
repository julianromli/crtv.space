"use client";

import Sidebar from '@/components/Sidebar';
import { PlusCircle, Plus, Edit2, Heart, PlayCircle, Grid, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ImageModal from '@/components/ImageModal';
import EditProfileModal from '@/components/EditProfileModal';
import { useSidebar } from '@/contexts/SidebarContext';

const portfolioItems = [
  { id: 1, src: 'https://picsum.photos/seed/p1/600/800', alt: 'AI Art 1', aspect: 'aspect-[3/4]', type: 'image' },
  { id: 2, src: 'https://picsum.photos/seed/p2/600/600', alt: 'AI Video 1', aspect: 'aspect-square', type: 'video' },
  { id: 3, src: 'https://picsum.photos/seed/p3/600/800', alt: 'AI Art 2', aspect: 'aspect-[3/4]', type: 'image' },
  { id: 4, src: 'https://picsum.photos/seed/p4/600/600', alt: 'AI Art 3', aspect: 'aspect-square', type: 'image' },
  { id: 5, src: 'https://picsum.photos/seed/p5/600/800', alt: 'AI Video 2', aspect: 'aspect-[3/4]', type: 'video' },
  { id: 6, src: 'https://picsum.photos/seed/p6/600/600', alt: 'AI Art 4', aspect: 'aspect-square', type: 'image' },
];

export default function ProfilePage() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Faiz Intifada',
    username: 'faiz-intifada',
    avatar: 'https://picsum.photos/seed/user/200/200',
    bio: 'Community Manager @aiforproductivity.id\nFounder @vibedev.id @cinemart.official\nBuild isometricon.com\n🔗 threads.com/@faizntfd'
  });

  const { toggleSidebar, isMinimized } = useSidebar();
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = portfolioItems.filter(item => item.type === activeTab);

  return (
    <div className="flex h-screen w-full bg-[#121212]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#121212] relative">
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {/* Top Actions Bar (Aligned with Gallery Width) */}
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
            <button 
              onClick={toggleSidebar}
              className={`text-[#9CA3AF] hover:text-[#F3F4F6] transition-all duration-300 flex-shrink-0 hidden sm:block ${isMinimized ? 'rotate-180' : ''}`}
            >
              <PanelLeft size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#2D2D2D] rounded-md hover:bg-[#1E1E1E] transition-colors text-sm font-semibold text-[#F3F4F6]">
                <PlusCircle size={16} />
                Invite
              </button>
              <Link href="/workspace" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F04E2E] text-white rounded-md shadow-sm hover:opacity-90 transition-opacity text-sm font-semibold">
                <Plus size={16} />
                New Canvas
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="max-w-4xl mx-auto flex flex-col items-center mb-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#1E1E1E] shadow-xl">
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col items-center md:items-start pt-2">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                  <h1 className="text-2xl md:text-3xl font-semibold text-[#F3F4F6]">{profile.name}</h1>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#2D2D2D] rounded-md text-sm font-semibold text-[#F3F4F6] transition-colors border border-[#2D2D2D]"
                    >
                      <Edit2 size={14} />
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors border ${
                        isFollowing 
                          ? 'bg-transparent border-[#2D2D2D] text-[#F3F4F6] hover:bg-[#1E1E1E]' 
                          : 'bg-[#F3F4F6] border-[#F3F4F6] text-[#121212] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                </div>
                <p className="text-[#9CA3AF] text-base md:text-lg mb-6 font-light">@{profile.username}</p>
                
                <div className="flex items-center gap-8 text-[#F3F4F6] font-semibold text-sm md:text-base mb-6">
                  <div className="flex gap-1.5"><span className="text-white">1,204</span> <span className="text-[#9CA3AF] font-light">followers</span></div>
                  <div className="flex gap-1.5"><span className="text-white">248</span> <span className="text-[#9CA3AF] font-light">following</span></div>
                </div>

                {profile.bio && (
                  <div className="text-sm text-[#F3F4F6] whitespace-pre-wrap font-light leading-relaxed max-w-md">
                    {profile.bio}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Portfolio Feeds */}
          <div className="max-w-5xl mx-auto">
            <div className="border-t border-[#2D2D2D] mb-6 flex justify-center gap-8">
              <button 
                onClick={() => setActiveTab('image')}
                className={`px-4 py-3 border-t-2 -mt-[1px] text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors ${
                  activeTab === 'image' ? 'border-[#F3F4F6] text-[#F3F4F6]' : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <Grid size={14} />
                Photo
              </button>
              <button 
                onClick={() => setActiveTab('video')}
                className={`px-4 py-3 border-t-2 -mt-[1px] text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors ${
                  activeTab === 'video' ? 'border-[#F3F4F6] text-[#F3F4F6]' : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <PlayCircle size={14} />
                Video
              </button>
            </div>

            {filteredItems.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid group relative rounded-xl overflow-hidden bg-[#1E1E1E] cursor-pointer border border-[#2D2D2D]/50"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover transition-opacity duration-300"
                      loading="lazy"
                    />
                    {item.type === 'video' && (
                      <div className="absolute top-3 right-3 text-white drop-shadow-md bg-black/30 rounded-full p-1 backdrop-blur-sm">
                        <PlayCircle size={20} fill="rgba(0,0,0,0.5)" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1.5">
                        <button 
                          className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-colors"
                          onClick={(e) => toggleLike(e, item.id)}
                        >
                          <Heart size={14} className={likedItems[item.id] ? "fill-[#F04E2E] text-[#F04E2E]" : ""} />
                        </button>
                        <button 
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
            ) : (
              <div className="flex justify-center mt-12">
                <div className="border border-[#2D2D2D] rounded-lg px-8 py-6 text-center text-[#9CA3AF] font-light text-sm">
                  This person hasn&apos;t added any {activeTab}s to their profile
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
      {isEditModalOpen && (
        <EditProfileModal 
          profile={profile} 
          onSave={(newProfile) => {
            setProfile(newProfile);
            setIsEditModalOpen(false);
          }}
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}
