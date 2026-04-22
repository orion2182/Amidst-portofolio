"use client";

import { useState, useEffect } from "react";

const bootLines = [
  { text: "BIOS v4.2.1 — AMIDST SYSTEMS INC.", delay: 0, color: "text-muted" },
  { text: "Checking memory... 32768 MB OK", delay: 150, color: "text-muted" },
  { text: "[  OK  ] Mounting root filesystem", delay: 300, color: "text-neon" },
  { text: "[  OK  ] Loading kernel modules", delay: 450, color: "text-neon" },
  { text: "[  OK  ] Starting network interfaces", delay: 600, color: "text-neon" },
  { text: "[  OK  ] Initializing GPU pipeline", delay: 750, color: "text-neon" },
  { text: "[WARN ] Firewall active — stealth mode enabled", delay: 900, color: "text-pink" },
  { text: "[  OK  ] Connecting to AMIDST_NET...", delay: 1050, color: "text-neon" },
  { text: "[  OK  ] Authentication: ACCEPTED", delay: 1250, color: "text-accent" },
  { text: "", delay: 1400, color: "" },
  { text: "SYSTEM READY.", delay: 1500, color: "text-accent font-bold text-lg" },
];

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Check sessionStorage so it only plays once per session
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("boot_done")) {
      setIsDone(true);
      return;
    }

    bootLines.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay);
    });

    const lastDelay = bootLines[bootLines.length - 1].delay;
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsDone(true);
        sessionStorage.setItem("boot_done", "1");
      }, 600);
    }, lastDelay + 800);
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#010409] flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-2xl px-8 font-mono text-sm leading-relaxed">
        {bootLines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`${line.color} mb-1`}>
            {line.text}
          </div>
        ))}
        {!isExiting && visibleLines >= bootLines.length && (
          <div className="mt-4 text-accent animate-pulse text-xs tracking-widest">
            ▶ ENTERING SYSTEM...
          </div>
        )}
      </div>
      
      {/* CRT scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,229,200,0)_50%,rgba(0,229,200,0.25)_50%)] bg-[length:100%_4px]"></div>
    </div>
  );
}
