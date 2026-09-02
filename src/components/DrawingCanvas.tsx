import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '@/lib/gameStore';

interface BrushConfig {
  id: string;
  name: string;
  size: number;
  type: 'normal' | 'glow' | 'glitter' | 'gradient';
  icon: string;
}

const BRUSH_CONFIGS: BrushConfig[] = [
  { id: 'brush-basic', name: 'Basic', size: 10, type: 'normal', icon: '🖌️' },
  { id: 'brush-glow', name: 'Glow', size: 12, type: 'glow', icon: '✨' },
  { id: 'brush-glitter', name: 'Glitter', size: 15, type: 'glitter', icon: '💫' },
  { id: 'brush-gradient', name: 'Rainbow', size: 14, type: 'gradient', icon: '🌈' },
];

const COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
  '#0000FF', '#4B0082', '#9400D3', '#FF1493',
  '#00CED1', '#32CD32', '#FFD700', '#000000',
  '#FFFFFF', '#808080', '#FFA500', '#FF69B4',
];

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [brushSize, setBrushSize] = useState(10);
  
  const { selectedColor, selectedBrush, addCoins, completeDrawing, getCurrentTemplate } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setContext(ctx);
  }, []);

  const getBrushConfig = (): BrushConfig => {
    return BRUSH_CONFIGS.find(b => b.id === selectedBrush) || BRUSH_CONFIGS[0];
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const brush = getBrushConfig();

    context.strokeStyle = selectedColor;
    context.lineWidth = brush.size;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Add glow effect for special brushes
    if (brush.type === 'glow') {
      context.shadowColor = selectedColor;
      context.shadowBlur = 10;
    } else if (brush.type === 'glitter') {
      context.shadowColor = selectedColor;
      context.shadowBlur = 5;
    } else {
      context.shadowBlur = 0;
    }

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveDrawing = () => {
    const template = getCurrentTemplate();
    if (!template) return;

    // Award coins
    addCoins(template.reward);
    completeDrawing(template.id);

    // Show celebration
    alert(`🎉 Great job! You earned ${template.reward} coins!`);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `colorquest-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-purple-100 to-blue-100 rounded-lg">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
        <h2 className="text-2xl font-bold">🎨 Drawing Canvas</h2>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-4 overflow-auto">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full bg-white rounded-lg cursor-crosshair border-4 border-purple-300 shadow-lg"
        />
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white border-t-4 border-purple-300">
        {/* Brush Selection */}
        <div className="mb-4">
          <p className="text-sm font-bold text-purple-600 mb-2">✨ Brushes</p>
          <div className="flex gap-2 flex-wrap">
            {BRUSH_CONFIGS.map((brush) => (
              <button
                key={brush.id}
                onClick={() => {
                  const config = useGameStore.getState();
                  config.selectBrush(brush.id);
                  setBrushSize(brush.size);
                }}
                className={`p-2 rounded-lg transition-all ${
                  selectedBrush === brush.id
                    ? 'bg-purple-500 text-white scale-110'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title={brush.name}
              >
                {brush.icon} {brush.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <p className="text-sm font-bold text-purple-600 mb-2">🎨 Colors</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  const config = useGameStore.getState();
                  config.selectColor(color);
                }}
                className={`w-8 h-8 rounded-full border-4 transition-all ${
                  selectedColor === color ? 'border-black scale-125' : 'border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Brush Size Slider */}
        <div className="mb-4">
          <label className="text-sm font-bold text-purple-600">
            Size: {brushSize}px
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={brushSize}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setBrushSize(size);
            }}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={clearCanvas}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            🗑️ Clear
          </button>
          <button
            onClick={downloadDrawing}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            📥 Save
          </button>
          <button
            onClick={saveDrawing}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            ✅ Submit
          </button>
        </div>
      </div>
    </div>
  );
};
