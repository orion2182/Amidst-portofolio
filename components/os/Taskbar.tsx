"use client";

import { useWindowManager } from "./WindowManager";

export default function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowManager();

  if (windows.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 z-[99] bg-[#0a0a0a]/85 backdrop-blur-md border-t border-[#1a1a1a]/80 flex items-center justify-center gap-1 px-4">
      {windows.map((win) => (
        <button
          key={win.id}
          onClick={() => {
            if (activeWindowId === win.id && !win.isMinimized) {
              minimizeWindow(win.id);
            } else {
              focusWindow(win.id);
            }
          }}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded
            text-[10px] font-mono transition-all duration-200
            ${activeWindowId === win.id && !win.isMinimized
              ? 'bg-[#00E5C8]/10 text-[#00E5C8] border-b-2 border-[#00E5C8]'
              : 'text-[#666] hover:text-[#999] hover:bg-white/5'
            }
            ${win.isMinimized ? 'opacity-50' : ''}
          `}
        >
          <span className="text-xs">{win.icon}</span>
          <span className="max-w-[100px] truncate">{win.title}</span>
        </button>
      ))}
    </div>
  );
}
