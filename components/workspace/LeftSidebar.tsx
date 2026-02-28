import { ImageIcon } from 'lucide-react';

export default function WorkspaceLeftSidebar() {
  return (
    <aside className="w-64 bg-[#1E1E1E] border-r border-[#2D2D2D] flex flex-col z-10 hidden md:flex">
      <div className="flex border-b border-[#2D2D2D]">
        <button className="flex-1 py-3 text-xs font-semibold text-[#A1A1A1] hover:text-[#EDEDED]">History</button>
        <button className="flex-1 py-3 text-xs font-semibold text-[#A1A1A1] hover:text-[#EDEDED]">Inspo</button>
        <button className="flex-1 py-3 text-xs font-semibold text-[#EDEDED] border-b-2 border-[#F04E2E]">Layers</button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="flex items-center p-2 rounded-md bg-[#2D2D2D] border border-transparent hover:border-[#404040] cursor-pointer group">
          <ImageIcon size={18} className="text-[#A1A1A1] mr-2" />
          <span className="text-xs truncate text-[#EDEDED] group-hover:text-[#F04E2E] transition-colors font-light">
            A stylized, cinematic portrait of a...
          </span>
        </div>
      </div>
    </aside>
  );
}
