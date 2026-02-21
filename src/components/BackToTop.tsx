"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-xl glass border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all shadow-lg shadow-black/20 group"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
    </button>
  );
}
