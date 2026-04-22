"use client";

import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const cols = 40;
    const rows = 30;
    const spacingX = width / cols;
    const spacingY = height / rows;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint dot grid
      ctx.fillStyle = "rgba(0, 229, 200, 0.1)";
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX;
          const y = j * spacingY;

          // Distance to mouse
          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Reactive glow
          const maxDist = 200;
          let size = 1;
          let alpha = 0.05;

          if (dist < maxDist) {
            const ratio = 1 - dist / maxDist;
            size = 1 + ratio * 2;
            alpha = 0.05 + ratio * 0.3;
          }

          ctx.fillStyle = `rgba(0, 229, 200, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby dots near mouse
          if (dist < maxDist * 0.6) {
            const ratio = 1 - dist / (maxDist * 0.6);
            ctx.strokeStyle = `rgba(0, 229, 200, ${ratio * 0.15})`;
            ctx.lineWidth = 0.5;
            
            // Link right
            if (i < cols - 1) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo((i + 1) * spacingX, y);
              ctx.stroke();
            }
            // Link down
            if (j < rows - 1) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, (j + 1) * spacingY);
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-50"
    />
  );
}
