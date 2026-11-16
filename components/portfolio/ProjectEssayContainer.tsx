"use client";

import { useState, type ReactNode } from "react";

export default function ProjectEssayContainer({ children }: { children: ReactNode }) {
  const [paperMode, setPaperMode] = useState(false);

  return (
    <article
      className={`min-h-screen pt-32 pb-28 transition-colors duration-500 ${
        paperMode
          ? "bg-[#EFECE4] text-[#18191A] [&_*]:border-[#D5CFC2] [&_h1]:text-[#101112] [&_h2]:text-[#5C4E3C] [&_p]:text-[#2A2C2E] [&_span]:text-[#5C4E3C] [&_a]:text-[#18191A]"
          : "bg-[#101112] text-[#D8D5CD]"
      }`}
    >
      {/* Selector flotante discreto de ambiente de lectura (Sala Oscura vs Papel Museo) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setPaperMode((prev) => !prev)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md transition ${
            paperMode
              ? "border-[#101112]/20 bg-[#101112] text-[#D8D5CD]"
              : "border-[#1D2021] bg-[#1D2021]/90 text-[#D8D5CD] hover:border-[#95836B]"
          }`}
          title="Alternar modo de lectura entre Sala Oscura y Papel Museo"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              paperMode ? "bg-[#101112] ring-1 ring-[#D8D5CD]" : "bg-[#EFECE4]"
            }`}
          />
          <span>{paperMode ? "Modo Sala Oscura" : "Modo Papel Museo"}</span>
        </button>
      </div>

      {children}
    </article>
  );
}
