"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import type { Photo, PhotoCategory } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

const FILTER_TABS: { id: "all" | PhotoCategory; labelEs: string; labelEn: string }[] = [
  { id: "all", labelEs: "Todas las Notas", labelEn: "All Notes" },
  { id: "fauna-naturaleza", labelEs: "Fauna & 600mm", labelEn: "Wildlife & 600mm" },
  { id: "paisajes-documental", labelEs: "Paisajes & Territorio", labelEn: "Landscapes & Territory" },
  { id: "coches-rally", labelEs: "Coches & Rally", labelEn: "Cars & Rally" },
  { id: "arquitectura-urbana", labelEs: "Arquitectura", labelEn: "Architecture" },
  { id: "viajes-cultura", labelEs: "Documental", labelEn: "Documentary" },
];

export default function FieldJournalExplorer({ stories }: { stories: Photo[] }) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<"all" | PhotoCategory>("all");
  const [viewMode, setViewMode] = useState<"editorial" | "lighttable">("editorial");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return stories;
    return stories.filter((s) => s.category === activeCategory);
  }, [stories, activeCategory]);

  return (
    <div className="mt-14">
      {/* Interactive Filter & View Mode Toolbar */}
      <div className="flex flex-col justify-between gap-4 border-y border-[#202226] bg-[#151618]/50 px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
          {FILTER_TABS.map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`shrink-0 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition ${
                  active
                    ? "border border-[#8E8A80] bg-[#8E8A80]/20 text-[#EBE7DF]"
                    : "border border-transparent text-neutral-400 hover:border-[#202226] hover:text-[#EBE7DF]"
                }`}
              >
                {lang === "en" ? tab.labelEn : tab.labelEs}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            {filtered.length} {t("anotaciones", "entries")}
          </span>
          <div className="flex border border-[#202226] bg-[#0B0C0E]">
            <button
              type="button"
              onClick={() => setViewMode("editorial")}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                viewMode === "editorial"
                  ? "bg-[#EBE7DF] text-[#0B0C0E] font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t("Editorial", "Editorial")}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("lighttable")}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                viewMode === "lighttable"
                  ? "bg-[#EBE7DF] text-[#0B0C0E] font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t("Mesa de Luz", "Light Table")}
            </button>
          </div>
        </div>
      </div>

      {/* View Mode 1: Editorial Spreads */}
      {viewMode === "editorial" ? (
        <div className="mt-16 space-y-24">
          {filtered.map((rawPhoto, index) => {
            const photo = getLocalizedPhoto(rawPhoto, lang);
            const catMeta = CATEGORY_METADATA[photo.category];
            const catTitle = lang === "en" ? catMeta?.titleEn : catMeta?.title;
            return (
            <article
              key={photo.id}
              className="grid grid-cols-1 items-center gap-12 border-b border-[#202226] pb-20 lg:grid-cols-12 lg:gap-16"
            >
              {/* Image side (7 cols) */}
              <div
                className={`lg:col-span-7 ${
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <Link
                  href={`/portfolio/${photo.slug}`}
                  className="group relative mx-auto block w-fit max-w-full overflow-hidden border border-[#202226] bg-[#151618]"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    quality={85}
                    className="h-auto max-h-[76vh] w-auto max-w-full transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="border border-[#202226] bg-[#0B0C0E]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] backdrop-blur-sm">
                      {t("NOTA", "NOTE")} #{String(index + 1).padStart(2, "0")} ·{" "}
                      {catTitle}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Story Narrative side (5 cols) */}
              <div
                className={`lg:col-span-5 ${
                  index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[#8E8A80]">
                  {photo.location ? (
                    <>
                      <span>{photo.location}</span>
                      <span>·</span>
                    </>
                  ) : null}
                  <span>{photo.year}</span>
                </div>

                <h2 className="mt-3 font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="transition hover:text-white"
                  >
                    {photo.title}
                  </Link>
                </h2>

                <blockquote className="mt-6 border-l border-[#8E8A80]/60 pl-5 text-sm font-light leading-relaxed text-[#EBE7DF]/85 sm:text-base sm:leading-7">
                  {photo.story}
                </blockquote>

                {/* Technical EXIF Telemetry Grid */}
                <div className="mt-7 grid grid-cols-4 gap-2 border border-[#202226] bg-[#151618]/50 p-4 font-mono text-xs">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                      {t("Focal", "Focal")}
                    </span>
                    <span className="text-[#EBE7DF]">{photo.focalLength}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                      {t("Apertura", "Aperture")}
                    </span>
                    <span className="text-[#EBE7DF]">{photo.aperture}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                      {t("Velocidad", "Shutter")}
                    </span>
                    <span className="text-[#EBE7DF]">{photo.shutter}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                      {t("Sensibilidad", "ISO")}
                    </span>
                    <span className="text-[#EBE7DF]">ISO {photo.iso}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
                  >
                    {t("Inspeccionar Obra", "Inspect Work")}
                  </Link>
                  {photo.prints && (
                    <Link
                      href={`/prints?obra=${encodeURIComponent(photo.title)}`}
                      className="font-mono text-xs uppercase tracking-[0.22em] text-[#8E8A80] transition hover:text-[#EBE7DF]"
                    >
                      {t("Adquirir Copia Fine Art →", "Collect Fine Art Print →")}
                    </Link>
                  )}
                </div>
              </div>
            </article>
            );
          })}
        </div>
      ) : (
        /* View Mode 2: Compact Contact Sheet / Light Table */
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((rawPhoto, index) => {
            const photo = getLocalizedPhoto(rawPhoto, lang);
            return (
            <Link
              key={photo.id}
              href={`/portfolio/${photo.slug}`}
              className="group flex flex-col justify-between border border-[#202226] bg-[#151618]/40 p-5 transition hover:border-[#8E8A80]/70 hover:bg-[#202226]/50"
            >
              <div>
                <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-[#8E8A80]">
                  <span>{t("NOTA", "NOTE")} #{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    {photo.focalLength} · {photo.shutter}
                  </span>
                </div>

                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#0B0C0E] p-2">
                  <div className="relative h-full w-full">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={85}
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <h3 className="mt-4 font-serif text-xl text-[#EBE7DF] group-hover:text-white">
                  {photo.title}
                </h3>
                {photo.location && (
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#8E8A80]">
                    {photo.location}
                  </p>
                )}
                <p className="mt-3 line-clamp-3 text-xs font-light leading-relaxed text-[#EBE7DF]/75">
                  {photo.story}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#202226] pt-3 font-mono text-[10px] uppercase tracking-wider text-neutral-400 group-hover:text-[#EBE7DF]">
                <span>{t("Abrir Ficha y EXIF", "Open Sheet & EXIF")}</span>
                <span>→</span>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
