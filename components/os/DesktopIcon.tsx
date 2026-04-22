"use client";

import { useState, useCallback } from "react";
import { useWindowManager } from "./WindowManager";

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  component: string;
}

export default function DesktopIcon({ id, label, icon, component }: DesktopIconProps) {
  const { openWindow } = useWindowManager();
  const [selected, setSelected] = useState(false);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    if (clickTimer) {
      // Double click
      clearTimeout(clickTimer);
      setClickTimer(null);
      openWindow(id, label, icon, component);
      setSelected(false);
    } else {
      // First click — select & wait for second
      setSelected(true);
      const timer = setTimeout(() => {
        setClickTimer(null);
      }, 400);
      setClickTimer(timer);
    }
  }, [clickTimer, id, label, icon, component, openWindow]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center gap-1.5
        w-20 h-[88px] rounded-lg cursor-pointer select-none
        transition-all duration-150
        ${selected
          ? 'bg-[#00E5C8]/10 ring-1 ring-[#00E5C8]/30'
          : 'hover:bg-white/5'
        }
      `}
    >
      <span className="text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{icon}</span>
      <span className={`
        text-[10px] font-mono text-center leading-tight px-1 truncate w-full
        ${selected ? 'text-[#00E5C8]' : 'text-[#ccc]/80'}
        drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
      `}>
        {label}
      </span>
    </div>
  );
}
