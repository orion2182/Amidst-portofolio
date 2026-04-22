"use client";

import React from 'react';
import Link from 'next/link';
import { sysAudio } from '@/lib/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  href?: string;
}

export default function Button({ 
  variant = 'primary', 
  href, 
  className = '', 
  children, 
  onMouseEnter,
  onClick,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-bold font-mono transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group uppercase tracking-widest cursor-none clip-path-slant";
  
  const variants = {
    primary: "bg-accent text-bg border border-accent hover:bg-[rgba(0,229,200,0.1)] hover:text-accent shadow-neon-cyan hover:shadow-[0_0_30px_rgba(0,229,200,0.6)] hover:-translate-y-1",
    outline: "bg-transparent text-text border border-border hover:border-accent hover:text-accent hover:bg-accent/5 hover:-translate-y-1 hover:shadow-neon-cyan",
    ghost: "text-muted hover:text-accent hover:bg-accent/10 border border-transparent rounded-md"
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    sysAudio.playHoverSound();
    if (onMouseEnter) {
      // TS check hack to allow passing the event to the original handler regardless of type
      onMouseEnter(e as any);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    sysAudio.playClickSound();
    if (onClick) {
      onClick(e as any);
    }
  };

  if (href) {
    return (
      <Link 
        href={href} 
        className={classes}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      >
        <span className="relative z-10 flex items-center transition-all duration-300">
          <span className="opacity-0 -ml-2 mr-0 group-hover:opacity-100 group-hover:mr-2 group-hover:ml-0 transition-all duration-300 text-current">&gt;</span>
          {children}
        </span>
        {variant !== 'ghost' && <div className="absolute right-0 bottom-0 w-2 h-2 bg-current opacity-50 group-hover:animate-pulse"></div>}
      </Link>
    );
  }

  return (
    <button 
      className={classes} 
      onMouseEnter={handleMouseEnter as any}
      onClick={handleClick as any}
      {...props}
    >
      <span className="relative z-10 flex items-center transition-all duration-300">
        <span className="opacity-0 -ml-2 mr-0 group-hover:opacity-100 group-hover:mr-2 group-hover:ml-0 transition-all duration-300 text-current">&gt;</span>
        {children}
      </span>
      {variant !== 'ghost' && <div className="absolute right-0 bottom-0 w-2 h-2 bg-current opacity-50 group-hover:animate-pulse"></div>}
    </button>
  );
}
