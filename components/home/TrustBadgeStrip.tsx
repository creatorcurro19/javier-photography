"use client";

import { useLanguage } from "@/lib/i18n";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";
import { SITE_CONFIG } from "@/data/site-config";

export default function TrustBadgeStrip() {
  const { t } = useLanguage();

  return (
    <aside
      aria-label={t("Disponibilidad y plataformas oficiales", "Availability and official platforms")}
      className="relative z-20 border-y border-[#C5A880]/20 bg-[#0E1012] py-4 text-xs select-none"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3 gap-x-6 px-4 sm:px-8 md:px-12">
        {/* Etiqueta de disponibilidad */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]">
          <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
          <span>{t("Disponible en:", "Available on:")}</span>
        </div>

        {/* Enlaces y Sellos de Confianza Oficiales */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
          <a
            href={SITE_CONFIG.social.saatchi}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[#EBE7DF]/85 transition hover:text-[#C5A880] focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
          >
            <span className="font-medium text-white group-hover:text-[#C5A880]">Saatchi Art</span>
            <span className="text-[9px] text-[#8E8A80]">↗</span>
          </a>

          <span className="text-white/20">·</span>

          <a
            href={SITE_CONFIG.social.getty}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[#EBE7DF]/85 transition hover:text-[#C5A880] focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
          >
            <span className="font-medium text-white group-hover:text-[#C5A880]">Getty Images / iStock</span>
            <span className="text-[9px] text-[#8E8A80]">↗</span>
          </a>

          <span className="hidden md:inline text-white/20">·</span>

          <div className="hidden md:inline-flex items-center gap-1.5 text-[#8E8A80]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]/70" />
            <span>Hahnemühle Photo Rag® 308g</span>
          </div>

          <span className="hidden lg:inline text-white/20">·</span>

          <div className="hidden lg:inline-flex items-center gap-1.5 text-[#8E8A80]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]/70" />
            <span>Tenerife · Canarias</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
