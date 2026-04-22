"use client";

import { useEffect, useRef, useState } from "react";

interface PixelRenderProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PixelRender({ src, alt, className = "" }: PixelRenderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      // Size the canvas to the container
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      // Draw full image to an offscreen canvas to read pixels
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d")!;
      
      // Draw image centered/covered
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let drawW: number, drawH: number, drawX: number, drawY: number;
      if (imgRatio > canvasRatio) {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      } else {
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      }
      offCtx.drawImage(img, drawX, drawY, drawW, drawH);

      // Pixel sizes: start from very blocky → sharp
      // More steps for smoother animation
      const pixelSteps = [64, 48, 32, 24, 16, 12, 8, 6, 4, 2, 1];
      let stepIndex = 0;
      const stepDelay = 180; // ms between each resolution step

      const drawPixelated = (pixelSize: number) => {
        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = false;

        if (pixelSize <= 1) {
          // Final: draw full resolution
          ctx.drawImage(offscreen, 0, 0, w, h);
          return;
        }

        // Draw the image small, then scale it up for the pixelated effect
        const smallW = Math.ceil(w / pixelSize);
        const smallH = Math.ceil(h / pixelSize);

        // Tiny canvas
        const tiny = document.createElement("canvas");
        tiny.width = smallW;
        tiny.height = smallH;
        const tinyCtx = tiny.getContext("2d")!;
        tinyCtx.imageSmoothingEnabled = false;
        tinyCtx.drawImage(offscreen, 0, 0, smallW, smallH);

        // Draw it scaled up
        ctx.drawImage(tiny, 0, 0, smallW, smallH, 0, 0, w, h);
      };

      // Initial: draw fully pixelated
      drawPixelated(pixelSteps[0]);

      const animate = () => {
        stepIndex++;
        if (stepIndex < pixelSteps.length) {
          drawPixelated(pixelSteps[stepIndex]);
          setTimeout(animate, stepDelay);
        } else {
          setLoaded(true);
        }
      };

      // Start the animation after a small delay
      setTimeout(animate, 400);
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label={alt}
      />
      {/* Scanline overlay during render */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 229, 200, 0.03) 2px, rgba(0, 229, 200, 0.03) 4px)",
        }}
      />
    </div>
  );
}
