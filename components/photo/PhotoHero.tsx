"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Photo } from "@/types/photo";

const LightboxModal = dynamic(() => import("@/components/ui/LightboxModal"), {
  ssr: false,
});

const DARK_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSclMjMxNTE2MTgnLz48L3N2Zz4=";

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
            ? "bg-[#0B0C0E]"
            : "bg-gradient-to-b from-[#151618] via-[#1A1C1E] to-[#0B0C0E]"
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
                draggable={false}
                placeholder="blur"
                blurDataURL={DARK_BLUR_DATA_URL}
                sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1600px"
                quality={90}
                className="max-h-[82vh] w-auto max-w-full rounded-sm object-contain shadow-2xl transition duration-500 group-hover:brightness-105 pointer-events-none select-none"
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
                  draggable={false}
                  sizes="(max-width: 1024px) 90vw, 70vw"
                  quality={90}
                  className="max-h-[64vh] w-auto max-w-full object-contain pointer-events-none select-none"
                />
              </div>
              <div className="mt-3 flex w-full items-center justify-between px-1 text-[10px] tracking-[0.2em] text-neutral-500 font-serif italic">
                <span>1/25 · Edición Hahnemühle Photo Rag 308g</span>
                <span>Javier Espinosa</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#C5A880]/40 bg-[#0B0C0E]/90 px-4 py-2 text-xs font-mono tracking-wider text-[#EBE7DF] backdrop-blur-md transition group-hover:border-[#C5A880] group-hover:text-white shadow-lg">
            <span>⛶ Ver a pantalla completa</span>
          </div>
        </div>

        {/* Selector interactivo de visualización y enmarcado (oculto en versión minimalista) */}
        <div className="hidden mx-auto mt-6 items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4 text-[11px] font-mono uppercase tracking-[0.2em] sm:flex-wrap">
          <span className="shrink-0 mr-1 text-[#A39E93]">Simulador:</span>
          <button
            type="button"
            onClick={() => setFrameStyle("clean")}
            className={`shrink-0 inline-flex min-h-[44px] items-center rounded-full px-4 py-2 transition ${
              frameStyle === "clean"
                ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                : "border border-white/[0.12] bg-[#151618] text-[#A39E93] hover:border-white/30 hover:text-[#EBE7DF]"
            }`}
          >
            Vista Limpia
          </button>
          <button
            type="button"
            onClick={() => setFrameStyle("black")}
            className={`shrink-0 inline-flex min-h-[44px] items-center rounded-full px-4 py-2 transition ${
              frameStyle === "black"
                ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                : "border border-white/[0.12] bg-[#151618] text-[#A39E93] hover:border-white/30 hover:text-[#EBE7DF]"
            }`}
          >
            Marco Negro + Paspartú
          </button>
          <button
            type="button"
            onClick={() => setFrameStyle("oak")}
            className={`shrink-0 inline-flex min-h-[44px] items-center rounded-full px-4 py-2 transition ${
              frameStyle === "oak"
                ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                : "border border-white/[0.12] bg-[#151618] text-[#A39E93] hover:border-white/30 hover:text-[#EBE7DF]"
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
