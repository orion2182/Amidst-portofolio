"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { sysAudio } from '@/lib/audio';
import { useLang } from '@/lib/i18n';

const navLinks = [
  { href: "/blog", label: "Blog", color: "accent2" },
  { href: "/ctf", label: "CTF", color: "pink" },
  { href: "/projects", label: "Projects", color: "neon" },
  { href: "/experience", label: "Experience", color: "accent" },
  { href: "/admin", label: "Admin", color: "accent2" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY && y > 200);
      lastY = y;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── Floating Cyber-Dock (Desktop) ── */}
      <nav className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        hidden md:flex items-center gap-1
        px-2 py-2
        bg-bg/60 backdrop-blur-2xl
        border border-border/60
        transition-all duration-500
        ${hidden ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}
      `}
        style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
      >
        {/* Logo pill */}
        <Link
          href="/"
          className="px-3 py-2 text-xs font-black font-space text-accent tracking-tighter cursor-none hover:text-pink transition-colors flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
          AMIDST
        </Link>

        <div className="w-[1px] h-5 bg-border/50 mx-1"></div>

        {/* Nav links */}
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          const label = t(`nav.${link.label.toLowerCase()}`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] cursor-none
                transition-all duration-300 group
                ${isActive
                  ? `text-${link.color} bg-${link.color}/10`
                  : 'text-muted/70 hover:text-text hover:bg-white/5'
                }
              `}
              onMouseEnter={() => sysAudio.resumeCtx()}
            >
              {label}
              {/* Active dot indicator */}
              {isActive && (
                <span className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-${link.color}`}></span>
              )}
            </Link>
          );
        })}

        <div className="w-[1px] h-5 bg-border/50 mx-1"></div>

        {/* Language toggle */}
        <button
          onClick={() => { setLang(lang === "en" ? "id" : "en"); sysAudio.playClickSound(); }}
          className="px-2 py-2 text-[9px] font-mono uppercase tracking-widest text-muted/50 hover:text-accent transition-colors cursor-none"
        >
          {lang === "en" ? "EN" : "ID"}
        </button>

        {/* Cmd+K */}
        <button
          onClick={() => { const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }); window.dispatchEvent(e); }}
          className="px-2 py-2 text-[9px] font-mono text-muted/30 hover:text-accent transition-colors cursor-none"
        >
          ⌘K
        </button>
      </nav>

      {/* ── Mobile Top Bar ── */}
      <nav className="md:hidden fixed top-0 w-full z-50 bg-bg/90 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="text-sm font-black font-space text-accent tracking-tighter cursor-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
            AMIDST
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text hover:text-accent p-2 cursor-none"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isOpen && (
          <div className="bg-bg/95 backdrop-blur-xl border-t border-border/30 font-mono uppercase text-xs tracking-widest">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const label = t(`nav.${link.label.toLowerCase()}`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-3 text-muted hover:text-text transition-all cursor-none border-b border-border/20 last:border-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={`text-${link.color} mr-2 opacity-50`}>&gt;</span>
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}