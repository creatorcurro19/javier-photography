"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import LightboxModal from "@/components/ui/LightboxModal";

type PhotoHeroProps = {
  photo: Photo;
  categoryPhotos?: Photo[];
};

export default function PhotoHero({ photo, categoryPhotos }: PhotoHeroProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const photosList = categoryPhotos && categoryPhotos.length > 0 ? categoryPhotos : [photo];
  const initialIdx = photosList.findIndex((p) => p.id === photo.id);
  const [currentIndex, setCurrentIndex] = useState(initialIdx >= 0 ? initialIdx : 0);

  return (
    <>
      <figure className="relative w-full bg-neutral-950 py-4 sm:py-8">
        <div
          role="button"
          tabIndex={0}
          aria-label="Abrir imagen a pantalla completa"
          onClick={() => {
            const idx = photosList.findIndex((p) => p.id === photo.id);
            setCurrentIndex(idx >= 0 ? idx : 0);
            setLightboxOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const idx = photosList.findIndex((p) => p.id === photo.id);
              setCurrentIndex(idx >= 0 ? idx : 0);
              setLightboxOpen(true);
            }
          }}
          className="group relative mx-auto flex max-h-[85vh] w-full cursor-zoom-in items-center justify-center px-4 sm:px-8 md:px-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <div className="relative max-h-[82vh] w-full flex items-center justify-center">
            <Image
              src={photo.image}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              sizes="(max-width: 1024px) 100vw, 85vw"
              className="max-h-[82vh] w-auto max-w-full rounded-sm object-contain shadow-2xl transition duration-500 group-hover:brightness-105"
            />
          </div>

          <div className="absolute bottom-6 right-6 hidden rounded-full border border-neutral-700 bg-black/70 px-4 py-2 text-xs font-mono tracking-wider text-neutral-300 backdrop-blur-md transition group-hover:border-neutral-500 group-hover:text-neutral-100 sm:block">
            Ver a pantalla completa
          </div>
        </div>
      </figure>

      <LightboxModal
        photos={photosList}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setCurrentIndex(newIndex)}
      />
    </>
  );
}
