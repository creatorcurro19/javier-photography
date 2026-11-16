"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";

interface LightboxModalProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const [showExif, setShowExif] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const photo = photos[currentIndex];

  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(prevIndex);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    onNavigate(nextIndex);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key.toLowerCase() === "i") {
        setShowExif((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }
    touchStartX.current = null;
  };

  if (!isOpen || !photo) return null;

  const categoryInfo = CATEGORY_METADATA[photo.category];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de fotografía: ${photo.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-800/80 px-4 md:px-8">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-mono text-neutral-400">
            {currentIndex + 1} <span className="text-neutral-600">/</span> {photos.length}
          </span>
          <span className="hidden h-3 w-px bg-neutral-800 sm:block" />
          <span className="hidden uppercase tracking-[0.25em] text-neutral-400 sm:inline">
            {categoryInfo?.title ?? photo.category}
          </span>
        </div>

        <h2 className="hidden truncate text-sm font-light tracking-wide text-neutral-200 md:block max-w-md">
          {photo.title}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowExif(!showExif)}
            className={`rounded-full px-3 py-1.5 text-xs font-mono tracking-wider transition ${
              showExif
                ? "bg-neutral-100 text-neutral-950 font-medium"
                : "border border-neutral-700 text-neutral-300 hover:border-neutral-400 hover:text-white"
            }`}
            title="Información de disparo (Tecla I)"
          >
            EXIF
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
            aria-label="Cerrar visor (Esc)"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Image Area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-2 sm:p-6">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 z-20 rounded-full bg-black/50 p-3 text-neutral-300 backdrop-blur-md transition hover:bg-black/90 hover:text-white md:left-6"
          aria-label="Fotografía anterior"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 z-20 rounded-full bg-black/50 p-3 text-neutral-300 backdrop-blur-md transition hover:bg-black/90 hover:text-white md:right-6"
          aria-label="Fotografía siguiente"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* The Photo */}
        <div className="relative h-full w-full max-h-[82vh] max-w-[92vw]">
          <Image
            src={photo.image}
            alt={photo.alt}
            fill
            sizes="95vw"
            priority
            className="object-contain"
          />
        </div>

        {/* Floating EXIF / Details Panel */}
        {showExif && (
          <aside className="absolute bottom-4 left-4 right-4 z-30 mx-auto max-h-[70vh] max-w-xl overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950/95 p-5 text-neutral-300 shadow-2xl backdrop-blur-md sm:bottom-8 sm:left-auto sm:right-8 sm:w-96">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                  Ficha Técnica
                </p>
                <h3 className="mt-1 font-serif text-lg text-neutral-100">{photo.title}</h3>
                <p className="text-xs text-neutral-400">
                  {photo.location
                    ? `${photo.location}${photo.country ? `, ${photo.country}` : ""} (${photo.year})`
                    : `${photo.year} · Fotografía de Autor`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExif(false)}
                className="text-neutral-500 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-y border-neutral-800/80 py-3 font-mono text-xs text-neutral-400">
              <div>
                <span className="text-neutral-600">CÁMARA:</span> {photo.camera}
              </div>
              <div>
                <span className="text-neutral-600">FOCAL:</span> {photo.focalLength}
              </div>
              <div>
                <span className="text-neutral-600">APERTURA:</span> {photo.aperture}
              </div>
              <div>
                <span className="text-neutral-600">OBTURACIÓN:</span> {photo.shutter}
              </div>
              <div>
                <span className="text-neutral-600">ISO:</span> {photo.iso}
              </div>
              <div className="truncate">
                <span className="text-neutral-600">ÓPTICA:</span> {photo.lens.replace("Canon ", "").replace(" F3.5-6.3 IS STM", "")}
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-neutral-300">
              {photo.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 pt-2">
              <Link
                href={`/portfolio/${photo.slug}`}
                onClick={onClose}
                className="rounded border border-neutral-200 bg-neutral-100 px-3.5 py-1 text-[11px] uppercase tracking-wider text-neutral-950 font-medium transition hover:bg-white hover:text-black"
              >
                Ver Obra Completa
              </Link>
              <Link
                href={`/prints?obra=${photo.slug}`}
                onClick={onClose}
                className="rounded border border-neutral-700 bg-neutral-900/60 px-3 py-1 text-[11px] uppercase tracking-wider text-neutral-300 transition hover:border-neutral-400 hover:text-white"
              >
                Adquirir Print
              </Link>
              <Link
                href={`/licensing?obra=${photo.slug}`}
                onClick={onClose}
                className="rounded border border-neutral-700 bg-neutral-900/60 px-3 py-1 text-[11px] uppercase tracking-wider text-neutral-300 transition hover:border-neutral-400 hover:text-white"
              >
                Licenciar
              </Link>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Bar */}
      <footer className="flex h-14 shrink-0 items-center justify-between border-t border-neutral-800/80 px-4 md:px-8 text-xs text-neutral-400">
        <div className="truncate">
          <span className="font-light text-neutral-200">{photo.title}</span>
          <span className="mx-2 text-neutral-600">·</span>
          <span>{photo.location ? photo.location : `${photo.focalLength} · ${photo.camera}`}</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/portfolio/${photo.slug}`}
            onClick={onClose}
            className="underline underline-offset-4 hover:text-white"
          >
            Detalles de proyecto
          </Link>
        </div>
      </footer>
    </div>
  );
}
