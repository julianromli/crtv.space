import { X, Edit2, Shuffle, Image as ImageIcon, Copy, PlayCircle, Maximize, Scissors, Link as LinkIcon, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type ModalImage = {
  src: string;
  alt: string;
};

export default function ImageModal({ image, onClose }: { image: ModalImage; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Prevent default scroll behavior when hovering over the image to allow zooming
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;

    const handleWheelPrevent = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', handleWheelPrevent, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheelPrevent);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    const scaleChange = e.deltaY * -0.002;
    const newScale = Math.min(Math.max(1, scale + scaleChange), 5);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(image.src);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-[#262626] w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
        >
          <div 
            ref={imageContainerRef}
            className={`w-full md:w-3/5 lg:w-2/3 bg-black flex items-center justify-center overflow-hidden relative group ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            role="application"
            tabIndex={-1}
          >
            <Image
              src={image.src} 
              alt={image.alt} 
              width={1200}
              height={1200}
              className="w-full h-full object-contain pointer-events-none transition-transform duration-75"
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
            />
            
            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => {
                  const newScale = Math.max(1, scale - 0.5);
                  setScale(newScale);
                  if (newScale === 1) setPosition({ x: 0, y: 0 });
                }}
                className="text-white hover:text-[#F04E2E] transition-colors p-1"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-white text-xs font-mono w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setScale(Math.min(5, scale + 0.5))}
                className="text-white hover:text-[#F04E2E] transition-colors p-1"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Copy Link Button */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <LinkIcon size={16} />}
                <span className="text-xs font-semibold">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
          <div className="w-full md:w-2/5 lg:w-1/3 border-l border-[#404040] flex flex-col h-full bg-[#262626]">
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="mb-6 relative">
                <div className="flex items-center gap-2 mb-2 text-[#D94F2B] font-semibold text-sm">
                  <Edit2 size={16} />
                  Prompt
                </div>
                <p className="text-[#E5E5E5] text-[15px] leading-relaxed font-light">
                  A minimalist, editorial photograph with a soft, neutral palette and abundant negative space. A woman reclines casually on a textured off-white boucle sofa, wearing loose...
                </p>
                <button type="button" className="text-[#A3A3A3] text-sm mt-1 hover:text-[#E5E5E5] font-semibold">More</button>
              </div>
              <div className="space-y-4 mb-8">
                <DetailRow label="Tool" value="Composer" />
                <DetailRow label="Model" value="Imagen 3" />
                <DetailRow label="References" value="16mm Film" />
                <DetailRow label="Aspect Ratio" value="3×4" />
                <DetailRow label="Author" value="Cássia Guerra" />
              </div>
              <div className="space-y-2">
                <ActionButton icon={<Shuffle size={20} />} label="Art Director" />
                <ActionButton icon={<ImageIcon size={20} />} label="Retexture" />
                <ActionButton icon={<Copy size={20} />} label="Make Variations" />
                <ActionButton icon={<PlayCircle size={20} />} label="Video" />
                <ActionButton icon={<Maximize size={20} />} label="Upscale" />
                <ActionButton icon={<Scissors size={20} />} label="Remove Background" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 rounded-full p-2 z-50 md:hidden"
          >
            <X size={20} />
          </button>
        </motion.div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-white/80 hover:text-white bg-black/50 md:bg-transparent rounded-full p-2 z-50 hidden md:block"
        >
          <X size={24} />
        </button>
      </div>
    </AnimatePresence>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-[#404040] pb-3 last:border-0 last:pb-0">
      <span className="text-[#A3A3A3] w-24 font-semibold">{label}</span>
      <span className="text-[#E5E5E5] flex-1 text-right font-light">{value}</span>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" className="w-full flex items-center gap-3 p-3 bg-[#333333]/50 border border-transparent hover:bg-[#333333] rounded-xl transition-colors text-left group">
      <span className="text-[#D94F2B] group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[#E5E5E5] text-sm font-semibold">{label}</span>
    </button>
  );
}
