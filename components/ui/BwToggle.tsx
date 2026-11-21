"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

export default function BwToggle() {
  const { lang } = useLanguage();
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
      // Ignore storage errors
    }
  };

  const labelText = isBw
    ? lang === "en" ? "B&W" : "B/N"
    : "Color";

  const ariaDescription = isBw
    ? lang === "en"
      ? "Disable black and white mode and return to natural color"
      : "Desactivar modo blanco y negro y volver a color natural"
    : lang === "en"
      ? "Enable author black and white film emulation (silver gelatin)"
      : "Activar modo blanco y negro de autor (emulsión grano de plata)";

  const titleDescription = isBw
    ? lang === "en" ? "Return to natural color" : "Volver a color natural"
    : lang === "en" ? "Switch to black & white film view" : "Ver en blanco y negro de autor (grano de plata)";

  return (
    <button
      type="button"
      onClick={toggle}
      title={titleDescription}
      aria-label={ariaDescription}
      aria-pressed={isBw}
      className={`group relative flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] transition-all duration-300 ${
        isBw
          ? "border-[#EBE7DF] bg-[#EBE7DF] text-[#0B0C0E] font-semibold"
          : "border-[#202226] bg-[#151618]/80 text-[#EBE7DF] hover:border-[#A39E93] hover:text-white"
      }`}
    >
      {/* Indicador óptico de filtro de película */}
      <span
        aria-hidden="true"
        className={`relative inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border transition-transform duration-300 ${
          isBw
            ? "border-[#0B0C0E] bg-gradient-to-r from-black to-white"
            : "border-[#8E8A80]/60 bg-gradient-to-r from-[#8E8A80] to-[#EBE7DF]"
        }`}
      />
      <span className="whitespace-nowrap font-medium">{labelText}</span>
    </button>
  );
}
