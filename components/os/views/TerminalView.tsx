"use client";

import { useEffect, useState, useRef } from "react";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "success" | "error" | "header";
}

interface TerminalViewProps {
  aboutText: string;
  stats: { label: string; value: string }[];
  certs: { title: string; issuer: string }[];
  skills: string[];
}

export default function TerminalView({ aboutText, stats, certs, skills }: TerminalViewProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allLines: TerminalLine[] = [
    { text: "amidst@macbook-pro ~ % neofetch", type: "command" },
    { text: "", type: "output" },
    { text: "                    'c.          amidst@macbook-pro", type: "header" },
    { text: "                 ,xNMM.          ------------------", type: "header" },
    { text: "               .OMMMMo           OS: macOS 14.4 (WhiteSur)", type: "output" },
    { text: "               OMMM0,            Host: MacBook Pro 14\"", type: "output" },
    { text: "     .;loddo:' loolloddol;.      Kernel: 23.4.0", type: "output" },
    { text: "   cKMMMMMMMMMMNWMMMMMMMMMM0:    Shell: zsh 5.9", type: "output" },
    { text: " .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Role: Cybersecurity Researcher", type: "output" },
    { text: " XMMMMMMMMMMMMMMMMMMMMMMMX.      Theme: Light (Frosted Glass)", type: "output" },
    { text: ";MMMMMMMMMMMMMMMMMMMMMMMM:       ", type: "output" },
    { text: ":MMMMMMMMMMMMMMMMMMMMMMMM:       ", type: "output" },
    { text: " ", type: "output" },
    { text: "amidst@macbook-pro ~ % cat ~/.profile-data", type: "command" },
    { text: "", type: "output" },
    { text: aboutText, type: "output" },
    { text: "", type: "output" },
    { text: "amidst@macbook-pro ~ % check-status --verbose", type: "command" },
    { text: "", type: "output" },
    ...stats.map(s => ({ text: `  [+] ${s.label}: ${s.value}`, type: "success" as const })),
    { text: "", type: "output" },
    { text: "amidst@macbook-pro ~ % security find-certificate", type: "command" },
    { text: "", type: "output" },
    ...certs.map(c => ({ text: `  🔒 ${c.title} — ${c.issuer}`, type: "output" as const })),
    { text: "", type: "output" },
    { text: "amidst@macbook-pro ~ % loadout", type: "command" },
    { text: "", type: "output" },
    { text: `  ${skills.join(" • ")}`, type: "success" },
    { text: "", type: "output" },
    { text: "amidst@macbook-pro ~ % █", type: "command" },
  ];

  useEffect(() => {
    if (currentLine >= allLines.length) return;

    const delay = allLines[currentLine].type === "command" ? 50 : 10;
    const timer = setTimeout(() => {
      setLines(prev => [...prev, allLines[currentLine]]);
      setCurrentLine(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentLine, allLines]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const getColor = (type: string) => {
    switch (type) {
      case "command": return "text-gray-900 font-bold";
      case "success": return "text-teal-600 font-semibold";
      case "error": return "text-red-500";
      case "header": return "text-teal-500 font-black";
      default: return "text-gray-700";
    }
  };

  return (
    <div ref={scrollRef} className="h-full overflow-auto bg-white/60 backdrop-blur-md p-5 font-mono text-[12px] leading-[1.6]">
      {lines.map((line, i) => (
        <div key={i} className={`${getColor(line.type)} whitespace-pre-wrap tracking-tight`}>
          {line.text}
        </div>
      ))}
    </div>
  );
}
