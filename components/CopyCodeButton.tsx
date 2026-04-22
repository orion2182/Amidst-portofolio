"use client";

import { useRef, useState } from "react";

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-[10px] font-mono uppercase tracking-widest border transition-colors cursor-none z-10
        bg-bg2/80 backdrop-blur-sm
        border-border text-muted hover:text-accent hover:border-accent"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}
