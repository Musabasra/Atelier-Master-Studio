import React from 'react';
import { FolderOpen, Calendar, Maximize2, Search, Plus } from 'lucide-react';

// Added 'projects' and 'onAdd' to the props interface
interface GalleryProps {
  projects: any[];
  onOpen: (sketch: any) => void;
  onAdd: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ projects, onOpen, onAdd }) => {
  return (
    <div className="max-w-7xl mx-auto p-12 animate-in fade-in duration-700">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="mb-16 border-b border-white/5 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[#D4AF37] font-serif text-5xl italic tracking-widest">PRIVATE COLLECTION</h2>
          <p className="text-white/30 text-[10px] mt-4 tracking-[0.4em] uppercase">Curated Manuscripts & Neural Renderings</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10 group focus-within:border-[#D4AF37]/50 transition-all">
          <Search size={16} className="text-white/20 group-focus-within:text-[#D4AF37]" />
          <input 
            type="text" 
            placeholder="SEARCH ARCHIVES..." 
            className="bg-transparent border-none outline-none text-[10px] tracking-widest text-white placeholder:text-white/20 w-48"
          />
        </div>
      </div>

      {/* --- PROJECT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* --- NEW PROJECT BUTTON --- */}
        <div 
          onClick={onAdd} // Now triggers the handleAddNewProject in App.tsx
          className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-white/10 hover:border-[#D4AF37]/20 hover:text-[#D4AF37]/40 transition-all duration-500 cursor-pointer group h-[520px] bg-white/[0.02]"
        >
          <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
            <Plus size={32} strokeWidth={1} />
          </div>
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold">New Archive</span>
          <span className="text-[8px] tracking-[0.2em] mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Initialize Blank Canvas</span>
        </div>

        {/* --- DYNAMIC PROJECT LIST --- */}
        {projects.map((p) => (
          <div 
            key={p.id} 
            onClick={() => onOpen(p)}
            className="group relative bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden cursor-pointer hover:border-[#D4AF37]/30 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Image Container */}
            <div className="relative h-96 w-full overflow-hidden bg-black/40">
              {p.sketchUrl ? (
                <img 
                  src={p.sketchUrl} 
                  alt={p.title} 
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                   <span className="text-[8px] tracking-[0.4em] text-white/10 uppercase">Empty Canvas</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute top-6 right-6 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                <div className="bg-[#800020] text-white text-[8px] tracking-[0.2em] px-4 py-2 rounded-full border border-[#D4AF37]/40 shadow-xl flex items-center gap-2">
                  <FolderOpen size={10} /> OPEN STUDIO
                </div>
              </div>

              <div className="absolute bottom-6 left-6 flex items-center gap-2 text-[8px] text-white/40 tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">
                <Maximize2 size={10} /> {p.resolution}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 bg-[#121212] relative">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[#D4AF37] font-serif text-2xl tracking-wide leading-tight">
                  {p.title}
                </h3>
                <span className="text-[8px] text-white/20 flex items-center gap-1 mt-2">
                  <Calendar size={10} /> {p.date}
                </span>
              </div>
              
              <div className="w-8 h-[1px] bg-[#800020] group-hover:w-full transition-all duration-700" />
              
              <p className="mt-4 text-[9px] text-white/30 tracking-[0.2em] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                Click to finalize neural textures and refine manuscript layers.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- STATS FOOTER --- */}
      <div className="mt-24 pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
        <p className="text-[8px] tracking-[0.5em] uppercase text-white">Project Capacity: {projects.length} / 50</p>
        <p className="text-[8px] tracking-[0.5em] uppercase text-white">System: Optimized for RTX Rendering</p>
      </div>
    </div>
  );
};

export default Gallery;