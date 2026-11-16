"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import LightboxModal from "@/components/ui/LightboxModal";

type PhotoHeroProps = {
  photo: Photo;
  categoryPhotos?: Photo[];
};

type FrameStyle = "clean" | "black" | "oak";

export default function PhotoHero({ photo, categoryPhotos }: PhotoHeroProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("clean");
  const photosList = categoryPhotos && categoryPhotos.length > 0 ? categoryPhotos : [photo];
  const initialIdx = photosList.findIndex((p) => p.id === photo.id);
  const [currentIndex, setCurrentIndex] = useState(initialIdx >= 0 ? initialIdx : 0);

  return (
    <>
      <figure
        className={`relative w-full transition-colors duration-500 py-6 sm:py-10 ${
          frameStyle === "clean"
            ? "bg-[#101112]"
            : "bg-gradient-to-b from-[#1A1C1E] via-[#222528] to-[#161819]"
        }`}
      >
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
          {frameStyle === "clean" ? (
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
          ) : (
            /* Simulador de Enmarcado Museístico con Paspartú Hahnemühle 308g */
            <div
              className={`relative mx-auto flex flex-col items-center transition-all duration-500 shadow-[0_30px_90px_rgba(0,0,0,0.85)] ${
                frameStyle === "black"
                  ? "border-[10px] sm:border-[16px] border-[#141516] ring-1 ring-white/10"
                  : "border-[10px] sm:border-[16px] border-[#5E432C] ring-1 ring-[#8A6647]/40"
              } bg-[#F3EFE6] p-5 sm:p-10 md:p-14`}
            >
              <div className="border border-neutral-300/80 shadow-inner bg-white p-1">
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  priority
                  sizes="(max-width: 1024px) 90vw, 70vw"
                  className="max-h-[64vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-3 flex w-full items-center justify-between px-1 text-[10px] tracking-[0.2em] text-neutral-500 font-serif italic">
                <span>1/25 · Edición Hahnemühle Photo Rag 308g</span>
                <span>Javier Espinosa</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 right-6 hidden rounded-full border border-[#1D2021] bg-[#101112]/80 px-4 py-2 text-xs font-mono tracking-wider text-[#D8D5CD] backdrop-blur-md transition group-hover:border-[#95836B]/60 group-hover:text-white sm:block">
            Ver a pantalla completa
          </div>
        </div>

        {/* Selector interactivo de visualización y enmarcado */}
        <div className="mx-auto mt-6 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4 text-[11px] uppercase tracking-[0.2em] sm:flex-wrap">
          <span className="shrink-0 mr-1 text-[#95836B]">Simulador:</span>
          <button
            type="button"
            onClick={() => setFrameStyle("clean")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 transition ${
              frameStyle === "clean"
                ? "bg-[#D8D5CD] text-[#101112] font-medium"
                : "border border-[#1D2021] bg-[#1D2021]/50 text-[#D8D5CD]/80 hover:border-[#95836B]"
            }`}
          >
            Vista Limpia
          </button>
          <button
            type="button"
            onClick={() => setFrameStyle("black")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 transition ${
              frameStyle === "black"
                ? "bg-[#D8D5CD] text-[#101112] font-medium"
                : "border border-[#1D2021] bg-[#101112] text-[#D8D5CD]/80 hover:border-[#95836B]"
            }`}
          >
            Marco Negro + Paspartú
          </button>
          <button
            type="button"
            onClick={() => setFrameStyle("oak")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 transition ${
              frameStyle === "oak"
                ? "bg-[#D8D5CD] text-[#101112] font-medium"
                : "border border-[#1D2021] bg-[#101112] text-[#D8D5CD]/80 hover:border-[#95836B]"
            }`}
          >
            Marco Roble + Paspartú
          </button>
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
