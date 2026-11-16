"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";
import LightboxModal from "@/components/ui/LightboxModal";

type ExhibitionGalleryProps = {
  photos: Photo[];
  showMeta?: boolean;
};

export default function ExhibitionGallery({
  photos,
  showMeta = true,
}: ExhibitionGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">
        {photos.map((photo, index) => {
          const isVertical = photo.height > photo.width;
          const categoryTitle =
            CATEGORY_METADATA[photo.category]?.title ?? photo.category;

          return (
            <figure
              key={photo.id}
              className="group mb-10 break-inside-avoid overflow-hidden rounded-sm bg-neutral-950 border border-neutral-900/60 transition duration-300 hover:border-neutral-700"
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
                className="relative cursor-pointer overflow-hidden bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Subtle Hover Overlay with Action Pill */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-100 shadow-lg backdrop-blur-md">
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

                {isVertical && (
                  <span className="absolute top-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-300 backdrop-blur-sm opacity-0 transition group-hover:opacity-100">
                    Vertical
                  </span>
                )}
              </div>

              {showMeta && (
                <figcaption className="px-5 pt-4 pb-5 bg-neutral-950">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                    <span>{categoryTitle}</span>
                    <span>{photo.year}</span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-lg font-normal text-neutral-100 group-hover:text-white transition-colors">
                      <Link
                        href={`/portfolio/${photo.slug}`}
                        className="hover:underline underline-offset-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {photo.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                    <p className="truncate max-w-[75%] font-mono text-[11px] text-neutral-400">
                      {photo.location ? photo.location : `${photo.focalLength} · ${photo.aperture}`}
                    </p>
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-200 transition-colors underline underline-offset-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ficha
                    </Link>
                  </div>
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
