import { Edit2, Shuffle, Crop, Image as ImageIcon, Copy, Merge, PlayCircle, Brush, Maximize, Scissors } from 'lucide-react';

export default function WorkspaceRightSidebar() {
  return (
    <aside className="w-80 bg-[#1E1E1E] border-l border-[#2D2D2D] flex flex-col z-10 overflow-y-auto">
      <div className="flex border-b border-[#2D2D2D] px-2">
        <button className="flex-1 py-3 text-xs font-semibold text-[#EDEDED] border-b-2 border-transparent">Tools</button>
        <button className="flex-1 py-3 text-xs font-semibold text-[#A1A1A1] hover:text-[#EDEDED]">Adjustments</button>
        <button className="flex-1 py-3 text-xs font-semibold text-[#A1A1A1] hover:text-[#EDEDED]">Properties</button>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-[#F04E2E] font-semibold text-sm">
              <Edit2 size={14} className="mr-1.5" /> Prompt
            </div>
            <button className="text-[#F04E2E] text-xs hover:underline font-semibold">Remix</button>
          </div>
          <div className="text-xs leading-relaxed text-[#EDEDED] bg-[#252525] p-3 rounded-md border border-[#2D2D2D] font-light">
            A stylized, cinematic portrait of a woman captured from the chest up, set against a glowing light blue background hex #87CDDD. The image is tightly framed in vertical format, emphasizing...
            <div className="mt-1 text-[#A1A1A1] cursor-pointer hover:text-[#EDEDED] font-semibold">More</div>
          </div>
        </div>
        
        <div className="border border-[#2D2D2D] rounded-lg overflow-hidden bg-[#252525]">
          <RightDetailRow label="Tool" value="Composer" />
          <RightDetailRow label="Model" value="Flux Pro" />
          <RightDetailRow label="References" value="Photography" />
          <RightDetailRow label="Aspect Ratio" value="1×1" />
          <div className="flex items-center justify-between p-2.5 border-b border-[#2D2D2D]">
            <span className="text-xs text-[#A1A1A1] font-semibold">Color</span>
            <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
          </div>
          <div className="flex items-center justify-between p-2.5">
            <span className="text-xs text-[#A1A1A1] font-semibold">Author</span>
            <span className="text-xs text-[#EDEDED] font-light">Cássia Guerra</span>
          </div>
        </div>

        <div className="space-y-2">
          <RightActionButton icon={<Shuffle size={18} />} label="Art Director" />
          <RightActionButton icon={<Crop size={18} />} label="Reframe" />
          <RightActionButton icon={<ImageIcon size={18} />} label="Retexture" />
          <RightActionButton icon={<Copy size={18} />} label="Make Variations" />
          <RightActionButton icon={<Merge size={18} />} label="Merge" disabled />
          <RightActionButton icon={<PlayCircle size={18} />} label="Video" disabled />
          <RightActionButton icon={<Brush size={18} />} label="Retouch" disabled />
          <RightActionButton icon={<Maximize size={18} />} label="Upscale" disabled />
        </div>
      </div>
    </aside>
  );
}

function RightDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 border-b border-[#2D2D2D]">
      <span className="text-xs text-[#A1A1A1] font-semibold">{label}</span>
      <span className="text-xs text-[#EDEDED] font-light">{value}</span>
    </div>
  );
}

function RightActionButton({ icon, label, disabled }: { icon: React.ReactNode; label: string; disabled?: boolean }) {
  return (
    <button className={`w-full text-left px-3 py-2.5 rounded-md bg-[#252525] hover:bg-[#2D2D2D] transition-colors flex items-center group ${disabled ? 'text-[#A1A1A1]' : 'text-[#EDEDED]'}`}>
      <span className={`${disabled ? 'text-[#A1A1A1]' : 'text-[#F04E2E]'} mr-3 group-hover:scale-110 transition-transform`}>{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}
