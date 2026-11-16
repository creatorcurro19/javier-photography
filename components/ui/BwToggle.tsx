"use client";

import { useState, useEffect } from "react";

export default function BwToggle() {
  const [isBw, setIsBw] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("javier_fine_art_bw") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isBw) {
      document.documentElement.classList.add("fine-art-bw");
    } else {
      document.documentElement.classList.remove("fine-art-bw");
    }
  }, [isBw]);

  const toggle = () => {
    const next = !isBw;
    setIsBw(next);
    try {
      localStorage.setItem("javier_fine_art_bw", next ? "true" : "false");
    } catch {
      // Ignore
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={isBw ? "Volver a color natural" : "Ver archivo en Blanco y Negro Fine Art (grano de plata)"}
      aria-label={isBw ? "Activar modo color" : "Activar modo monocromo Fine Art"}
      className={`group relative flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] transition-all duration-300 ${
        isBw
          ? "border-[#D8D5CD] bg-[#D8D5CD] text-[#101112] font-semibold"
          : "border-[#1D2021] bg-[#141617]/70 text-neutral-400 hover:border-[#95836B]/70 hover:text-white"
      }`}
    >
      {/* Dual Yin-Yang Circle Indicator */}
      <span
        aria-hidden="true"
        className={`relative inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border transition-transform duration-300 ${
          isBw
            ? "border-[#101112] bg-gradient-to-r from-black to-white"
            : "border-[#95836B]/60 bg-gradient-to-r from-[#95836B] to-[#D8D5CD]"
        }`}
      />
      <span className="hidden sm:inline">{isBw ? "B&W" : "Color"}</span>
      <span className="sm:hidden">{isBw ? "B/W" : "CLR"}</span>
    </button>
  );
}
