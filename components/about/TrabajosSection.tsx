"use client";

import type { TrabajoItem } from "@/data/trabajos";
import { useLanguage } from "@/lib/i18n";

interface TrabajosSectionProps {
  items?: TrabajoItem[];
}

export default function TrabajosSection({ items = [] }: TrabajosSectionProps) {
  const { lang, t } = useLanguage();

  // No renderizar la sección mientras no existan trabajos o colaboraciones verificadas
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t("Trabajos y colaboraciones", "Selected work & collaborations")}
      className="border-t border-white/[0.08] pt-12"
    >
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
        {t("Trabajos y colaboraciones", "Work & collaborations")}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const title = lang === "en" && item.titleEn ? item.titleEn : item.title;
          const client = lang === "en" && item.clientOrMediumEn ? item.clientOrMediumEn : item.clientOrMedium;
          const desc = lang === "en" && item.descriptionEn ? item.descriptionEn : item.description;
          return (
            <article
              key={item.id}
              className="border border-white/[0.08] bg-[#151618] p-5"
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#A39E93]">
                <span>{client}</span>
                <span>{item.year}</span>
              </div>
              <h3 className="mt-2 font-serif text-lg text-[#EBE7DF]">
                {title}
              </h3>
              {desc && (
                <p className="mt-2 text-xs font-light leading-relaxed text-[#8E8A80]">
                  {desc}
                </p>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A880] hover:text-white"
                >
                  {t("Ver publicación ↗", "View publication ↗")}
                </a>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
