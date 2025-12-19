import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, Eraser, Trash2, Layers, Copy, 
  ChevronUp, ChevronDown, Wand2, PaintBucket, 
  Columns, Undo2 
} from 'lucide-react';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const SketchCanvas = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#800020');
  const [lineWidth, setLineWidth] = useState(2);
  const [isMirroring, setIsMirroring] = useState(true); // Default for fashion symmetry
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket'>('brush');

  // Initialize with 2 layers: "Croquis" (Body) and "Design"
  useEffect(() => {
    const initialLayers = [
      { id: 0, name: 'Base Croquis', visible: true, canvasRef: React.createRef<HTMLCanvasElement>() },
      { id: 1, name: 'Design Layer', visible: true, canvasRef: React.createRef<HTMLCanvasElement>() }
    ];
    setLayers(initialLayers);
    setActiveLayerId(1);
  }, []);

  const getActiveCtx = () => {
    const layer = layers.find(l => l.id === activeLayerId);
    return layer?.canvasRef.current?.getContext('2d');
  };

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = getActiveCtx();
    if (!ctx) return;

    if (tool === 'bucket') {
      // Logic for flood fill would go here
      return;
    }

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = layers.find(l => l.id === activeLayerId)?.canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Main Stroke
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    // MIRROR LOGIC (The Procreate way)
    if (isMirroring) {
      const centerX = canvas.width / 2;
      const mirroredX = centerX + (centerX - offsetX);
      ctx.moveTo(mirroredX, offsetY); // This is a simplified mirror for the demo
      ctx.lineTo(mirroredX, offsetY); 
      ctx.stroke();
    }
  };

  const addLayer = () => {
    const newId = Math.max(...layers.map(l => l.id)) + 1;
    const newLayer = { id: newId, name: `Layer ${newId}`, visible: true, canvasRef: React.createRef<HTMLCanvasElement>() };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newId);
  };

  const moveLayer = (id: number, direction: 'up' | 'down') => {
    const index = layers.findIndex(l => l.id === id);
    const newLayers = [...layers];
    if (direction === 'up' && index > 0) {
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
    } else if (direction === 'down' && index < layers.length - 1) {
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
    }
    setLayers(newLayers);
  };

  return (
    <div className="flex h-full w-full bg-neutral-100 overflow-hidden relative">
      
      {/* --- FLOATING LEFT TOOLBAR (Brushes/Tools) --- */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#1a1a1a] p-3 rounded-2xl flex flex-col gap-5 shadow-2xl border border-white/10 z-50">
        <button onClick={() => setTool('brush')} className={tool === 'brush' ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'}><Pencil size={22} /></button>
        <button onClick={() => setTool('bucket')} className={tool === 'bucket' ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'}><PaintBucket size={22} /></button>
        <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'}><Eraser size={22} /></button>
        <div className="h-[1px] bg-white/10 my-1" />
        <button onClick={() => setIsMirroring(!isMirroring)} className={isMirroring ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'}><Columns size={22} /></button>
        <button onClick={() => {}} className="text-white/60 hover:text-white"><Undo2 size={22} /></button>
      </div>

      {/* --- CENTER CANVAS AREA --- */}
      <div className="flex-1 relative flex items-center justify-center p-10">
        <div className="relative w-[500px] h-[700px] bg-white shadow-2xl border border-black/5">
          {layers.map((layer) => (
            <canvas
              key={layer.id}
              ref={layer.canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              className={`absolute top-0 left-0 w-full h-full touch-none ${activeLayerId === layer.id ? 'z-10' : 'z-0'} ${!layer.visible && 'hidden'}`}
              style={{ pointerEvents: activeLayerId === layer.id ? 'auto' : 'none' }}
              width={500}
              height={700}
            />
          ))}
        </div>
      </div>

      {/* --- RIGHT LAYER PANEL --- */}
      <div className="w-68 bg-[#121212] border-l border-white/10 p-5 flex flex-col h-full shadow-2xl z-50">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-[#D4AF37] font-serif italic text-xl tracking-wide">Studio Layers</h4>
          <button onClick={addLayer} className="text-white/80 hover:text-[#D4AF37] transition-colors"><Copy size={20} /></button>
        </div>
        
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {layers.map((layer) => (
            <div 
              key={layer.id} 
              onClick={() => setActiveLayerId(layer.id)}
              className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-all duration-200 ${activeLayerId === layer.id ? 'bg-[#800020] border-[#D4AF37]/50 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <span className={`text-sm font-medium ${activeLayerId === layer.id ? 'text-white' : 'text-white/70'}`}>{layer.name}</span>
              <div className="flex gap-3 text-white/40">
                <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }} className="hover:text-white"><ChevronUp size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }} className="hover:text-white"><ChevronDown size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SketchCanvas;