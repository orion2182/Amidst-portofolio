"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

interface AnimatedCounterProps {
  end: number;
  label: string;
  suffix?: string;
  color?: string;
}

function Counter({ end, label, suffix = "", color = "text-accent" }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 40;
    const increment = end / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, end]);

  return (
    <div ref={ref} className="brutal-card p-6 text-center group">
      <div className="relative z-10">
        <span className={`text-4xl md:text-5xl font-black font-space ${color} block mb-2`}>
          {count}{suffix}
        </span>
        <span className="text-xs font-mono text-muted uppercase tracking-widest">{t(label)}</span>
      </div>
    </div>
  );
}

interface StatsBarProps {
  stats: { end: number; label: string; suffix?: string; color?: string }[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Counter key={i} {...s} />
      ))}
    </div>
  );
}
