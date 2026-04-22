"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "./WindowManager";
import { Wifi, Battery, Volume2, Search, Bell } from "lucide-react";

export default function TopBar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const { activeWindowId, windows } = useWindowManager();

  const activeWindow = windows.find(w => w.id === activeWindowId);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-7 z-[100] bg-white/30 backdrop-blur-2xl border-b border-white/20 shadow-sm flex items-center justify-between px-4 select-none">
      {/* Left — Apple-like logo + active app name */}
      <div className="flex items-center gap-4">
        {/* Apple Logo placeholder (using a generic shape or text) */}
        <span className="text-[13px] font-black text-black/80 tracking-tight cursor-default">
          
        </span>
        {/* Active window name */}
        <span className="text-[12px] font-bold text-black/80 drop-shadow-sm">
          {activeWindow ? activeWindow.title : "Finder"}
        </span>
        {/* Menu items */}
        <div className="hidden sm:flex items-center gap-4 ml-2">
          {["File", "Edit", "View", "Go", "Window", "Help"].map(item => (
            <span key={item} className="text-[12px] font-medium text-black/80 hover:text-black cursor-default transition-colors drop-shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Right — System tray & Time */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 mr-2">
          <Wifi size={13} className="text-black/80 drop-shadow-sm" />
          <Volume2 size={13} className="text-black/80 drop-shadow-sm" />
          <Battery size={13} className="text-black/80 drop-shadow-sm" />
          <Search size={13} className="text-black/80 drop-shadow-sm cursor-pointer" />
          <Bell size={13} className="text-black/80 drop-shadow-sm cursor-pointer" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded transition-colors">
          <span className="text-[12px] text-black/80 font-medium drop-shadow-sm">{date}</span>
          <span className="text-[12px] text-black/80 font-semibold drop-shadow-sm">{time}</span>
        </div>
      </div>
    </div>
  );
}
