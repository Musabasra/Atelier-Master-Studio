import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, RefreshCw, Download, Info } from 'lucide-react';

const StudioWorkspace = ({ sketch }: { sketch: any }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

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

  // --- NEW: AI DOWNLOAD LOGIC ---
  const downloadAIRender = async () => {
    if (!sketch?.renderedUrl) return;
    
    try {
      // Fetch the image to avoid CORS issues when downloading
      const response = await fetch(sketch.renderedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `atelier-render-${sketch.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className="w-full h-full p-8 flex flex-col bg-[#0a0a0a]">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h2 className="text-[#D4AF37] font-serif text-2xl italic tracking-[0.2em]">ATELIER RENDER</h2>
          <span className="text-[10px] text-white/30 tracking-widest mt-1 uppercase">Nano Banana Engine v2.0</span>
        </div>
        
        <div className="flex items-center gap-4">
            {isRendered && (
                <button 
                  onClick={downloadAIRender}
                  className="p-3 rounded-full border border-white/10 text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                  title="Download Render"
                >
                    <Download size={20} />
                </button>
            )}
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
      </div>

      {/* --- DISPLAY AREA --- */}
      <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 bg-[#111111] shadow-2xl flex items-center justify-center group">
        
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

        {/* The Reveal */}
        {isRendered && (
          <div className="w-full h-full relative animate-in fade-in zoom-in-95 duration-1000">
            <img 
              src={sketch?.renderedUrl} 
              alt="Final Polish" 
              className="w-full h-full object-cover"
            />
            
            {/* Elegant Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
              <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[#D4AF37] font-serif italic text-lg tracking-wide">Editorial Render</p>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Processed via Nano Banana API</p>
                  </div>
                  <button 
                    onClick={() => setShowMetadata(!showMetadata)}
                    className="text-white/20 hover:text-white transition-colors"
                  >
                    <Info size={16} />
                  </button>
              </div>
              
              {showMetadata && (
                  <div className="mt-4 p-3 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 animate-in slide-in-from-bottom-2">
                      <div className="grid grid-cols-2 gap-2 text-[8px] uppercase tracking-[0.2em]">
                          <span className="text-white/40">Model:</span> <span className="text-[#D4AF37]">Nano-B v2</span>
                          <span className="text-white/40">Sampler:</span> <span className="text-[#D4AF37]">Euler Ancestral</span>
                          <span className="text-white/40">Steps:</span> <span className="text-[#D4AF37]">35</span>
                      </div>
                  </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- FOOTER INFO --- */}
      <div className="mt-6 flex justify-between items-center px-2">
        <div className="flex gap-4">
          <div className={`h-1 w-8 transition-colors duration-500 ${isRendered ? 'bg-[#800020]' : 'bg-white/5'}`}></div>
          <div className={`h-1 w-8 transition-colors duration-500 ${isRendered ? 'bg-[#D4AF37]' : 'bg-white/5'}`}></div>
          <div className={`h-1 w-8 transition-colors duration-500 ${isRendered ? 'bg-white/40' : 'bg-white/5'}`}></div>
        </div>
        <span className="text-[8px] text-white/20 tracking-[0.4em] uppercase">Architecture Confidential</span>
      </div>
    </div>
  );
};

export default StudioWorkspace;