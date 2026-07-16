/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Edit2, Eraser, RotateCcw } from "lucide-react";

interface DrawingCanvasProps {
  width: number;
  height: number;
  backgroundImageId?: string; // Optional SVG to draw over
  onSave?: (dataUrl: string) => void;
  savedDataUrl?: string;
  lang: "fr" | "en";
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  onSave,
  savedDataUrl,
  lang
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#E98074"); // Default berry pink
  const [isEraser, setIsEraser] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Get parent element's width, subtracting padding
        const parentElement = containerRef.current.parentElement;
        if (parentElement) {
          const parentWidth = parentElement.clientWidth - 16; // 16px safety margin
          if (parentWidth < width) {
            setScale(parentWidth / width);
          } else {
            setScale(1);
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    // Use a small timeout to let the DOM settle before measuring
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Configure line style
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;

    // Load saved drawing if exists
    if (savedDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedDataUrl;
    }
  }, [width, height]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getCoordinates(e);
    ctx.strokeStyle = isEraser ? "#fff" : color;
    ctx.lineWidth = isEraser ? 16 : 4;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvas();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Handle touch events
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: ((e.touches[0].clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.touches[0].clientY - rect.top) / rect.height) * canvas.height
      };
    }

    // Handle mouse events
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && onSave) {
      onSave(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvas();
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2 w-full my-2">
      {/* Canvas Wrapper */}
      <div 
        className="relative bg-white border-2 border-dashed border-forest-light rounded-xl overflow-hidden shadow-inner touch-none max-w-full"
        style={{ width: `${Math.floor(width * scale)}px`, height: `${Math.floor(height * scale)}px` }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 cursor-crosshair z-10"
        />
      </div>

      {/* Drawing Controls */}
      <div className="flex flex-wrap justify-center items-center gap-3 bg-warm-cream px-4 py-3 rounded-2xl sm:rounded-full border border-warm-border no-print">
        {/* Colors */}
        <div className="flex flex-wrap gap-2.5 sm:gap-1.5 border-r border-warm-border pr-3">
          {["#E98074", "#8B5E3C", "#F4D35E", "#5A7D51", "#A8DADC", "#4A443D"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              style={{ backgroundColor: c }}
              className={`w-8 h-8 sm:w-6 sm:h-6 rounded-full border transition-all cursor-pointer min-h-[32px] min-w-[32px] sm:min-h-[24px] sm:min-w-[24px] ${
                color === c && !isEraser ? "scale-110 border-gray-900 ring-2 ring-white" : "border-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Tools */}
        <div className="flex gap-2.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsEraser(false)}
            className={`p-2.5 sm:p-1.5 rounded-xl sm:rounded-lg border transition cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center ${
              !isEraser ? "bg-forest text-white border-forest" : "bg-white text-gray-700 border-gray-200 hover:border-forest-light"
            }`}
            title={lang === "fr" ? "Crayon" : "Pencil"}
          >
            <Edit2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => setIsEraser(true)}
            className={`p-2.5 sm:p-1.5 rounded-xl sm:rounded-lg border transition cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center ${
              isEraser ? "bg-forest text-white border-forest" : "bg-white text-gray-700 border-gray-200 hover:border-forest-light"
            }`}
            title={lang === "fr" ? "Gomme" : "Eraser"}
          >
            <Eraser size={18} />
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="p-2.5 sm:p-1.5 rounded-xl sm:rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center"
            title={lang === "fr" ? "Effacer tout" : "Clear all"}
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
