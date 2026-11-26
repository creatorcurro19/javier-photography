"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";

type ZenGalleryModalProps = {
  photos: Photo[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
};

export default function ZenGalleryModal({
  photos,
  initialIndex = 0,
  open,
  onClose,
}: ZenGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showUi, setShowUi] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [speedSec, setSpeedSec] = useState(5);
  const [progress, setProgress] = useState(0);

  const hideUiTimer = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = photos.length;
  const currentPhoto = photos[currentIndex % total] ?? photos[0];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 45) {
      prevSlide();
    } else if (diff < -45) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  // Autoplay progression
  useEffect(() => {
    if (!open || !isPlaying || total <= 1) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      return;
    }

    const intervalMs = 50;
    const step = 100 / ((speedSec * 1000) / intervalMs);

    progressInterval.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          nextSlide();
          return 0;
        }
        return p + step;
      });
    }, intervalMs);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [open, isPlaying, speedSec, total, nextSlide]);

  // Auto-hide UI on mouse idle
  const handleMouseMove = () => {
    setShowUi(true);
    if (hideUiTimer.current) clearTimeout(hideUiTimer.current);
    hideUiTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowUi(false);
      }
    }, 2800);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key.toLowerCase() === "c") {
        setShowCaptions((c) => !c);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, nextSlide, prevSlide]);

  if (!open || total === 0) return null;

  return typeof document !== "undefined"
    ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Modo Galería Zen y pase de diapositivas a pantalla completa"
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[130] flex flex-col justify-between overflow-hidden bg-black select-none"
        >
          {/* Top Bar (Auto-hiding) */}
          <div
            className={`flex items-center justify-between p-6 sm:px-10 transition-opacity duration-700 ${
              showUi ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="font-serif text-lg tracking-[0.25em] text-[#EBE7DF]">
                JAVIER ESPINOSA
              </span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.3em] text-[#A39E93] sm:inline">
                · PRESENTACIÓN A PANTALLA COMPLETA
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed Switcher */}
              <div className="hidden border border-[#222] bg-[#111]/70 px-2 py-1 font-mono text-[9px] text-[#8E8A80] sm:flex sm:items-center sm:gap-2">
                <span>Velocidad:</span>
                {[4, 6, 8].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSpeedSec(s);
                      setProgress(0);
                    }}
                    className={`px-1.5 transition ${
                      speedSec === s ? "text-white font-bold" : "hover:text-[#EBE7DF]"
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>

              {/* Caption toggle */}
              <button
                type="button"
                onClick={() => setShowCaptions((c) => !c)}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                  showCaptions
                    ? "border-[#8E8A80] bg-[#8E8A80]/20 text-[#EBE7DF]"
                    : "border-[#222] text-neutral-500 hover:text-white"
                }`}
              >
                Textos: {showCaptions ? "ON" : "OFF"}
              </button>

              {/* Close Zen Mode */}
              <button
                type="button"
                onClick={onClose}
                className="border border-[#333] bg-[#111] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
              >
                Salir [ESC]
              </button>
            </div>
          </div>

          {/* Main Stage: Cinematic Aspect-Ratio Frame */}
          <div className="relative flex flex-1 items-center justify-center p-4 sm:p-10">
            <div className="relative h-full w-full max-h-[82vh] max-w-[92vw]">
              <Image
                key={currentPhoto.id}
                src={currentPhoto.image}
                alt={currentPhoto.alt}
                fill
                priority
                sizes="100vw"
                quality={90}
                className="object-contain transition-opacity duration-1000 ease-in-out"
              />
            </div>

            {/* Click zones for navigation */}
            <div
              className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize"
              onClick={prevSlide}
              title="Anterior (Flecha izquierda)"
            />
            <div
              className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize"
              onClick={nextSlide}
              title="Siguiente (Flecha derecha)"
            />
          </div>

          {/* Bottom Floating Caption & Controls Bar (Auto-hiding) */}
          <div
            className={`flex flex-col gap-3 p-6 sm:px-10 transition-opacity duration-700 ${
              showUi ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              {/* Photo Caption */}
              {showCaptions ? (
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    <span>{currentPhoto.category.replace("-", " ")}</span>
                    {currentPhoto.location && (
                      <>
                        <span>·</span>
                        <span>{currentPhoto.location}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-1 font-serif text-2xl font-light text-[#EBE7DF] sm:text-3xl">
                    {currentPhoto.title}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-neutral-400">
                    {currentPhoto.camera} · {currentPhoto.focalLength} · {currentPhoto.aperture} · {currentPhoto.shutter} · ISO {currentPhoto.iso}
                  </p>
                </div>
              ) : (
                <div />
              )}

              {/* Playback Controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Obra anterior"
                  className="border border-[#222] bg-[#111] p-2 text-neutral-400 transition hover:border-[#8E8A80] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Pausar pase de diapositivas" : "Reanudar pase"}
                  className="border border-[#8E8A80] bg-[#8E8A80]/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:bg-[#8E8A80] hover:text-[#0B0C0E]"
                >
                  {isPlaying ? "Pausar [Espacio]" : "Reproducir [Espacio]"}
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Siguiente obra"
                  className="border border-[#222] bg-[#111] p-2 text-neutral-400 transition hover:border-[#8E8A80] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <span className="font-mono text-xs text-neutral-400">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>

                <Link
                  href={`/portfolio/${currentPhoto.slug}`}
                  onClick={onClose}
                  className="border border-[#222] bg-[#111] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[#EBE7DF] transition hover:border-[#EBE7DF]"
                >
                  Abrir Ficha →
                </Link>
              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="h-0.5 w-full bg-[#1A1A1A] overflow-hidden">
              <div
                className="h-full bg-[#8E8A80] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
