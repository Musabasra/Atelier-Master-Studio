import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, Eraser, Trash2, Layers, Copy, 
  ChevronUp, ChevronDown, Wand2, PaintBucket, 
  Columns, Undo2, X, Eye, EyeOff, Pipette
} from 'lucide-react';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const SketchCanvas = ({ sketch }: { sketch: any }) => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: 1, name: 'Base Manuscript', visible: true, canvasRef: React.createRef<HTMLCanvasElement>() }
  ]);
  const [activeLayerId, setActiveLayerId] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#800020');
  const [lineWidth, setLineWidth] = useState(2);
  const [isMirroring, setIsMirroring] = useState(true);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket' | 'eyedropper'>('brush');
  const [showPanel, setShowPanel] = useState(true);

  // --- IMAGE AUTO-LOAD & SCALE-TO-FIT ---
  useEffect(() => {
    if (sketch?.sketchUrl && layers.length > 0) {
      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.onload = () => {
        const canvas = layers[0].canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
      };
      img.src = sketch.sketchUrl;
    }
  }, [sketch]);

  const getActiveCtx = () => {
    const layer = layers.find(l => l.id === activeLayerId);
    return layer?.canvasRef.current?.getContext('2d');
  };

  // --- PIXEL MANIPULATION HELPERS ---
  const getPixel = (imgData: ImageData, x: number, y: number) => {
    const i = (y * imgData.width + x) * 4;
    return [imgData.data[i], imgData.data[i+1], imgData.data[i+2], imgData.data[i+3]];
  };

  const setPixel = (imgData: ImageData, x: number, y: number, color: number[]) => {
    const i = (y * imgData.width + x) * 4;
    imgData.data[i] = color[0];
    imgData.data[i+1] = color[1];
    imgData.data[i+2] = color[2];
    imgData.data[i+3] = 255;
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // --- FLOOD FILL (BUCKET TOOL) ---
  const handleFloodFill = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const targetColor = getPixel(imageData, x, y);
    const fillRGB = hexToRgb(color);

    if (targetColor[0] === fillRGB[0] && targetColor[1] === fillRGB[1] && targetColor[2] === fillRGB[2]) return;

    const queue: [number, number][] = [[x, y]];
    while (queue.length > 0) {
      const [currX, currY] = queue.shift()!;
      const currentColor = getPixel(imageData, currX, currY);

      if (currentColor[0] === targetColor[0] && currentColor[1] === targetColor[1] && currentColor[2] === targetColor[2]) {
        setPixel(imageData, currX, currY, fillRGB);
        if (currX + 1 < imageData.width) queue.push([currX + 1, currY]);
        if (currX - 1 >= 0) queue.push([currX - 1, currY]);
        if (currY + 1 < imageData.height) queue.push([currX, currY + 1]);
        if (currY - 1 >= 0) queue.push([currX, currY - 1]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  // --- DRAWING LOGIC ---
  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = getActiveCtx();
    if (!ctx) return;

    const x = Math.floor(offsetX);
    const y = Math.floor(offsetY);

    if (tool === 'bucket') {
      handleFloodFill(ctx, x, y);
      return;
    }

    if (tool === 'eyedropper') {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setColor(hex);
      setTool('brush');
      return;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Switch between painting and erasing
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 5; 
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = getActiveCtx();
    if (!ctx) return;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    if (isMirroring) {
      const canvas = ctx.canvas;
      const mirroredX = canvas.width - offsetX;
      ctx.save();
      // Draw mirroring stroke using separate point to avoid connecting line
      ctx.beginPath();
      ctx.arc(mirroredX, offsetY, ctx.lineWidth / 2, 0, Math.PI * 2);
      if (tool === 'eraser') ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color;
      ctx.fill();
      ctx.restore();
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  // Layer Management
  const addLayer = () => {
    const newId = Date.now();
    setLayers([...layers, { id: newId, name: `Layer ${layers.length + 1}`, visible: true, canvasRef: React.createRef<HTMLCanvasElement>() }]);
    setActiveLayerId(newId);
  };

  return (
    <div className="flex h-full w-full bg-[#1a1a1a] overflow-hidden relative">
      
      {/* SIDE TOOLBAR */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#121212] p-3 rounded-2xl flex flex-col gap-5 shadow-2xl border border-white/10 z-50">
        <button onClick={() => setTool('brush')} className={tool === 'brush' ? 'text-[#D4AF37]' : 'text-white/60'}><Pencil size={20} /></button>
        <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'text-[#D4AF37]' : 'text-white/60'}><Eraser size={20} /></button>
        <button onClick={() => setTool('bucket')} className={tool === 'bucket' ? 'text-[#D4AF37]' : 'text-white/60'}><PaintBucket size={20} /></button>
        <button onClick={() => setTool('eyedropper')} className={tool === 'eyedropper' ? 'text-[#D4AF37]' : 'text-white/60'}><Pipette size={20} /></button>
        <div className="h-[1px] bg-white/10 my-1" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 rounded-full overflow-hidden border-none bg-transparent cursor-pointer" />
        <button onClick={() => setIsMirroring(!isMirroring)} className={isMirroring ? 'text-[#D4AF37]' : 'text-white/60'}><Columns size={20} /></button>
      </div>

      {/* CANVAS AREA */}
      <div className="flex-1 relative flex items-center justify-center p-10 bg-[#0d0d0d]">
        <div className="relative w-[500px] h-[700px] bg-white shadow-2xl overflow-hidden">
          {layers.map((layer) => (
            <canvas
              key={layer.id}
              ref={layer.canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              width={500}
              height={700}
              className={`absolute top-0 left-0 w-full h-full touch-none ${activeLayerId === layer.id ? 'z-10' : 'z-0'} ${!layer.visible && 'hidden'}`}
              style={{ pointerEvents: activeLayerId === layer.id ? 'auto' : 'none' }}
            />
          ))}
        </div>
      </div>

      {/* LAYER PANEL */}
      {showPanel && (
        <div className="w-72 bg-[#121212] border-l border-white/10 p-5 flex flex-col h-full shadow-2xl z-50 text-white font-sans">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-[#D4AF37] font-serif italic text-xl tracking-widest">Studio Layers</h4>
            <button onClick={addLayer} className="hover:text-[#D4AF37] transition-colors"><Copy size={18} /></button>
          </div>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {[...layers].reverse().map((layer) => (
              <div 
                key={layer.id} 
                onClick={() => setActiveLayerId(layer.id)}
                className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-all ${activeLayerId === layer.id ? 'bg-[#800020] border-[#D4AF37]/50 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${activeLayerId === layer.id ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
                   <span className="text-sm tracking-wide">{layer.name}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); /* Add visibility toggle logic here */ }} className="text-white/20 hover:text-white">
                  <Eye size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SketchCanvas;