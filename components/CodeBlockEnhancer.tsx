"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import CopyCodeButton from "./CopyCodeButton";

export default function CodeBlockEnhancer() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("article pre");
    
    codeBlocks.forEach((pre) => {
      const el = pre as HTMLElement;
      if (el.dataset.enhanced) return;
      el.dataset.enhanced = "true";

      el.style.position = "relative";

      const code = el.querySelector("code");
      const text = code?.textContent || el.textContent || "";

      const wrapper = document.createElement("div");
      el.insertBefore(wrapper, el.firstChild);
      
      const root = createRoot(wrapper);
      root.render(<CopyCodeButton code={text} />);
    });
  }, []);

  return null;
}
