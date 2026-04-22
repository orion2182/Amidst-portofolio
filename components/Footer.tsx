"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const [time, setTime] = useState("");
  const { t } = useLang();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border mt-12 py-8 text-muted font-mono text-xs uppercase tracking-widest relative z-10 w-full bg-bg/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top row: status indicators */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neon rounded-full animate-pulse"></span>
            <span className="text-neon">{t("footer.system")}</span>
          </div>
          <div className="text-muted/60 hidden md:block">{time}</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            <span>{t("footer.connection")}</span>
          </div>
        </div>

        {/* Bottom row: links + copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            SYSTEM_ARCHITECT:{" "}
            <span className="text-accent font-bold">Amidst</span> &copy;{" "}
            {new Date().getFullYear()}
          </p>

          <div className="flex gap-6">
            <Link
              href="https://github.com/orion2182"
              target="_blank"
              className="text-muted hover:text-text transition-colors cursor-none"
            >
              GITHUB
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="text-muted hover:text-text transition-colors cursor-none"
            >
              LINKEDIN
            </Link>
          </div>

          <p className="text-muted/40 text-[10px]">
             <span className="text-accent/60">~</span> {t("footer.terminal_hint")}
          </p>
        </div>
      </div>
    </footer>
  );
}
