import React, { useState } from 'react';
import Gallery from './Gallery.tsx';
import SketchCanvas from './SketchCanvas.tsx';
import StudioWorkspace from './StudioWorkspace.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<'GALLERY' | 'WORKBENCH'>('GALLERY');
  const [showAI, setShowAI] = useState(true); 
  const [currentSketch, setCurrentSketch] = useState<any>(null);

  const handleOpenProject = (sketch: any) => {
    setCurrentSketch(sketch);
    setView('WORKBENCH');
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* --- NAVIGATION BAR --- */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#121212] z-50">
        <div className="flex items-center gap-12">
          <h1 className="font-serif text-3xl text-[#D4AF37] tracking-tighter italic">ATELIER MASTER</h1>
          <div className="flex gap-8">
            <button 
              onClick={() => setView('GALLERY')}
              className={`text-[10px] uppercase tracking-[0.3em] transition-colors ${view === 'GALLERY' ? 'text-[#D4AF37]' : 'text-white/30 hover:text-white'}`}
            >
              The Gallery
            </button>
            <button 
              onClick={() => setView('WORKBENCH')}
              className={`text-[10px] uppercase tracking-[0.3em] transition-colors ${view === 'WORKBENCH' ? 'text-[#D4AF37]' : 'text-white/30 hover:text-white'}`}
            >
              The Studio
            </button>
          </div>
        </div>

        {view === 'WORKBENCH' && (
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowAI(!showAI)}
              className="px-5 py-2 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-widest rounded-full hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              {showAI ? 'HIDE AI PREVIEW' : 'SHOW AI PREVIEW'}
            </button>
            <button className="bg-[#800020] px-8 py-2 text-[10px] tracking-widest rounded-full border border-[#D4AF37]/20 shadow-lg hover:brightness-125 transition-all">
              SYNC MOBILE
            </button>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 relative overflow-hidden bg-[#0d0d0d]">
        {view === 'GALLERY' ? (
          <div className="h-full overflow-y-auto">
            <Gallery onOpen={handleOpenProject} />
          </div>
        ) : (
          <div className="flex h-full w-full">
            {/* Left Side: The Sketch Canvas */}
            <div className={`${showAI ? 'w-1/2' : 'w-full'} h-full border-r border-white/5 transition-all duration-700 ease-in-out`}>
              <SketchCanvas sketch={currentSketch} />
            </div>

            {/* Right Side: The AI Studio (Hideable) */}
            {showAI && (
              <div className="w-1/2 h-full bg-[#050505] transition-all duration-700 animate-in fade-in slide-in-from-right-10">
                <StudioWorkspace sketch={currentSketch} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;