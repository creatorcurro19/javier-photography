"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import LightboxModal from "@/components/ui/LightboxModal";

type ExhibitionGalleryProps = {
  photos: Photo[];
  showMeta?: boolean;
};

type ViewMode = "masonry" | "immersive" | "grid";

export default function ExhibitionGallery({
  photos,
  showMeta = true,
}: ExhibitionGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");

  if (photos.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-xl text-neutral-400">
          No hay fotografías en esta selección en este momento.
        </p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Gallery View Controls */}
      <div className="mb-10 flex items-center justify-between border-b border-[#1D2021] pb-4">
        <span className="font-mono text-xs text-[#95836B]">
          {photos.length} {photos.length === 1 ? "fotografía" : "fotografías"}
        </span>

        <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          <span className="hidden sm:inline mr-2 text-neutral-500">Presentación:</span>
          <button
            type="button"
            onClick={() => setViewMode("masonry")}
            className={`rounded px-2.5 py-1 transition ${
              viewMode === "masonry"
                ? "bg-[#1D2021] text-[#D8D5CD] font-medium"
                : "hover:text-[#D8D5CD]"
            }`}
          >
            Editorial
          </button>
          <span className="text-neutral-700">·</span>
          <button
            type="button"
            onClick={() => setViewMode("immersive")}
            className={`rounded px-2.5 py-1 transition ${
              viewMode === "immersive"
                ? "bg-[#1D2021] text-[#D8D5CD] font-medium"
                : "hover:text-[#D8D5CD]"
            }`}
          >
            Inmersiva
          </button>
          <span className="text-neutral-700">·</span>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded px-2.5 py-1 transition ${
              viewMode === "grid"
                ? "bg-[#1D2021] text-[#D8D5CD] font-medium"
                : "hover:text-[#D8D5CD]"
            }`}
          >
            Índice
          </button>
        </div>
      </div>

      {/* Grid Rendering by ViewMode.
          Todas las vistas respetan la proporción original de cada fotografía:
          las verticales se muestran completas y las horizontales sin franjas vacías. */}
      <div
        className={
          viewMode === "masonry"
            ? "columns-1 gap-8 sm:columns-2 lg:columns-3"
            : viewMode === "immersive"
            ? "mx-auto flex max-w-5xl flex-col items-center gap-24"
            : "columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5"
        }
      >
        {photos.map((photo, index) => {
          return (
            <figure
              key={photo.id}
              className={`group overflow-hidden rounded-lg border border-[#1D2021] bg-[#1D2021]/40 transition duration-500 hover:border-[#95836B]/60 hover:bg-[#1D2021]/70 ${
                viewMode === "masonry"
                  ? "mb-10 break-inside-avoid"
                  : viewMode === "grid"
                  ? "mb-4 break-inside-avoid"
                  : "w-fit max-w-full"
              }`}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`Ver ${photo.title} a pantalla completa`}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(index);
                  }
                }}
                className="relative cursor-pointer overflow-hidden bg-[#1D2021] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={
                    viewMode === "immersive"
                      ? "(max-width: 1024px) 100vw, 1024px"
                      : viewMode === "grid"
                      ? "(max-width: 640px) 50vw, 20vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  className={`transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
                    viewMode === "immersive"
                      ? "h-auto max-h-[85vh] w-auto max-w-full"
                      : "h-auto w-full"
                  }`}
                />

                {/* Subtle Hover Overlay with Action Pill */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#D8D5CD] shadow-lg backdrop-blur-md font-mono">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                    Ampliar
                  </span>
                </div>
              </div>

              {showMeta && viewMode !== "grid" && (
                <figcaption className="flex items-baseline justify-between gap-3 border-t border-[#1D2021]/60 bg-[#101112]/70 px-5 py-3.5">
                  <h3 className="font-serif text-lg font-light text-[#D8D5CD] group-hover:text-white transition-colors">
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      className="hover:underline underline-offset-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {photo.title}
                    </Link>
                  </h3>

                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-[#95836B] group-hover:text-[#D8D5CD] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {photo.focalLength} →
                  </Link>
                </figcaption>
              )}
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
    </>
  );
}
