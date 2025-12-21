import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, Eraser, Trash2, Copy, Plus,
  Wand2, PaintBucket, Columns, Undo2, 
  Pipette, MousePointer2, Eye, EyeOff, Download, Save
} from 'lucide-react';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const SketchCanvas = ({ sketch, onSave }: { sketch: any, onSave: (data: string) => void }) => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: 1, name: 'Base Manuscript', visible: true, canvasRef: React.createRef<HTMLCanvasElement>() }
  ]);
  const [activeLayerId, setActiveLayerId] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#800020');
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket'>('brush');

  // --- NEW: ADD LAYER LOGIC ---
  const addLayer = () => {
    const newId = Date.now();
    const newLayer = {
      id: newId,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      canvasRef: React.createRef<HTMLCanvasElement>()
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newId);
  };

  // --- SAVE & SYNC LOGIC ---
  const handleSaveToGallery = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 500;
    tempCanvas.height = 700;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Draw visible layers onto one image for the gallery thumbnail
    layers.forEach(layer => {
      if (layer.visible && layer.canvasRef.current) {
        tempCtx.drawImage(layer.canvasRef.current, 0, 0);
      }
    });

    onSave(tempCanvas.toDataURL('image/png'));
  };

  // --- DOWNLOAD LOGIC ---
  const downloadMergedImage = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 500;
    tempCanvas.height = 700;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.fillStyle = '#ffffff'; // White background for export
    tempCtx.fillRect(0, 0, 500, 700);

    layers.forEach(layer => {
      if (layer.visible && layer.canvasRef.current) {
        tempCtx.drawImage(layer.canvasRef.current, 0, 0);
      }
    });

    const link = document.createElement('a');
    link.download = `manuscript-${sketch?.title || 'export'}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  const toggleVisibility = (id: number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const deleteLayer = (id: number) => {
    if (layers.length <= 1) return;
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (activeLayerId === id) setActiveLayerId(newLayers[0].id);
  };

  const getActiveCtx = () => {
    const layer = layers.find(l => l.id === activeLayerId);
    return layer?.canvasRef.current?.getContext('2d');
  };

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = getActiveCtx();
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineCap = 'round';
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 5 : lineWidth;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = getActiveCtx();
    if (!ctx) return;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  return (
    <div className="flex h-full w-full bg-[#1a1a1a] overflow-hidden relative font-sans">
      
      {/* --- SIDE TOOLBAR --- */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#121212] p-4 rounded-3xl flex flex-col gap-6 shadow-2xl border border-white/10 z-50 items-center">
        <button onClick={() => setTool('brush')} className={tool === 'brush' ? 'text-[#D4AF37]' : 'text-white/40'}><Pencil size={20} /></button>
        <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'text-[#D4AF37]' : 'text-white/40'}><Eraser size={20} /></button>
        <div className="h-[1px] bg-white/10 w-full" />
        {/* NEW SAVE BUTTON */}
        <button onClick={handleSaveToGallery} className="text-emerald-500 hover:scale-110 transition-transform" title="Save to Gallery"><Save size={22} /></button>
        <button onClick={downloadMergedImage} className="text-[#D4AF37] hover:scale-110 transition-transform" title="Download Manuscript"><Download size={22} /></button>
      </div>

      {/* --- CANVAS AREA --- */}
      <div className="flex-1 relative flex items-center justify-center p-10 bg-[#0d0d0d]">
        <div className="relative w-[500px] h-[700px] bg-white shadow-2xl overflow-hidden">
          {layers.map((layer) => (
            <canvas
              key={layer.id}
              ref={layer.canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              width={500}
              height={700}
              className={`absolute top-0 left-0 w-full h-full ${activeLayerId === layer.id ? 'z-10' : 'z-0'} ${!layer.visible ? 'invisible' : 'visible'}`}
              style={{ pointerEvents: activeLayerId === layer.id ? 'auto' : 'none', imageRendering: 'pixelated' }}
            />
          ))}
        </div>
      </div>

      {/* --- LAYER PANEL --- */}
      <div className="w-72 bg-[#121212] border-l border-white/5 p-5 flex flex-col h-full shadow-2xl z-50 text-white">
        <div className="flex justify-between items-center mb-8">
            <h4 className="text-[#D4AF37] font-serif italic text-sm tracking-widest uppercase">Layers</h4>
            <button onClick={addLayer} className="p-1 hover:bg-white/10 rounded transition-colors text-[#D4AF37]">
                <Plus size={18} />
            </button>
        </div>
        
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {[...layers].reverse().map((layer) => (
            <div 
              key={layer.id} 
              onClick={() => setActiveLayerId(layer.id)}
              className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-all ${activeLayerId === layer.id ? 'bg-[#800020] border-[#D4AF37]/30 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }}>
                  {layer.visible ? <Eye size={14} className="text-[#D4AF37]" /> : <EyeOff size={14} className="text-white/20" />}
                </button>
                <span className="text-[10px] uppercase tracking-[0.2em]">{layer.name}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} className="text-white/20 hover:text-red-500 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SketchCanvas;