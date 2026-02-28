import { Plus, ImageIcon, Square, Layers, Zap } from 'lucide-react';

export default function CanvasArea() {
  return (
    <main className="flex-1 bg-[#121212] relative overflow-hidden flex items-center justify-center p-8">
      <div className="relative group">
        <div className="absolute -inset-0.5 border border-[#F04E2E] pointer-events-none z-10">
          <div className="w-2 h-2 bg-white border border-[#F04E2E] absolute -top-1 -left-1 rounded-sm"></div>
          <div className="w-2 h-2 bg-white border border-[#F04E2E] absolute -top-1 -right-1 rounded-sm"></div>
          <div className="w-2 h-2 bg-white border border-[#F04E2E] absolute -bottom-1 -left-1 rounded-sm"></div>
          <div className="w-2 h-2 bg-white border border-[#F04E2E] absolute -bottom-1 -right-1 rounded-sm"></div>
        </div>
        <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-[#1E1E1E] shadow-2xl overflow-hidden">
          <img 
            src="https://picsum.photos/seed/workspace/800/800" 
            alt="Canvas Image" 
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300" 
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[640px] max-w-[90%] bg-[#1E1E1E] rounded-2xl shadow-2xl border border-[#2D2D2D] p-1 z-30">
        <div className="flex items-center px-4 py-2 border-b border-[#2D2D2D] mb-1">
          <button className="text-xs font-semibold mr-6 text-[#EDEDED]">Past Chats</button>
          <button className="text-xs font-semibold mr-auto text-[#EDEDED]">New Chat</button>
          <button className="text-xs font-semibold text-[#A1A1A1] flex items-center hover:text-[#EDEDED]">
            <Plus size={14} className="mr-1" /> New Chat
          </button>
        </div>
        <div className="px-4 py-3">
          <input 
            type="text" 
            placeholder="What would you like to create?" 
            className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-[#A1A1A1] text-[#EDEDED] p-0 font-light" 
          />
        </div>
        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1.5 px-2 py-1 hover:bg-[#2D2D2D] rounded-md transition-colors text-[#A1A1A1] hover:text-[#EDEDED]">
              <ImageIcon size={16} />
              <span className="text-xs font-semibold">Auto</span>
            </button>
            <button className="p-1 hover:bg-[#2D2D2D] rounded-md text-[#A1A1A1]">
              <Plus size={16} />
            </button>
            <div className="h-4 w-px bg-[#2D2D2D] mx-1"></div>
            <button className="flex items-center space-x-1.5 px-2 py-1 hover:bg-[#2D2D2D] rounded-md transition-colors text-[#A1A1A1] hover:text-[#EDEDED]">
              <Square size={16} />
              <span className="text-xs font-semibold">1×1</span>
            </button>
            <button className="p-1 hover:bg-[#2D2D2D] rounded-md text-[#A1A1A1]">
              <Layers size={16} />
            </button>
            <div className="h-4 w-px bg-[#2D2D2D] mx-1"></div>
            <button className="flex items-center space-x-1.5 px-2 py-1 hover:bg-[#2D2D2D] rounded-md transition-colors text-[#A1A1A1] hover:text-[#EDEDED]">
              <span className="text-xs font-semibold">2</span>
            </button>
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-red-500"></div>
          </div>
          <button className="h-8 w-8 bg-[#2D2D2D] hover:bg-[#404040] rounded-full flex items-center justify-center text-[#A1A1A1] hover:text-[#EDEDED] transition-colors">
            <Zap size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
