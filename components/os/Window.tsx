"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useWindowManager, WindowState } from "./WindowManager";

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export default function Window({ window: win, children }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, updatePosition, activeWindowId } = useWindowManager();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isActive = activeWindowId === win.id;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    focusWindow(win.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    });
  }, [win.id, win.x, win.y, focusWindow]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      updatePosition(win.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    };
    const handleUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, dragOffset, win.id, updatePosition]);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { top: 28, left: 0, width: "100vw", height: "calc(100vh - 28px)", zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      className={`
        fixed flex flex-col
        rounded-xl overflow-hidden
        transition-shadow duration-300
        backdrop-blur-3xl bg-white/70
        border border-white/60
        ${isActive
          ? 'shadow-[0_30px_80px_rgba(0,0,0,0.15)]'
          : 'shadow-[0_15px_40px_rgba(0,0,0,0.1)] opacity-95'
        }
      `}
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* ── macOS Title Bar with frosted light glass ── */}
      <div
        className={`
          flex items-center h-10 px-3.5
          select-none cursor-grab active:cursor-grabbing
          border-b border-white/30
          ${isActive ? 'bg-white/40' : 'bg-white/20'}
        `}
        onMouseDown={handleMouseDown}
      >
        {/* Traffic light buttons */}
        <div className="flex items-center gap-2 mr-4 group/btns">
          <button
            onClick={() => closeWindow(win.id)}
            className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] hover:brightness-95 transition-all flex items-center justify-center border border-[#E0443E]"
            title="Close"
          >
            <span className="text-[8px] text-[#4a0000] opacity-0 group-hover/btns:opacity-100 font-bold leading-none">×</span>
          </button>
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] hover:brightness-95 transition-all flex items-center justify-center border border-[#DEA126]"
            title="Minimize"
          >
            <span className="text-[8px] text-[#5a4000] opacity-0 group-hover/btns:opacity-100 font-bold leading-none">−</span>
          </button>
          <button
            onClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
            className="w-3 h-3 rounded-full bg-[#28C840] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] hover:brightness-95 transition-all flex items-center justify-center border border-[#1AAB29]"
            title={win.isMaximized ? "Restore" : "Maximize"}
          >
            <span className="text-[8px] text-[#004a00] opacity-0 group-hover/btns:opacity-100 font-bold leading-none">+</span>
          </button>
        </div>

        {/* Window title */}
        <div className="flex-1 text-center">
          <span className={`text-[13px] font-semibold tracking-tight ${isActive ? 'text-black/80' : 'text-black/40'}`}>
            {win.title}
          </span>
        </div>

        <div className="w-[60px]"></div>
      </div>

      {/* ── Window Content ── */}
      <div className="flex-1 overflow-auto bg-white/40">
        {children}
      </div>
    </div>
  );
}
