"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string; // which view to render
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (id: string, title: string, icon: string, component: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType>({
  windows: [],
  activeWindowId: null,
  openWindow: () => {},
  closeWindow: () => {},
  focusWindow: () => {},
  minimizeWindow: () => {},
  maximizeWindow: () => {},
  restoreWindow: () => {},
  updatePosition: () => {},
});

let nextZ = 10;

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((id: string, title: string, icon: string, component: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        // Already open — focus it and unminimize
        nextZ++;
        return prev.map(w =>
          w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w
        );
      }
      // Stagger new windows slightly
      const offset = (prev.length % 6) * 30;
      nextZ++;
      return [...prev, {
        id,
        title,
        icon,
        component,
        isMinimized: false,
        isMaximized: false,
        x: 80 + offset,
        y: 60 + offset,
        width: 720,
        height: 480,
        zIndex: nextZ,
      }];
    });
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const focusWindow = useCallback((id: string) => {
    nextZ++;
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w
    ));
    setActiveWindowId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: true } : w
    ));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: false } : w
    ));
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  return (
    <WindowManagerContext.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      updatePosition,
    }}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  return useContext(WindowManagerContext);
}
