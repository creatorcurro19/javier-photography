"use client";

import { useLanguage } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "es" ? "Switch website to English" : "Cambiar idioma a Español"}
      title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
      className="flex items-center gap-1 border border-white/[0.1] bg-[#151618] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EBE7DF] transition hover:border-[#C5A880]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      <span className={lang === "es" ? "text-[#C5A880] font-semibold" : "text-[#8E8A80]"}>
        ES
      </span>
      <span className="text-white/25">/</span>
      <span className={lang === "en" ? "text-[#C5A880] font-semibold" : "text-[#8E8A80]"}>
        EN
      </span>
    </button>
  );
}
