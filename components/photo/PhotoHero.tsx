"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

const LightboxModal = dynamic(() => import("@/components/ui/LightboxModal"), {
  ssr: false,
});

const DARK_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSclMjMxNTE2MTgnLz48L3N2Zz4=";

type PhotoHeroProps = {
  photo: Photo;
  categoryPhotos?: Photo[];
};

export default function PhotoHero({ photo: rawPhoto, categoryPhotos }: PhotoHeroProps) {
  const { lang, t } = useLanguage();
  const photo = getLocalizedPhoto(rawPhoto, lang);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const photosList = categoryPhotos && categoryPhotos.length > 0 ? categoryPhotos : [rawPhoto];
  const initialIdx = photosList.findIndex((p) => p.id === rawPhoto.id);
  const [currentIndex, setCurrentIndex] = useState(initialIdx >= 0 ? initialIdx : 0);

  const openFullscreenViewer = (attemptNative = false) => {
    const idx = photosList.findIndex((p) => p.id === rawPhoto.id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
    if (
      attemptNative &&
      typeof document !== "undefined" &&
      !document.fullscreenElement &&
      document.documentElement.requestFullscreen
    ) {
      document.documentElement.requestFullscreen().catch(() => {
        // Ignorado si el navegador móvil no admite Fullscreen API nativa
      });
    }
  };

  return (
    <>
      <figure className="relative w-full bg-[#0B0C0E] py-6 transition-colors duration-500 sm:py-10">
        <div className="relative mx-auto flex max-h-[85vh] w-full items-center justify-center px-4 sm:px-8 md:px-12">
          <div
            role="button"
            tabIndex={0}
            aria-label={t(
              "Toca o haz doble clic para ver a pantalla completa",
              "Tap or double-click to view fullscreen"
            )}
            onClick={() => openFullscreenViewer(false)}
            onDoubleClick={() => openFullscreenViewer(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openFullscreenViewer(false);
              }
            }}
            className="group relative mx-auto flex max-h-[85vh] w-full cursor-zoom-in items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
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
          </div>

          <button
            type="button"
            onClick={() => openFullscreenViewer(true)}
            aria-label={t("Abrir fotografía a pantalla completa", "Open photograph in fullscreen")}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-14 z-10 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#C5A880]/50 bg-[#0B0C0E]/90 px-4 py-2 text-xs font-mono tracking-wider text-[#EBE7DF] backdrop-blur-md transition hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] shadow-lg cursor-pointer"
          >
            <span>{t("⛶ Pantalla completa", "⛶ Fullscreen")}</span>
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
