import React, { useState } from 'react';
import Gallery from './Gallery.tsx';
import SketchCanvas from './SketchCanvas.tsx';
import StudioWorkspace from './StudioWorkspace.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<'GALLERY' | 'WORKBENCH'>('GALLERY');
  const [showAI, setShowAI] = useState(true);
  
  // Lifted state: projects live here now
  const [projects, setProjects] = useState<any[]>([
    { 
      id: 1, 
      title: 'Avant-Garde Sculpture', 
      sketchUrl: 'https://i.postimg.cc/mrfdzFm3/sketch1.png',
      renderedUrl: 'https://i.postimg.cc/Wbx8CkLX/render1.png',
      date: '21 DEC 2025',
      resolution: '2048 x 2048'
    },
    { 
      id: 2, 
      title: 'Editorial Silhouette', 
      sketchUrl: 'https://i.postimg.cc/T1wQMjPG/sketch2.png', 
      renderedUrl: 'https://i.postimg.cc/XJ2c8Zkw/render2.png',
      date: '18 DEC 2025',
      resolution: '2048 x 2048'
    }
  ]);

  const [currentSketch, setCurrentSketch] = useState<any>(null);

  const handleOpenProject = (sketch: any) => {
    setCurrentSketch(sketch);
    setView('WORKBENCH');
  };

  const handleAddNewProject = () => {
    const newId = Date.now();
    const newProject = {
      id: newId,
      title: `Archive _${projects.length + 1}`,
      sketchUrl: '', // Blank canvas
      renderedUrl: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      resolution: '2048 x 2048'
    };
    
    setProjects([newProject, ...projects]);
    handleOpenProject(newProject);
  };

  // Function to save the canvas drawing back to the gallery item
  const handleSaveProject = (canvasDataUrl: string) => {
    setProjects(prev => prev.map(p => 
      p.id === currentSketch.id ? { ...p, sketchUrl: canvasDataUrl } : p
    ));
    // Optional: show a "Saved" toast/notification
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#121212] z-50">
        <div className="flex items-center gap-12">
          <h1 className="font-serif text-3xl text-[#D4AF37] tracking-tighter italic cursor-pointer" onClick={() => setView('GALLERY')}>ATELIER MASTER</h1>
          <div className="flex gap-8">
            <button onClick={() => setView('GALLERY')} className={`text-[10px] uppercase tracking-[0.3em] ${view === 'GALLERY' ? 'text-[#D4AF37]' : 'text-white/30'}`}>The Gallery</button>
            <button onClick={() => setView('WORKBENCH')} className={`text-[10px] uppercase tracking-[0.3em] ${view === 'WORKBENCH' ? 'text-[#D4AF37]' : 'text-white/30'}`}>The Studio</button>
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
          </div>
        )}
      </nav>

      <main className="flex-1 relative overflow-hidden bg-[#0d0d0d]">
        {view === 'GALLERY' ? (
          <div className="h-full overflow-y-auto">
            <Gallery 
              projects={projects} 
              onOpen={handleOpenProject} 
              onAdd={handleAddNewProject} 
            />
          </div>
        ) : (
          <div className="flex h-full w-full">
            <div className={`${showAI ? 'w-1/2' : 'w-full'} h-full border-r border-white/5 transition-all duration-700`}>
              {/* Pass the save handler to the canvas */}
              <SketchCanvas sketch={currentSketch} onSave={handleSaveProject} />
            </div>
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