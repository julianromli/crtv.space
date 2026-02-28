"use client";

import { Search, Sparkles, Shirt, PenTool, Camera, Box, PlusCircle, Plus, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Header() {
  const { toggleSidebar, isMinimized } = useSidebar();

  return (
    <header className="h-16 border-b border-[#2D2D2D] flex items-center justify-between px-6 gap-4 bg-[#121212] z-10 shrink-0">
      <div className="flex items-center gap-4 w-full max-w-md hidden sm:flex">
        <button 
          onClick={toggleSidebar}
          className={`text-[#9CA3AF] hover:text-[#F3F4F6] transition-all duration-300 flex-shrink-0 ${isMinimized ? 'rotate-180' : ''}`}
        >
          <PanelLeft size={20} />
        </button>
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-1.5 bg-transparent border border-[#2D2D2D] rounded-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#F04E2E] placeholder-[#9CA3AF] transition-colors font-light"
          />
        </div>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 sm:flex-none">
        <FilterPill icon={<Sparkles size={18} />} label="Featured" active />
        <FilterPill icon={<Shirt size={18} />} label="Mockups" />
        <FilterPill icon={<PenTool size={18} />} label="Illustration" />
        <FilterPill icon={<Camera size={18} />} label="Photography" />
        <FilterPill icon={<Box size={18} />} label="3D Render" />
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#2D2D2D] rounded-md hover:bg-[#1E1E1E] transition-colors text-sm font-semibold">
          <PlusCircle size={16} />
          Invite
        </button>
        <Link href="/workspace" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F04E2E] text-white rounded-md shadow-sm hover:opacity-90 transition-opacity text-sm font-semibold">
          <Plus size={16} />
          New Canvas
        </Link>
      </div>
    </header>
  );
}

function FilterPill({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
        active ? 'bg-[#1E1E1E] text-[#F3F4F6]' : 'text-[#9CA3AF] hover:bg-[#1E1E1E] hover:text-[#F3F4F6]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
