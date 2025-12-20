import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, Eraser, Trash2, Layers, Copy, 
  ChevronUp, ChevronDown, Wand2, PaintBucket, 
  Columns, Undo2, X, Eye, EyeOff
} from 'lucide-react';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

// Added 'sketch' prop to receive data from Gallery via App.tsx
const SketchCanvas = ({ sketch }: { sketch: any }) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#800020');
  const [lineWidth, setLineWidth] = useState(2);
  const [isMirroring, setIsMirroring] = useState(true);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket'>('brush');
  const [showPanel, setShowPanel] = useState(true);

  // Initialize Layers
  useEffect(() => {
  if (sketch?.sketchUrl && layers.length > 0) {
    const img = new Image();
    
    // THIS LINE IS CRITICAL FOR EXTERNAL LINKS
    img.setAttribute('crossOrigin', 'anonymous'); 
    
    img.onload = () => {
      const canvas = layers.find(l => l.id === 1)?.canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        // Clear everything first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the new image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        console.log("Image loaded successfully onto canvas");
      }
    };

    img.onerror = (err) => {
      console.error("Failed to load image:", sketch.sketchUrl);
    };

    img.src = sketch.sketchUrl;
  }
}, [sketch, layers]);

  // --- NEW: AUTO-LOAD SKETCH IMAGE ---
  useEffect(() => {
    if (sketch?.sketchUrl && layers.length > 0) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Helps with loading external links
      img.onload = () => {
        // Target the Design Layer (ID 1)
        const canvas = layers.find(l => l.id === 1)?.canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous work
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
      img.src = sketch.sketchUrl;
    }
  }, [sketch, layers]);

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

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    if (isMirroring) {
      const centerX = canvas.width / 2;
      const mirroredX = centerX + (centerX - offsetX);
      ctx.save(); 
      ctx.beginPath(); // New path for mirror to avoid connecting lines
      ctx.moveTo(mirroredX, offsetY);
      ctx.lineTo(mirroredX, offsetY); 
      ctx.stroke();
      ctx.restore();
    }
  };

  const addLayer = () => {
    const newId = Date.now();
    const newLayer = { id: newId, name: `Layer ${layers.length + 1}`, visible: true, canvasRef: React.createRef<HTMLCanvasElement>() };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newId);
  };

  const deleteLayer = (id: number) => {
    if (layers.length <= 1) return;
    const filtered = layers.filter(l => l.id !== id);
    setLayers(filtered);
    if (activeLayerId === id) setActiveLayerId(filtered[0].id);
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
    <div className="flex h-full w-full bg-[#1a1a1a] overflow-hidden relative">
      
      {/* --- LEFT TOOLBAR --- */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#121212] p-3 rounded-2xl flex flex-col gap-5 shadow-2xl border border-white/10 z-50">
        <button onClick={() => setTool('brush')} className={tool === 'brush' ? 'text-[#D4AF37]' : 'text-white/60'}><Pencil size={22} /></button>
        <button onClick={() => setTool('bucket')} className={tool === 'bucket' ? 'text-[#D4AF37]' : 'text-white/60'}><PaintBucket size={22} /></button>
        <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'text-[#D4AF37]' : 'text-white/60'}><Eraser size={22} /></button>
        
        <div className="h-[1px] bg-white/10 my-1" />
        
        <label className="cursor-pointer text-white/60 hover:text-[#D4AF37] transition-colors">
          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => getActiveCtx()?.drawImage(img, 0, 0, 500, 700);
                img.src = ev.target?.result as string;
              };
              reader.readAsDataURL(file);
            }
          }} />
          <Wand2 size={22} />
        </label>

        <button onClick={() => setIsMirroring(!isMirroring)} className={isMirroring ? 'text-[#D4AF37]' : 'text-white/60'}><Columns size={22} /></button>
        <button className="text-white/60"><Undo2 size={22} /></button>
      </div>

      {/* --- CENTER CANVAS --- */}
      <div className="flex-1 relative flex items-center justify-center p-10 bg-[#0d0d0d]">
        <div className="relative w-[500px] h-[700px] bg-white shadow-2xl border border-[#D4AF37]/20">
          {layers.map((layer) => (
            <canvas
              key={layer.id}
              ref={layer.canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              width={500}
              height={700}
              className={`absolute top-0 left-0 w-full h-full touch-none ${activeLayerId === layer.id ? 'z-10' : 'z-0'} ${!layer.visible && 'hidden'}`}
              style={{ pointerEvents: activeLayerId === layer.id ? 'auto' : 'none' }}
            />
          ))}
        </div>
      </div>

      {/* --- LAYER PANEL TOGGLE --- */}
      {!showPanel && (
        <button 
          onClick={() => setShowPanel(true)}
          className="absolute right-6 top-6 bg-[#1a1a1a] p-3 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] shadow-xl z-50 hover:scale-110 transition-transform"
        >
          <Layers size={24} />
        </button>
      )}

      {/* --- RIGHT LAYER PANEL --- */}
      {showPanel && (
        <div className="w-72 bg-[#121212] border-l border-white/10 p-5 flex flex-col h-full shadow-2xl z-50 text-white">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-[#D4AF37] font-serif italic text-xl tracking-widest">Layers</h4>
            <div className="flex gap-3">
              <button onClick={addLayer} className="text-white/60 hover:text-[#D4AF37]"><Copy size={18} /></button>
              <button onClick={() => setShowPanel(false)} className="text-white/60 hover:text-red-400"><X size={18} /></button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {layers.map((layer) => (
              <div 
                key={layer.id} 
                onClick={() => setActiveLayerId(layer.id)}
                className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-all ${activeLayerId === layer.id ? 'bg-[#800020] border-[#D4AF37]/50 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <span className="text-sm font-medium">{layer.name}</span>
                <div className="flex gap-2 text-white/40">
                  <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} className="hover:text-red-500"><Trash2 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }} className="hover:text-white"><ChevronUp size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }} className="hover:text-white"><ChevronDown size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SketchCanvas;