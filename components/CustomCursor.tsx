"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const isVisibleRef = useRef(false);
  const pathname = usePathname();

  const updateCursor = useCallback((x: number, y: number) => {
    if (outerRef.current) {
      outerRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) ${
        isHoveringRef.current ? "scale(1.5)" : "scale(1)"
      }`;
    }
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
    }
  }, []);

  useEffect(() => {
    // Disable custom cursor on touch devices
    const isTouch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
    if (isTouch) {
      document.body.style.cursor = "auto";
      return;
    }

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (outerRef.current) outerRef.current.style.opacity = "1";
        if (dotRef.current) dotRef.current.style.opacity = "1";
      }
      updateCursor(e.clientX, e.clientY);
    };

    const onLeave = () => {
      isVisibleRef.current = false;
      if (outerRef.current) outerRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    const onEnter = () => {
      isVisibleRef.current = true;
      if (outerRef.current) outerRef.current.style.opacity = "1";
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };

    const setHover = (val: boolean) => {
      isHoveringRef.current = val;
      if (outerRef.current) {
        const inner = outerRef.current.firstElementChild as HTMLElement;
        if (inner) {
          inner.style.borderColor = val ? "var(--accent2)" : "var(--accent)";
          inner.style.boxShadow = val 
            ? "0 0 30px var(--accent2), inset 0 0 15px rgba(123, 95, 220, 0.5)" 
            : "0 0 20px var(--accent), inset 0 0 10px rgba(0, 229, 200, 0.3)";
          inner.style.backgroundColor = val ? "rgba(123, 95, 220, 0.15)" : "transparent";
        }
      }
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = val ? "var(--accent2)" : "var(--accent)";
        dotRef.current.style.transform = dotRef.current.style.transform; // force recalc
      }
    };

    const attachHoverListeners = () => {
      const clickables = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button'], .cursor-pointer"
      );
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setHover(true));
        el.addEventListener("mouseleave", () => setHover(false));
        (el as HTMLElement).style.cursor = "none";
      });
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    attachHoverListeners();
    const tid = setTimeout(attachHoverListeners, 1000);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      clearTimeout(tid);
    };
  }, [pathname, updateCursor]);

  return (
    <>
      {/* Outer Glow / Bubble */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center mix-blend-screen transition-transform duration-100 ease-out"
        style={{ opacity: 0, willChange: "transform" }}
      >
        <div
          className="w-10 h-10 rounded-full relative"
          style={{ 
            backgroundColor: "transparent", 
            border: "1px solid var(--accent)", 
            boxShadow: "0 0 20px var(--accent), inset 0 0 10px rgba(0, 229, 200, 0.3)",
            transition: "border-color 0.3s, box-shadow 0.3s, background-color 0.3s" 
          }}
        >
        </div>
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full mix-blend-difference"
        style={{
          width: "4px",
          height: "4px",
          backgroundColor: "var(--accent)",
          opacity: 0,
          willChange: "transform",
        }}
      ></div>
    </>
  );
}
