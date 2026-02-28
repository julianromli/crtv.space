import { ArrowLeft, MousePointer2, Hand, PlusSquare, ChevronDown, Share } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceTopBar() {
  return (
    <header className="h-14 bg-[#1E1E1E] border-b border-[#2D2D2D] flex items-center justify-between px-4 z-20 shrink-0">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-[#A1A1A1] hover:text-[#F04E2E] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="h-8 w-8 bg-[#F04E2E]/10 rounded flex items-center justify-center text-[#F04E2E]">
          <MousePointer2 size={18} />
        </div>
        <button className="text-[#A1A1A1] hover:text-[#EDEDED]">
          <Hand size={20} />
        </button>
        <div className="flex items-center text-[#A1A1A1] hover:text-[#EDEDED] cursor-pointer">
          <PlusSquare size={20} />
          <ChevronDown size={14} className="ml-1" />
        </div>
      </div>
      <div className="font-semibold text-sm text-[#EDEDED]">
        Untitled
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-[#F04E2E] hover:bg-[#E03E00] text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center shadow-sm">
          <Share size={14} className="mr-1.5" />
          Share
        </button>
        <div className="flex items-center text-[#A1A1A1] text-sm cursor-pointer hover:bg-[#2D2D2D] px-2 py-1 rounded-md font-semibold">
          45%
          <ChevronDown size={14} className="ml-1" />
        </div>
      </div>
    </header>
  );
}
