"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";
import AddToCartModal from "@/components/cart/AddToCartModal";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFilmstrip, setShowFilmstrip] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [addCartOpen, setAddCartOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const photo = photos[currentIndex];

  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    setIsZoomed(false);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(prevIndex);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    setIsZoomed(false);
    const nextIndex = (currentIndex + 1) % photos.length;
    onNavigate(nextIndex);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    if (!isOpen || !isPlaying || photos.length <= 1) return;
    const timer = window.setInterval(() => {
      handleNext();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [isOpen, isPlaying, photos.length, handleNext]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          setIsPlaying(false);
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        setIsPlaying(false);
        handlePrev();
      } else if (e.key === "ArrowRight") {
        setIsPlaying(false);
        handleNext();
      } else if (e.key.toLowerCase() === "i") {
        setShowExif((prev) => !prev);
      } else if (e.key.toLowerCase() === "z") {
        setIsZoomed((prev) => !prev);
      } else if (e.key.toLowerCase() === "p" || e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handlePrev, handleNext, isZoomed]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isZoomed || touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }
    touchStartX.current = null;
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  if (!isOpen || !photo) return null;

  const categoryInfo = CATEGORY_METADATA[photo.category];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de fotografía: ${photo.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#0B0C0E]/98 backdrop-blur-2xl select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar: Discreet Museum Telemetry */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-4 md:px-8 gap-4">
        <div className="flex shrink-0 items-center gap-3 sm:gap-4 text-xs font-mono">
          <span className="text-[#EBE7DF]">
            {String(currentIndex + 1).padStart(2, "0")} <span className="text-white/20">/</span> {String(photos.length).padStart(2, "0")}
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:block" />
          <span className="hidden uppercase tracking-[0.25em] text-[#8E8A80] sm:inline">
            {categoryInfo?.title ?? photo.category}
          </span>
        </div>

        <h2 className="hidden truncate text-sm font-light tracking-wide text-[#EBE7DF] md:block min-w-0 flex-1 text-center font-serif px-2">
          {photo.title}
        </h2>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-mono tracking-wider transition ${
                  isPlaying
                    ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                    : "border border-white/[0.08] bg-[#151618] text-[#8E8A80] hover:border-white/30 hover:text-white"
                }`}
                title="Presentación automática (Tecla P o Espacio)"
              >
                {isPlaying ? "❚❚ Pausar" : "▶ Reproducir"}
              </button>
              <button
                type="button"
                onClick={() => setShowFilmstrip((prev) => !prev)}
                className={`hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-mono tracking-wider transition ${
                  showFilmstrip
                    ? "border border-white/30 bg-[#151618] text-[#EBE7DF]"
                    : "border border-white/[0.08] bg-[#151618] text-[#8E8A80] hover:text-white"
                }`}
                title="Mostrar u ocultar tira de miniaturas"
              >
                 Tira ({photos.length})
              </button>
            </>
          )}

          {/* Optical Zoom Toggle Button */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className={`rounded-full px-3 py-1.5 text-xs font-mono tracking-wider transition ${
              isZoomed
                ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                : "border border-white/[0.08] bg-[#151618] text-[#8E8A80] hover:border-white/30 hover:text-white"
            }`}
            title="Lupa óptica de detalle al 200% (Tecla Z o clic en imagen)"
          >
            {isZoomed ? "1× Normal" : "2× Lupa"}
          </button>

          <button
            type="button"
            onClick={() => setShowExif(!showExif)}
            className={`rounded-full px-3 py-1.5 text-xs font-mono tracking-wider transition ${
              showExif
                ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                : "border border-white/[0.08] bg-[#151618] text-[#8E8A80] hover:border-white/30 hover:text-white"
            }`}
            title="Ficha técnica y EXIF (Tecla I)"
          >
            EXIF
          </button>

          {photo.prints && (
            <button
              type="button"
              onClick={() => setAddCartOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#EBE7DF] bg-[#EBE7DF] px-3.5 py-1.5 text-xs font-mono tracking-wider text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white"
              title="Adquirir copia Fine Art certificada"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              + Cesta
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#8E8A80] transition hover:bg-white/[0.08] hover:text-white"
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
          className="absolute left-2 z-20 rounded-full bg-black/60 p-3 text-[#EBE7DF] backdrop-blur-md transition hover:bg-black/90 hover:text-white md:left-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
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
          className="absolute right-2 z-20 rounded-full bg-black/60 p-3 text-[#EBE7DF] backdrop-blur-md transition hover:bg-black/90 hover:text-white md:right-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
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

        {/* The Photo Container with Click-to-Zoom & Pan */}
        <div
          role="button"
          tabIndex={0}
          aria-label={isZoomed ? "Reducir tamaño (Zoom 1x)" : "Ampliar detalle a 2x"}
          onClick={() => setIsZoomed((prev) => !prev)}
          onMouseMove={handleImageMouseMove}
          onKeyDown={(e) => {
            if (e.key === "Enter") setIsZoomed((prev) => !prev);
          }}
          className={`relative h-full w-full max-h-[82vh] max-w-[92vw] overflow-hidden flex items-center justify-center ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          <div
            className={`relative h-full w-full transition-transform ease-out ${
              isZoomed ? "scale-[2.0] duration-200" : "scale-100 duration-300"
            }`}
            style={{
              transformOrigin: isZoomed ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : "center center",
            }}
          >
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              sizes="95vw"
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Floating EXIF / Details Panel */}
        {showExif && (
          <aside className="absolute bottom-4 left-4 right-4 z-30 mx-auto max-h-[70vh] max-w-xl overflow-y-auto border border-white/[0.1] bg-[#0B0C0E]/95 p-6 text-[#EBE7DF] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md sm:bottom-8 sm:left-auto sm:right-8 sm:w-96">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                  Ficha Técnica de Autor
                </p>
                <h3 className="mt-1 font-serif text-lg font-light text-[#EBE7DF]">{photo.title}</h3>
                <p className="mt-0.5 text-xs text-[#8E8A80]">
                  {photo.location
                    ? `${photo.location}${photo.country ? `, ${photo.country}` : ""} (${photo.year})`
                    : `${photo.year} · Fotografía de Autor`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExif(false)}
                className="text-[#8E8A80] hover:text-white"
                aria-label="Cerrar panel EXIF"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 border-y border-white/[0.08] py-3.5 font-mono text-xs text-[#8E8A80]">
              <div>
                <span className="text-white/60">CÁMARA:</span> {photo.camera}
              </div>
              <div>
                <span className="text-white/60">FOCAL:</span> {photo.focalLength}
              </div>
              <div>
                <span className="text-white/60">APERTURA:</span> {photo.aperture}
              </div>
              <div>
                <span className="text-white/60">OBTURADOR:</span> {photo.shutter}
              </div>
              <div>
                <span className="text-white/60">ISO:</span> {photo.iso}
              </div>
              <div className="truncate">
                <span className="text-white/60">ÓPTICA:</span> {photo.lens.replace("Canon ", "").replace(" F3.5-6.3 IS STM", "")}
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#8E8A80] font-light">
              {photo.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
              <Link
                href={`/portfolio/${photo.slug}`}
                onClick={onClose}
                className="border border-[#EBE7DF] bg-[#EBE7DF] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white"
              >
                Ver Obra Completa
              </Link>
              {photo.prints && (
                <button
                  type="button"
                  onClick={() => setAddCartOpen(true)}
                  className="border border-[#EBE7DF] bg-[#EBE7DF] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white"
                >
                  + Cesta Fine Art
                </button>
              )}
              <Link
                href={`/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`}
                onClick={onClose}
                className="border border-white/[0.08] bg-[#151618] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
              >
                Licenciar
              </Link>
            </div>
          </aside>
        )}
      </div>

      {/* Tira de Miniaturas (Filmstrip) */}
      {showFilmstrip && photos.length > 1 && (
        <div className="flex h-20 shrink-0 items-center gap-2 overflow-x-auto border-t border-white/[0.08] bg-[#0B0C0E]/95 px-4 md:px-8 no-scrollbar">
          {photos.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setIsZoomed(false);
                onNavigate(idx);
              }}
              aria-label={`Ir a ${item.title}`}
              className={`relative h-14 w-20 shrink-0 overflow-hidden transition ${
                idx === currentIndex
                  ? "ring-2 ring-[#EBE7DF] opacity-100 scale-105"
                  : "opacity-45 hover:opacity-85"
              }`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Bar: Clean Museum Plaque */}
      <footer className="flex h-14 shrink-0 items-center justify-between border-t border-white/[0.08] px-4 md:px-8 text-xs text-[#8E8A80] font-mono gap-4">
        <div className="min-w-0 flex-1 truncate">
          <span className="font-light text-[#EBE7DF] font-serif text-sm">{photo.title}</span>
          <span className="mx-2 text-white/20">·</span>
          <span>{photo.location ? photo.location : `${photo.focalLength} · ${photo.camera}`}</span>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href={`/portfolio/${photo.slug}`}
            onClick={onClose}
            className="underline underline-offset-4 text-[#8E8A80] hover:text-[#EBE7DF] transition"
          >
            Ficha completa →
          </Link>
        </div>
      </footer>

      {/* Modal para configurar y añadir obra a la cesta */}
      <AddToCartModal
        photo={photo}
        isOpen={addCartOpen}
        onClose={() => setAddCartOpen(false)}
      />
    </div>
  );
}
