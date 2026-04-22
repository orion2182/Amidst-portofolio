"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-[100] w-10 h-10 bg-bg2 border border-accent text-accent font-mono text-xs flex items-center justify-center hover:bg-accent hover:text-bg transition-colors cursor-none shadow-[0_0_15px_rgba(0,229,200,0.2)]"
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
