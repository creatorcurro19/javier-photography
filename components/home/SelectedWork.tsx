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
}

export default function SelectedWork({ photos }: SelectedWorkProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="selected-work"
      className="bg-[#0B0C0E] py-28 sm:py-36 border-t border-white/[0.08] scroll-mt-20"
      aria-label="Selected Works — Exposición Permanente"
    >
      <Container>
        {/* Curatorial Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end pb-12 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#8E8A80]">
                Exposición Permanente · Sala de Honor
              </p>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#EBE7DF] tracking-tight">
              Selected Works
            </h2>
            <p className="mt-4 text-sm sm:text-base font-light text-[#8E8A80] leading-relaxed">
              Quince obras maestras que condensan la mirada de Javier Espinosa Martínez. Una selección meditada donde dialogan el silencio del desierto, la tensión de la fauna en libertad, la liturgia mecánica del rally y la geometría del territorio.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/selected-work"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#EBE7DF] transition-colors hover:text-white"
            >
              <span>Ver Monografía Completa</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Asymmetrical Curatorial Masonry */}
        <div className="mt-16 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {photos.map((photo, idx) => {
            const categoryInfo = CATEGORY_METADATA[photo.category];

            return (
              <figure
                key={photo.id}
                className="group mb-8 break-inside-avoid overflow-hidden border border-white/[0.08] bg-[#151618] transition-all duration-500 hover:border-white/30"
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
                  className="relative cursor-pointer overflow-hidden bg-[#0B0C0E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] brightness-[0.92] group-hover:brightness-100"
                  />

                  {/* Artwork Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#EBE7DF] bg-[#0B0C0E]/85 backdrop-blur-md px-2.5 py-1 border border-white/[0.08]">
                      N.º {String(idx + 1).padStart(2, "0")} · {categoryInfo?.code}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#EBE7DF] shadow-lg backdrop-blur-md">
                      Ampliar Obra
                    </span>
                  </div>
                </div>

                {/* Museum Artwork Plaque */}
                <figcaption className="p-5 sm:p-6 bg-[#151618] border-t border-white/[0.06] flex flex-col justify-between">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    <span>{categoryInfo?.title ?? photo.category}</span>
                    <span>{photo.year}</span>
                  </div>

                  <h3 className="mt-2 font-serif text-lg font-light text-[#EBE7DF] group-hover:text-white transition-colors">
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      className="hover:underline underline-offset-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {photo.title}
                    </Link>
                  </h3>

                  <p className="mt-1 font-mono text-[10px] text-[#8E8A80]">
                    {photo.location ? photo.location : `${photo.focalLength} · ${photo.aperture} · ${photo.shutter}`}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E8A80]">
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      className="transition-colors hover:text-[#EBE7DF]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ficha de Obra →
                    </Link>
                    {photo.prints && (
                      <span className="text-white/60 border border-white/10 px-1.5 py-0.5">
                        Fine Art
                      </span>
                    )}
                  </div>
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
          onNavigate={(newIndex) => setSelectedIndex(newIndex)}
        />
      </Container>
    </section>
  );
}
