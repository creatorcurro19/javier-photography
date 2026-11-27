"use client";

import { usePathname } from "next/navigation";
import { setSiteLang, useLanguage } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n-helpers";

export default function LanguageToggle() {
  const { lang } = useLanguage();
  const pathname = usePathname() || "/";
  const nextLang = lang === "es" ? "en" : "es";
  const targetHref = localizeHref(pathname, nextLang);

  return (
    <a
      href={targetHref}
      onClick={() => setSiteLang(nextLang)}
      hrefLang={nextLang === "en" ? "en-US" : "es-ES"}
      aria-label={lang === "es" ? "Switch website to English" : "Cambiar idioma a Español"}
      title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
      className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border border-white/[0.12] bg-[#151618] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EBE7DF] transition hover:border-[#C5A880]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A880]"
    >
      <span className={lang === "es" ? "text-[#C5A880] font-semibold" : "text-[#A39E93]"}>
        ES
      </span>
      <span className="text-white/35">/</span>
      <span className={lang === "en" ? "text-[#C5A880] font-semibold" : "text-[#A39E93]"}>
        EN
      </span>
    </a>
  );
}
