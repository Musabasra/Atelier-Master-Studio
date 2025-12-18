
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Wand2, MessageSquare, Sun, Move, 
  Layers, Download, RefreshCw, Plus, 
  ArrowLeft, CheckCircle2, MoreVertical
} from 'lucide-react';
import { Project, Tool, Annotation, Layer } from '../types';
import { polishIllustration } from '../services/geminiService';

interface StudioPageProps {
  projects: Project[];
}

const StudioPage: React.FC<StudioPageProps> = ({ projects }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === projectId);

  const [activeTool, setActiveTool] = useState<Tool>(Tool.SELECT);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedImage, setPolishedImage] = useState<string | null>(null);
  const [lighting, setLighting] = useState(45);
  const [layers, setLayers] = useState<Layer[]>(project?.layers || []);
  const [activeLayerId, setActiveLayerId] = useState<string>(project?.layers[0]?.id || '');

  // For multi-select commenting
  const [tempPoints, setTempPoints] = useState<{x: number, y: number}[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState({ label: '', instruction: '' });

  if (!project) return <div>Project not found</div>;

  const handleApplyPolish = async () => {
    setIsPolishing(true);
    const result = await polishIllustration(project.imageUrl, annotations, lighting);
    if (result) {
      setPolishedImage(result);
      const newLayer: Layer = { id: 'ai-' + Date.now(), name: 'AI Polished Finish', visible: true, type: 'ai-polish' };
      setLayers([newLayer, ...layers]);
      setActiveLayerId(newLayer.id);
    }
    setIsPolishing(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== Tool.COMMENT) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTempPoints([...tempPoints, { x, y }]);
    if (tempPoints.length >= 2) {
      setShowCommentModal(true);
    }
  };

  const addAnnotation = () => {
    if (!newComment.label) return;
    const annotation: Annotation = {
      id: Date.now().toString(),
      label: newComment.label,
      instruction: newComment.instruction,
      points: tempPoints
    };
    setAnnotations([...annotations, annotation]);
    setTempPoints([]);
    setNewComment({ label: '', instruction: '' });
    setShowCommentModal(false);
  };

  return (
    <div className="h-screen w-full flex bg-[#0f0f0f] overflow-hidden">
      {/* Navigation Top Bar */}
      <div className="absolute top-0 left-0 right-80 h-16 bg-[#121212] border-b border-gray-800 z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/archive')} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <span className="text-[#D4AF37] text-[10px] uppercase tracking-widest block font-medium">Editing Studio</span>
            <h2 className="font-serif text-lg">{project.title}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-700 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">History</button>
          <button className="px-4 py-2 bg-[#800020] text-xs uppercase tracking-widest hover:bg-[#a00028] transition-colors">Export .PSD</button>
        </div>
      </div>

      {/* Floating Left Toolbar */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        <div className="bg-[#121212] border border-gray-800 p-2 flex flex-col gap-2 shadow-2xl">
          <ToolbarButton 
            icon={<Wand2 className="w-5 h-5" />} 
            active={activeTool === Tool.SELECT} 
            onClick={() => setActiveTool(Tool.SELECT)}
            label="Magic Select"
          />
          <ToolbarButton 
            icon={<MessageSquare className="w-5 h-5" />} 
            active={activeTool === Tool.COMMENT} 
            onClick={() => setActiveTool(Tool.COMMENT)}
            label="Texture Label"
          />
          <ToolbarButton 
            icon={<Sun className="w-5 h-5" />} 
            active={activeTool === Tool.LIGHTING} 
            onClick={() => setActiveTool(Tool.LIGHTING)}
            label="Lighting Dial"
          />
          <ToolbarButton 
            icon={<Move className="w-5 h-5" />} 
            active={activeTool === Tool.POSE} 
            onClick={() => setActiveTool(Tool.POSE)}
            label="Pose Refine"
          />
        </div>

        {activeTool === Tool.LIGHTING && (
          <div className="bg-[#121212] border border-gray-800 p-4 w-48 shadow-2xl">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-4">Angle: {lighting}°</span>
            <input 
              type="range" 
              min="0" max="360" 
              value={lighting} 
              onChange={(e) => setLighting(parseInt(e.target.value))}
              className="w-full accent-[#800020]" 
            />
          </div>
        )}
      </div>

      {/* Central Canvas Area */}
      <main className="flex-1 mt-16 flex items-center justify-center p-12 bg-[#1a1a1a] relative">
        <div 
          className="relative bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] aspect-[3/4] h-full max-h-[85vh] group overflow-hidden cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {/* Main Illustration Image */}
          <img 
            src={polishedImage && layers.find(l => l.id === activeLayerId)?.type === 'ai-polish' ? polishedImage : project.imageUrl} 
            alt="Master Sketch"
            className="w-full h-full object-contain"
          />

          {/* Annotation Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {annotations.map((ann) => (
              <g key={ann.id}>
                <circle cx={`${ann.points[0].x}%`} cy={`${ann.points[0].y}%`} r="6" fill="#800020" />
                <path 
                  d={ann.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ')}
                  stroke="#800020" strokeWidth="2" fill="none"
                />
                <text x={`${ann.points[0].x}%`} y={`${ann.points[0].y - 2}%`} className="text-[10px] fill-[#D4AF37] font-bold uppercase tracking-widest">{ann.label}</text>
              </g>
            ))}
            {tempPoints.map((p, i) => (
              <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="4" fill="#D4AF37" />
            ))}
          </svg>

          {/* UI Polishing Overlay */}
          {isPolishing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm transition-all animate-in fade-in">
              <RefreshCw className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="font-serif text-2xl text-white">AI Refining Masterstroke...</p>
              <p className="text-gray-400 mt-2 text-sm">Stabilizing line weights and applying textures.</p>
            </div>
          )}
        </div>

        {/* Texture Modal */}
        {showCommentModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#121212] border border-[#D4AF37]/30 p-8 w-[400px] shadow-2xl">
              <h3 className="font-serif text-2xl mb-6 text-[#D4AF37]">Apply Texture Label</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Area Label (e.g. Sleeves)</label>
                  <input 
                    className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-sm focus:border-[#800020] outline-none"
                    value={newComment.label}
                    onChange={(e) => setNewComment({...newComment, label: e.target.value})}
                    placeholder="E.g. Bodice"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Instruction</label>
                  <textarea 
                    className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-sm focus:border-[#800020] outline-none h-24 resize-none"
                    value={newComment.instruction}
                    onChange={(e) => setNewComment({...newComment, instruction: e.target.value})}
                    placeholder="Render as heavy velvet with gold embroidery"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => { setShowCommentModal(false); setTempPoints([]); }}
                  className="flex-1 py-3 text-xs uppercase tracking-widest border border-gray-800 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={addAnnotation}
                  className="flex-1 py-3 text-xs uppercase tracking-widest bg-[#800020] hover:bg-[#a00028]"
                >
                  Save Area
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Layers Panel */}
      <aside className="w-80 bg-[#121212] border-l border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold">Studio Layers</h3>
          </div>
          <button className="p-1 hover:bg-gray-800 text-gray-400"><Plus className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {layers.map((layer) => (
            <div 
              key={layer.id}
              onClick={() => setActiveLayerId(layer.id)}
              className={`p-4 flex items-center gap-4 border-b border-gray-900 cursor-pointer transition-colors ${
                activeLayerId === layer.id ? 'bg-[#1a1a1a] border-l-2 border-l-[#D4AF37]' : 'hover:bg-[#151515]'
              }`}
            >
              <div className={`w-10 h-10 ${layer.type === 'ai-polish' ? 'bg-[#800020]' : 'bg-white'} border border-gray-800`}>
                <img src={project.imageUrl} className="w-full h-full object-cover opacity-30" alt="" />
              </div>
              <div className="flex-1">
                <p className={`text-xs ${activeLayerId === layer.id ? 'text-white font-bold' : 'text-gray-400'}`}>{layer.name}</p>
                <span className="text-[9px] text-gray-600 uppercase tracking-widest">{layer.type === 'ai-polish' ? 'AI Finalized' : 'Hand Sketch'}</span>
              </div>
              <button className="text-gray-700 hover:text-gray-400"><MoreVertical className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {/* Annotations List */}
        <div className="bg-[#0a0a0a] p-6 max-h-[300px] overflow-y-auto">
          <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Labels & Instructions</h4>
          {annotations.length === 0 && <p className="text-[10px] text-gray-700 italic">No textures defined yet.</p>}
          <div className="space-y-3">
            {annotations.map(ann => (
              <div key={ann.id} className="bg-[#121212] p-3 border border-gray-800">
                <p className="text-[#D4AF37] text-[10px] font-bold uppercase mb-1">{ann.label}</p>
                <p className="text-gray-400 text-[11px] leading-tight font-light">{ann.instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-80 h-20 bg-[#121212] border-t border-gray-800 px-8 flex items-center justify-between z-40">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-widest">
            <RefreshCw className="w-4 h-4" />
            Refresh Sync
          </button>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setAnnotations([])}
            className="px-6 py-3 border border-gray-800 text-xs uppercase tracking-widest hover:border-gray-600"
          >
            Clear Markers
          </button>
          <button 
            disabled={isPolishing}
            onClick={handleApplyPolish}
            className="px-8 py-3 bg-[#800020] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#a00028] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isPolishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Apply AI Polish
          </button>
          <button className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#c49f27] transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Illustration
          </button>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void; label: string }> = ({ icon, active, onClick, label }) => (
  <button 
    onClick={onClick}
    title={label}
    className={`p-4 transition-all duration-300 relative group ${
      active ? 'bg-[#800020] text-white scale-110 shadow-xl' : 'text-gray-500 hover:text-white hover:bg-gray-800'
    }`}
  >
    {icon}
    <div className="absolute left-full ml-4 px-2 py-1 bg-[#121212] border border-gray-800 text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {label}
    </div>
  </button>
);

export default StudioPage;
