import React, { useState } from 'react';
import Gallery from './components/Gallery';
import SketchCanvas from './components/SketchCanvas';
import StudioWorkspace from './components/StudioWorkspace';

const App: React.FC = () => {
  const [view, setView] = useState<'GALLERY' | 'WORKBENCH'>('GALLERY');
  const [showAI, setShowAI] = useState(true); // Toggle for the side-by-side view
  const [currentSketch, setCurrentSketch] = useState<any>(null);

  const handleOpenProject = (sketch: any) => {
    setCurrentSketch(sketch);
    setView('WORKBENCH');
  };

  return (
    <div className="h-screen w-full bg-charcoal text-white flex flex-col overflow-hidden">
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-charcoal">
        <div className="flex items-center gap-8">
          <h1 className="font-serif text-2xl text-gold tracking-tighter">ATELIER MASTER</h1>
          <button 
            onClick={() => setView('GALLERY')}
            className={`text-xs uppercase tracking-widest ${view === 'GALLERY' ? 'text-gold' : 'text-white/50'}`}
          >
            Gallery
          </button>
          <button 
            onClick={() => setView('WORKBENCH')}
            className={`text-xs uppercase tracking-widest ${view === 'WORKBENCH' ? 'text-gold' : 'text-white/50'}`}
          >
            Workbench
          </button>
        </div>

        {view === 'WORKBENCH' && (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAI(!showAI)}
              className="px-4 py-1 border border-gold text-gold text-xs rounded-full hover:bg-gold hover:text-charcoal transition"
            >
              {showAI ? 'Hide AI Preview' : 'Show AI Preview'}
            </button>
            <button className="bg-burgundy px-6 py-1 text-xs rounded-full">Sync from Mobile</button>
          </div>
        )}
      </nav>

      <main class="flex-1 relative overflow-hidden">
        {view === 'GALLERY' ? (
          <Gallery onOpen={handleOpenProject} />
        ) : (
          <div className="flex h-full w-full">
            {/* Left Side: The Sketch Canvas */}
            <div className={`${showAI ? 'w-1/2' : 'w-full'} h-full border-r border-white/5 transition-all duration-500`}>
              <SketchCanvas sketch={currentSketch} />
            </div>

            {/* Right Side: The AI Studio (Hideable) */}
            {showAI && (
              <div className="w-1/2 h-full bg-[#0a0a0a] transition-all duration-500 animate-in fade-in slide-in-from-right-4">
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