"use client";

import { ChevronDown, FolderOpen, Image as ImageIcon, Grid, Sparkles, Megaphone, Plus, Settings, UserCircle, MessageSquare, Zap } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import { useState, useRef, useEffect } from 'react';

export default function Sidebar() {
  const { isMinimized } = useSidebar();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className={`flex-shrink-0 border-r border-[#2D2D2D] hidden md:flex flex-col bg-[#121212] transition-all duration-300 ease-in-out relative z-50 ${isMinimized ? 'w-[72px]' : 'w-64'}`}>
      <div className="h-16 flex items-center px-4 border-b border-transparent">
        <Link href="/" className={`flex items-center gap-2 text-sm font-semibold text-[#F3F4F6] hover:text-[#F04E2E] transition-colors w-full text-left ${isMinimized ? 'justify-center' : ''}`}>
          <div className="w-6 h-6 rounded-full bg-[#2D2D2D] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src="https://picsum.photos/seed/avatar/32/32" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {!isMinimized && (
            <>
              <span className="flex-1 truncate">Default Workspace</span>
              <ChevronDown size={16} className="text-[#9CA3AF] flex-shrink-0" />
            </>
          )}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 overflow-x-hidden scrollbar-hide">
        <nav className="space-y-1">
          <NavItem href="/" icon={<FolderOpen size={20} />} label="Canvases" isMinimized={isMinimized} />
          <NavItem href="/" icon={<ImageIcon size={20} />} label="Library" isMinimized={isMinimized} />
          <NavItem href="/" icon={<Grid size={20} />} label="References" isMinimized={isMinimized} />
          <NavItem href="/" icon={<Sparkles size={20} />} label="Inspo" active isMinimized={isMinimized} />
        </nav>
        <div>
          <NavItem href="/" icon={<Megaphone size={20} />} label="What's New" isMinimized={isMinimized} />
        </div>
        <div className="space-y-2 pt-2">
          {!isMinimized && (
            <div className="px-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              Projects
            </div>
          )}
          <button className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer text-[#9CA3AF] hover:bg-[#1E1E1E] hover:text-[#F3F4F6] w-full text-left group ${isMinimized ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}>
            <Plus size={20} className="flex-shrink-0" />
            {!isMinimized && <span className="truncate">New Project</span>}
            {isMinimized && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-[#2D2D2D] text-[#F3F4F6] text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border border-[#404040]">
                New Project
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 border-t border-[#2D2D2D] relative" ref={profileMenuRef}>
        {isProfileMenuOpen && (
          <div className={`absolute bottom-[calc(100%+8px)] bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl shadow-2xl py-2 z-50 ${isMinimized ? 'left-4 w-56' : 'left-4 right-4'}`}>
            <Link 
              href="/settings" 
              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-[#F3F4F6] hover:bg-[#2D2D2D] transition-colors"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Settings
              <Settings size={16} className="text-[#9CA3AF]" />
            </Link>
            <Link 
              href="/profile" 
              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-[#F3F4F6] hover:bg-[#2D2D2D] transition-colors"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Profile
              <UserCircle size={16} className="text-[#9CA3AF]" />
            </Link>
            <Link 
              href="/support" 
              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-[#F3F4F6] hover:bg-[#2D2D2D] transition-colors"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Email Support
              <MessageSquare size={16} className="text-[#9CA3AF]" />
            </Link>
            <button 
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-[#F3F4F6] hover:bg-[#2D2D2D] transition-colors text-left"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Log out
              <Zap size={16} className="text-[#9CA3AF]" />
            </button>
          </div>
        )}

        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className={`w-full flex items-center gap-3 hover:bg-[#1E1E1E] p-2 -mx-2 rounded-xl transition-colors ${isMinimized ? 'justify-center' : ''} ${isProfileMenuOpen ? 'bg-[#1E1E1E]' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex-shrink-0 overflow-hidden">
            <img src="https://picsum.photos/seed/user/32/32" alt="User" className="w-full h-full object-cover" />
          </div>
          {!isMinimized && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-[#F3F4F6] truncate">Faiz Intifada</p>
                <p className="text-xs text-[#9CA3AF] truncate font-light">faizintifada@gmail.com</p>
              </div>
              <ChevronDown size={16} className={`text-[#9CA3AF] flex-shrink-0 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, href, isMinimized }: { icon: React.ReactNode; label: string; active?: boolean; href: string; isMinimized: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer group ${
        active
          ? 'bg-[#F04E2E]/10 text-[#F04E2E]'
          : 'text-[#9CA3AF] hover:bg-[#1E1E1E] hover:text-[#F3F4F6]'
      } ${isMinimized ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isMinimized && <span className="truncate">{label}</span>}
      
      {isMinimized && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-[#2D2D2D] text-[#F3F4F6] text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border border-[#404040]">
          {label}
        </div>
      )}
    </Link>
  );
}
