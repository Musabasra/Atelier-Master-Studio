
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { Plus, RefreshCw, Clock } from 'lucide-react';

interface ArchivePageProps {
  projects: Project[];
}

const ArchivePage: React.FC<ArchivePageProps> = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h4 className="text-[#D4AF37] uppercase tracking-widest text-xs mb-2">Workspace</h4>
          <h1 className="font-serif text-5xl">Project Archive</h1>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-[#D4AF37] px-6 py-3 transition-colors text-sm uppercase tracking-wider text-gray-400 hover:text-[#D4AF37]">
            <RefreshCw className="w-4 h-4" />
            Sync Mobile
          </button>
          <button className="flex items-center gap-2 bg-[#800020] px-6 py-3 hover:bg-[#a00028] transition-colors text-sm uppercase tracking-wider">
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => navigate(`/studio/${project.id}`)}
            className="group cursor-pointer bg-[#1a1a1a] border border-transparent hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden flex flex-col"
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-semibold ${
                  project.status === 'Polished' ? 'bg-[#D4AF37] text-black' : 'bg-[#800020] text-white'
                }`}>
                  Status: {project.status}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white border-b border-white pb-1 tracking-widest uppercase text-xs">Open Studio</span>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl mb-1 group-hover:text-[#D4AF37] transition-colors">{project.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-tighter">
                  <Clock className="w-3 h-3" />
                  Synced {project.lastSynced}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivePage;
