"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { BASE_PRINT_FORMATS } from "@/data/formatos";
import type { Photo } from "@/types/photo";
import PrintCardAction from "@/components/cart/PrintCardAction";

const LightboxModal = dynamic(() => import("@/components/ui/LightboxModal"), {
  ssr: false,
});

const DARK_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSclMjMxNTE2MTgnLz48L3N2Zz4=";

type ExhibitionGalleryProps = {
  photos: Photo[];
  showMeta?: boolean;
};

const INITIAL_BATCH = 24;

export default function ExhibitionGallery({
  photos,
  showMeta = true,
}: ExhibitionGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);

  const visiblePhotos = photos.slice(0, visibleCount);

  if (photos.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-xl text-[#8E8A80]">
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
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <p className="font-mono text-xs text-[#A39E93]">
          <strong className="text-[#EBE7DF] font-normal">{photos.length}</strong>{" "}
          {photos.length === 1 ? "foto" : "fotos"} ·{" "}
          <span className="text-[#8E8A80]">Toca cualquier foto para abrir su ficha completa</span>
        </p>

        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="shrink-0 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#C5A880]/50 bg-[#151618] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#EBE7DF] transition hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] cursor-pointer"
        >
          <span>⛶ Pantalla completa</span>
        </button>
      </div>

      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
        {visiblePhotos.map((photo) => (
          <figure
            key={photo.id}
            className="mb-10 break-inside-avoid group overflow-hidden border border-white/[0.08] bg-[#151618] transition-all duration-500 hover:border-white/30"
          >
            <Link
              href={`/portfolio/${photo.slug}`}
              aria-label={`Abrir ficha de ${photo.title}`}
              className="relative block cursor-pointer overflow-hidden bg-[#0B0C0E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <Image
                src={photo.image}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                placeholder="blur"
                blurDataURL={DARK_BLUR_DATA_URL}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 420px"
                quality={85}
                loading="lazy"
                draggable={false}
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02] pointer-events-none select-none"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/80 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#EBE7DF] shadow-lg backdrop-blur-md font-mono">
                  Ver ficha completa →
                </span>
              </div>
            </Link>

            {showMeta && (
              <figcaption className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-[#151618] px-5 py-3.5">
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-base font-light text-[#EBE7DF] group-hover:text-white transition-colors">
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      className="hover:underline underline-offset-4"
                    >
                      {photo.title}
                    </Link>
                  </h3>
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E8A80] hover:text-[#EBE7DF] transition-colors"
                  >
                    {photo.location ? `${photo.location.split(",")[0]} · ` : ""}
                    {photo.focalLength}
                    {photo.category === "fauna-naturaleza" && photo.condiciones ? ` · ${photo.condiciones}` : ""}
                    {" · "}Ficha →
                  </Link>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {photo.prints ? (
                    <>
                      <div className="text-right hidden sm:block">
                        <span className="whitespace-nowrap font-serif text-sm font-light text-[#C5A880] block leading-tight">
                          {photo.pricing?.estudio ?? BASE_PRINT_FORMATS.estudio.defaultPrice}&nbsp;€
                        </span>
                        <span className="whitespace-nowrap font-mono text-[8px] uppercase tracking-wider text-[#A39E93]">
                          Desde ({(photo.pricing?.dimensions?.estudio ?? BASE_PRINT_FORMATS.estudio.dimensions).replace(/ cm$/, "")})
                        </span>
                      </div>
                      <PrintCardAction photo={photo} />
                    </>
                  ) : (
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-white/15 bg-[#151618] px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[#C5A880] transition hover:border-[#C5A880] hover:text-white"
                    >
                      {photo.category === "coches-rally" ? "Archivo Rally" : "Ver Ficha"}
                    </Link>
                  )}
                </div>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {photos.length > visibleCount && (
        <div className="mt-14 flex flex-col items-center justify-center gap-3">
          <p className="font-mono text-xs text-[#8E8A80]">
            Mostrando {visiblePhotos.length} de {photos.length} fotografías
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_BATCH)}
              className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3 text-xs uppercase font-mono tracking-[0.26em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              Cargar 24 obras más
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(photos.length)}
              className="border border-white/20 bg-white/[0.05] px-6 py-3 text-xs uppercase font-mono tracking-[0.24em] text-[#EBE7DF] transition-all duration-300 hover:border-white/40 hover:text-white"
            >
              Ver las {photos.length} obras
            </button>
          </div>
        </div>
      )}

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
