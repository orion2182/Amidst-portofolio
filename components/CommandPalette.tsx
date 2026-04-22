"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { sysAudio } from "@/lib/audio";
import { useLang } from "@/lib/i18n";

interface CmdItem {
  label: string;
  href: string;
  category: string;
}

const staticPages: CmdItem[] = [
  { label: "Home", href: "/", category: "Pages" },
  { label: "Blog", href: "/blog", category: "Pages" },
  { label: "CTF Writeups", href: "/ctf", category: "Pages" },
  { label: "Projects", href: "/projects", category: "Pages" },
  { label: "Experience", href: "/experience", category: "Pages" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLang();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        sysAudio.resumeCtx();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return staticPages;
    const q = query.toLowerCase();
    return staticPages.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const navigate = (href: string) => {
    sysAudio.playClickSound();
    router.push(href);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIdx]) {
      navigate(filtered[selectedIdx].href);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9500] flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-bg2 border border-border shadow-[0_0_40px_rgba(0,229,200,0.1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-border px-4 gap-3">
          <span className="text-accent font-mono text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("cmd.placeholder")}
            className="w-full bg-transparent py-4 text-text text-sm outline-none font-mono placeholder:text-muted/50 cursor-none"
            spellCheck={false}
          />
          <kbd className="text-[10px] font-mono text-muted border border-border px-1.5 py-0.5 hidden sm:inline">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted font-mono text-xs uppercase tracking-widest">
              {t("cmd.no_results")}
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 font-mono text-sm transition-colors cursor-none ${
                  i === selectedIdx
                    ? "bg-accent/10 text-accent"
                    : "text-text/70 hover:bg-accent/5 hover:text-text"
                }`}
              >
                <span className="text-muted text-xs">{item.category}</span>
                <span className="text-xs text-border">│</span>
                <span>{item.label}</span>
                <span className="ml-auto text-muted/40 text-xs">{item.href}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex gap-4 text-[10px] font-mono text-muted/50">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
