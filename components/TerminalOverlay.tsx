"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { sysAudio } from "@/lib/audio";

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "cmd" | "out" | "err"; text: string }[]>([
    { type: "out", text: "AMIDST SYSTEM TERMINAL v1.0.0" },
    { type: "out", text: "Type 'help' for available commands." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) sysAudio.playHoverSound();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, { type: "cmd", text: trimmed }]);
    sysAudio.playClickSound();

    const args = trimmed.split(" ");
    const command = args[0].toLowerCase();

    const output: { type: "out" | "err"; text: string }[] = [];

    switch (command) {
      case "help":
        output.push({ type: "out", text: "Available commands: help, clear, ls, cd, whoami" });
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "whoami":
        output.push({ type: "out", text: "guest@amidst" });
        break;
      case "ls":
        output.push({ type: "out", text: "blog/  ctf/  projects/  experience/" });
        break;
      case "cd":
        if (args[1]) {
          const path = args[1].replace(/^\//, "");
          const allowed = ["blog", "ctf", "projects", "experience"];
          if (allowed.includes(path) || path === "~" || path === "/") {
            const target = path === "~" || path === "/" ? "/" : `/${path}`;
            output.push({ type: "out", text: `Navigating to ${target}...` });
            router.push(target);
            setTimeout(() => setIsOpen(false), 500);
          } else {
            output.push({ type: "err", text: `cd: no such file or directory: ${args[1]}` });
            sysAudio.playDeniedSound();
          }
        } else {
          output.push({ type: "out", text: "Usage: cd <directory>" });
        }
        break;
      default:
        output.push({ type: "err", text: `command not found: ${command}` });
        sysAudio.playDeniedSound();
    }

    setHistory((prev) => [...prev, ...output]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9000] bg-bg/90 backdrop-blur-md border-[4px] border-accent/20 p-4 md:p-8 flex flex-col font-mono text-sm md:text-base cursor-none">
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto flex flex-col gap-2 pointer-events-none custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={`flex gap-2 ${line.type === "err" ? "text-pink" : line.type === "cmd" ? "text-text" : "text-neon"}`}>
            {line.type === "cmd" && <span className="text-accent2">guest@amidst:~$</span>}
            <span className="whitespace-pre-wrap">{line.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      <div className="w-full max-w-4xl mx-auto mt-4 pt-4 border-t border-border flex items-center gap-2">
        <span className="text-accent2">guest@amidst:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCommand(input);
          }}
          className="flex-1 bg-transparent outline-none border-none text-text cursor-none"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      
      {/* Scanline overlay for the terminal specifically */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,229,200,0)_50%,rgba(0,229,200,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-muted hover:text-pink border border-transparent hover:border-pink px-2 py-1 transition-colors text-xs cursor-none"
      >
        [X] CLOSE
      </button>
    </div>
  );
}
