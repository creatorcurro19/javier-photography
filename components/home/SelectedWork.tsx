"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { BASE_PRINT_FORMATS } from "@/data/formatos";
import { useLanguage } from "@/lib/i18n";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";

const DARK_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSclMjMxNTE2MTgnLz48L3N2Zz4=";

interface SelectedWorkProps {
  photos: Photo[];
  totalCount?: number;
}

export default function SelectedWork({ photos, totalCount }: SelectedWorkProps) {
  const { t } = useLanguage();

  return (
    <section
      id="selected-work"
      className="relative overflow-hidden bg-[#0B0C0E] py-20 sm:py-24 scroll-mt-20"
      aria-label={t("Obras Seleccionadas — Exposición Permanente", "Selected Works — Permanent Exhibition")}
    >
      <div className="hidden">
        <AndalusianPageBackdrop variant="sebka" />
        <AndalusianStarMark className="h-3.5 w-3.5" />
        <span>{totalCount}</span>
      </div>

      <Container className="relative z-10">
        {/* Cabecera Simple */}
        <div className="flex flex-col justify-between gap-4 pb-6 border-b border-white/[0.08] md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
              {t("Selección destacada", "Featured selection")}
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light text-[#EBE7DF] tracking-tight">
              {t("Fotos Destacadas", "Featured Photos")}
            </h2>
          </div>

          <Link
            href="/portfolio"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] transition-colors hover:text-[#C5A880]"
          >
            <span>
              {t("Ver todas las fotos", "View all photos")}
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Clean 2x3 Curatorial Grid (6 signature artworks) */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => {
            const categoryInfo = CATEGORY_METADATA[photo.category];

            return (
              <figure
                key={photo.id}
                className="group overflow-hidden border border-[#C5A880]/15 bg-[#151618]/95 transition-all duration-500 hover:border-[#C5A880]/50"
              >
                <Link
                  href={`/portfolio/${photo.slug}`}
                  aria-label={`Abrir ficha de ${photo.title}`}
                  className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[#0B0C0E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    placeholder="blur"
                    blurDataURL={DARK_BLUR_DATA_URL}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 420px"
                    quality={85}
                    loading="lazy"
                    draggable={false}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] pointer-events-none select-none"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full border border-white/40 bg-black/75 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#EBE7DF] backdrop-blur-md">
                      Ver ficha →
                    </span>
                  </div>
                </Link>

                {/* Minimal Museum Plaque */}
                <figcaption className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-[#151618] px-5 py-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-base font-light text-[#EBE7DF] transition-colors group-hover:text-white">
                      <Link
                        href={`/portfolio/${photo.slug}`}
                        className="hover:underline underline-offset-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {photo.title}
                      </Link>
                    </h3>
                    <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E8A80]">
                      {categoryInfo?.title ?? photo.category} · {photo.year}
                    </p>
                    {photo.prints ? (
                      <p className="mt-1 font-mono text-[11px] text-[#C5A880]">
                        Copia Fine Art · <span className="whitespace-nowrap">Desde {photo.pricing?.estudio ?? BASE_PRINT_FORMATS.estudio.defaultPrice}&nbsp;€</span>
                      </p>
                    ) : (
                      <p className="mt-1 font-mono text-[11px] text-[#8E8A80]">
                        {photo.category === "coches-rally"
                          ? "Archivo Motorsport · Solicitud privada"
                          : "Obra de Archivo"}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/portfolio/${photo.slug}`}
                    aria-label={`Abrir ficha de ${photo.title}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 font-mono text-xs text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
                  >
                    →
                  </Link>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
