"use client";

import { useEffect, useRef, useCallback } from "react";

interface PointCloudRenderProps {
  src: string;
  alt: string;
  className?: string;
  particleCount?: number;
  formationDuration?: number;
}

interface Particle {
  tx: number;
  ty: number;
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  r: number;
  g: number;
  b: number;
  a: number;
  delay: number;
  size: number;
}

export default function PointCloudRender({
  src,
  alt,
  className = "",
  particleCount = 8000,
  formationDuration = 4,
}: PointCloudRenderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const initParticles = useCallback(
    (img: HTMLImageElement, w: number, h: number): Particle[] => {
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d")!;

      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (imgRatio > canvasRatio) {
        drawW = w; drawH = w / imgRatio; drawX = 0; drawY = (h - drawH) / 2;
      } else {
        drawH = h; drawW = h * imgRatio; drawX = (w - drawW) / 2; drawY = 0;
      }

      offCtx.drawImage(img, drawX, drawY, drawW, drawH);
      const imageData = offCtx.getImageData(0, 0, w, h);
      const pixels = imageData.data;

      const validPixels: { x: number; y: number; r: number; g: number; b: number; a: number }[] = [];
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const i = (y * w + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          if (a > 30 && (r + g + b) > 30) {
            validPixels.push({ x, y, r, g, b, a });
          }
        }
      }

      const particles: Particle[] = [];
      const count = Math.min(particleCount, validPixels.length);

      for (let i = 0; i < count; i++) {
        const idx = Math.floor((i / count) * validPixels.length);
        const px = validPixels[idx];
        const angle = Math.random() * Math.PI * 2;
        const radius = 150 + Math.random() * 300;
        const sz = (Math.random() - 0.5) * 400;

        particles.push({
          tx: px.x, ty: px.y,
          x: w / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
          y: h / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
          z: sz,
          sx: w / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
          sy: h / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
          sz: sz,
          r: px.r, g: px.g, b: px.b, a: px.a,
          delay: Math.random() * 0.4,
          size: 1 + Math.random() * 2,
        });
      }
      return particles;
    },
    [particleCount]
  );

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
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      const particles = initParticles(img, w, h);
      startTimeRef.current = performance.now();

      const duration = formationDuration * 1000;
      let formed = false;

      // Contained image drawing helper
      const getContainDims = () => {
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;
        if (imgRatio > canvasRatio) {
          const dW = w, dH = w / imgRatio;
          return { dW, dH, dX: 0, dY: (h - dH) / 2 };
        } else {
          const dH = h, dW = h * imgRatio;
          return { dW, dH, dX: (w - dW) / 2, dY: 0 };
        }
      };

      const drawContainedImage = (opacity: number) => {
        const { dW, dH, dX, dY } = getContainDims();
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, dX, dY, dW, dH);
        ctx.globalAlpha = 1;
      };

      // Main point cloud animation
      const animate = (now: number) => {
        const elapsed = now - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
          const individualProgress = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));
          const eased = 1 - Math.pow(1 - individualProgress, 3);

          p.x = p.sx + (p.tx - p.sx) * eased;
          p.y = p.sy + (p.ty - p.sy) * eased;
          p.z = p.sz * (1 - eased);

          const perspective = 600;
          const scale = perspective / (perspective + p.z);
          const screenX = w / 2 + (p.x - w / 2) * scale;
          const screenY = h / 2 + (p.y - h / 2) * scale;

          const alpha = (p.a / 255) * (0.3 + eased * 0.7);
          const size = p.size * scale;

          const r = Math.round(0 + (p.r - 0) * eased);
          const g = Math.round(229 + (p.g - 229) * eased);
          const b = Math.round(200 + (p.b - 200) * eased);

          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);

          if (eased < 0.5) {
            ctx.fillStyle = `rgba(0,229,200,${alpha * 0.15 * (1 - eased * 2)})`;
            ctx.fillRect(screenX - size * 1.5, screenY - size * 1.5, size * 3, size * 3);
          }
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else if (!formed) {
          formed = true;
          // Fade from particles → full image (clean, no color overlay)
          setTimeout(() => {
            let fadeProgress = 0;
            const fadeIn = () => {
              fadeProgress += 0.04;
              if (fadeProgress > 1) fadeProgress = 1;

              ctx.clearRect(0, 0, w, h);
              for (const p of particles) {
                const alpha = (p.a / 255) * (1 - fadeProgress * 0.6);
                ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
                ctx.fillRect(p.tx - p.size / 2, p.ty - p.size / 2, p.size, p.size);
              }
              drawContainedImage(fadeProgress);

              if (fadeProgress < 1) {
                requestAnimationFrame(fadeIn);
              }
              // Done — image stays clean, no shimmer
            };
            requestAnimationFrame(fadeIn);
          }, 400);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [src, initParticles, formationDuration]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" aria-label={alt} />
    </div>
  );
}
