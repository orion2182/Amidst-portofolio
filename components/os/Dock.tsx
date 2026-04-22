"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useWindowManager } from "./WindowManager";

interface DockItemConfig {
  id: string;
  label: string;
  iconUrl: string; // We'll use emojis or simple SVGs, but representing colored icons.
  component: string;
}

const dockItems: DockItemConfig[] = [
  { id: "terminal", label: "Profile", iconUrl: "LYNAE_IMG", component: "terminal" },
  { id: "ctf", label: "CTF Writeups", iconUrl: "🚩", component: "ctf" },
  { id: "projects", label: "Projects", iconUrl: "📂", component: "projects" },
  { id: "blog", label: "Blog Logs", iconUrl: "📝", component: "blog" },
  { id: "experience", label: "Experience", iconUrl: "💼", component: "experience" },
];

function DockIcon({ item, mouseX }: { item: DockItemConfig; mouseX: number | null }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { openWindow, windows, activeWindowId } = useWindowManager();
  const [scale, setScale] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  const isOpen = windows.some(w => w.id === item.id);
  const isActive = activeWindowId === item.id;

  // Magnification effect
  useEffect(() => {
    if (mouseX === null || !ref.current) {
      setScale(1);
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const iconCenter = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - iconCenter);
    const maxDist = 120;
    const maxScale = 1.6;

    if (dist < maxDist) {
      const ratio = 1 - dist / maxDist;
      setScale(1 + ratio * (maxScale - 1));
    } else {
      setScale(1);
    }
  }, [mouseX]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/80 backdrop-blur-xl text-black/80 font-medium text-[12px] rounded-lg shadow-lg border border-white/60 whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
      <button
        ref={ref}
        onClick={() => openWindow(item.id, item.label, item.iconUrl !== "LYNAE_IMG" ? item.iconUrl : "👤", item.component)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-lg border border-white/60 shadow-sm transition-colors duration-200 cursor-pointer overflow-hidden"
        style={{
          transform: `scale(${scale}) translateY(${(scale - 1) * -16}px)`,
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <span className="flex items-center justify-center w-full h-full drop-shadow-md" style={{ transform: `scale(${1 / scale * 1.1})`, transition: 'transform 0.15s ease' }}>
          {item.iconUrl === "LYNAE_IMG" ? (
            <img src="/assets/lynae_icon.webp" alt="Profile" className="w-full h-full object-cover rounded-xl shadow-sm" />
          ) : (
            <span className="text-2xl">{item.iconUrl}</span>
          )}
        </span>
      </button>
      {/* Open indicator dot */}
      {isOpen && (
        <div className={`absolute -bottom-1.5 w-1 h-1 rounded-full transition-colors ${isActive ? 'bg-black/70' : 'bg-black/30'}`} />
      )}
    </div>
  );
}

export default function Dock() {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] pointer-events-auto">
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex items-end gap-3 px-3 py-3 rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
      >
        {dockItems.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} />
        ))}

        {/* Separator */}
        <div className="w-[1px] h-10 bg-black/10 mx-2 self-center rounded-full"></div>

        {/* Trash */}
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/40 border border-white/60 cursor-default opacity-80 backdrop-blur-lg hover:bg-white/60 transition-colors shadow-sm">
            <span className="text-2xl drop-shadow-sm">🗑️</span>
          </div>
        </div>
      </div>
    </div>
  );
}
