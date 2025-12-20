import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';

const StudioWorkspace = ({ sketch }: { sketch: any }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset the render view when a new project is selected
  useEffect(() => {
    setIsRendered(false);
    setLoading(false);
  }, [sketch]);

  const handleRender = () => {
    if (!sketch) return;
    setLoading(true);
    
    // Simulate high-end AI processing delay
    setTimeout(() => {
      setLoading(false);
      setIsRendered(true);
    }, 2500); 
  };

  return (
    <div className="w-full h-full p-8 flex flex-col bg-[#0a0a0a]">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h2 className="text-[#D4AF37] font-serif text-2xl italic tracking-[0.2em]">ATELIER RENDER</h2>
          <span className="text-[10px] text-white/30 tracking-widest mt-1">AI TEXTURE ENGINE v2.0</span>
        </div>
        
        <button 
          onClick={handleRender}
          disabled={loading || !sketch}
          className={`group bg-[#800020] text-white px-8 py-3 rounded-full flex items-center gap-3 transition-all duration-300 border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(128,0,32,0.3)] ${loading ? 'opacity-50 cursor-wait' : 'hover:scale-105 hover:brightness-125'}`}
        >
          {loading ? (
            <RefreshCw size={18} className="animate-spin text-[#D4AF37]" />
          ) : (
            <Sparkles size={18} className="text-[#D4AF37] group-hover:rotate-12 transition-transform" />
          )}
          <span className="text-[10px] tracking-[0.2em] font-bold">
            {loading ? 'PROCESSING FABRIC...' : 'REVEAL MASTERPIECE'}
          </span>
        </button>
      </div>

      {/* --- DISPLAY AREA --- */}
      <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 bg-[#111111] shadow-2xl flex items-center justify-center">
        
        {/* Initial Empty State */}
        {!isRendered && !loading && (
          <div className="text-center px-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Wand2 size={32} className="text-white/10" />
            </div>
            <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase leading-loose">
              Manuscript detected.<br />Ready for neural rendering.
            </p>
          </div>
        )}

        {/* Luxury Loading State */}
        {loading && (
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-[#800020] rounded-full animate-spin-slow opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#D4AF37] text-[8px] animate-pulse uppercase tracking-tighter">AI</span>
              </div>
            </div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.6em] uppercase animate-pulse">Analyzing Silhouette</p>
          </div>
        )}

        {/* The Reveal: Your Hardcore Render */}
        {isRendered && (
          <div className="w-full h-full relative group animate-in fade-in zoom-in-95 duration-1000">
            <img 
              src={sketch?.renderedUrl} 
              alt="Final Polish" 
              className="w-full h-full object-cover"
            />
            {/* Elegant Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex items-end">
              <p className="text-[#D4AF37] font-serif italic text-lg tracking-wide">
                Finalized Editorial Look
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- FOOTER INFO --- */}
      <div className="mt-6 flex justify-between items-center px-2">
        <div className="flex gap-4">
          <div className="h-1 w-8 bg-[#800020]"></div>
          <div className="h-1 w-8 bg-[#D4AF37]"></div>
          <div className="h-1 w-8 bg-white/10"></div>
        </div>
        <span className="text-[8px] text-white/20 tracking-[0.4em] uppercase">Private Atelier Collection</span>
      </div>
    </div>
  );
};

export default StudioWorkspace;