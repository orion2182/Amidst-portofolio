"use client";

import { WindowManagerProvider } from "@/components/os/WindowManager";
import TopBar from "@/components/os/TopBar";
import Dock from "@/components/os/Dock";
import Desktop from "@/components/os/Desktop";

interface ContentData {
  ctf: any[];
  blog: any[];
  experience: any[];
  projects: any[];
  terminal: {
    aboutText: string;
    stats: { label: string; value: string }[];
    certs: { title: string; issuer: string }[];
    skills: string[];
  };
}

export default function OSDesktopClient({ data }: { data: ContentData }) {
  return (
    <WindowManagerProvider>
      {/* ── Wallpaper ── */}
      <div className="absolute inset-0 z-0 bg-slate-50 overflow-hidden">
        {/* Full resolution Lynae wallpaper, fully visible */}
        <img
          src="/assets/wallpaper.jpg"
          alt="Wallpaper"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
        />
        {/* WhiteSur light frosted overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      {/* ── macOS Menu Bar ── */}
      <TopBar />

      {/* ── Windows Layer ── */}
      <Desktop data={data} />

      {/* ── macOS Dock ── */}
      <Dock />
    </WindowManagerProvider>
  );
}
