"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import LightboxModal from "@/components/ui/LightboxModal";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";

interface SelectedWorkProps {
  photos: Photo[];
  totalCount?: number;
}

export default function SelectedWork({ photos, totalCount }: SelectedWorkProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="selected-work"
      className="bg-[#0B0C0E] py-20 sm:py-24 border-t border-white/[0.08] scroll-mt-20"
      aria-label="Selected Works — Exposición Permanente"
    >
      <Container>
        {/* Curatorial Header */}
        <div className="flex flex-col justify-between gap-4 pb-8 border-b border-white/[0.08] md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8E8A80]">
                Exposición Permanente
              </p>
            </div>
            <h2 className="mt-2.5 font-serif text-3xl sm:text-4xl font-light text-[#EBE7DF] tracking-tight">
              Selected Works
            </h2>
          </div>

          <Link
            href="/selected-work"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
          >
            <span>
              Ver selección completa{totalCount ? ` (${totalCount})` : ""}
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Clean 2x3 Curatorial Grid (6 signature artworks) */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, idx) => {
            const categoryInfo = CATEGORY_METADATA[photo.category];

            return (
              <figure
                key={photo.id}
                className="group overflow-hidden border border-white/[0.08] bg-[#151618] transition-all duration-500 hover:border-white/30"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver obra ${photo.title} a pantalla completa`}
                  onClick={() => openLightbox(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(idx);
                    }
                  }}
                  className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[#0B0C0E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] brightness-[0.92] group-hover:brightness-100"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full border border-white/40 bg-black/75 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#EBE7DF] backdrop-blur-md">
                      Ampliar
                    </span>
                  </div>
                </div>

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

        <LightboxModal
          photos={photos}
          currentIndex={selectedIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setSelectedIndex}
        />
      </Container>
    </section>
  );
}
