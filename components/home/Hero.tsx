"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AndalusianCenefa,
  AndalusianCornerOrnaments,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";

interface HeroSlide {
  id: string;
  room: string;
  discipline: string;
  title: string;
  location: string;
  image: string;
  position: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "landscapes",
    room: "SALA I",
    discipline: "TERRITORIO",
    title: "Ocaso sobre el Erg",
    location: "Desierto del Sahara · Marruecos",
    image: "/images/portfolio/viajes-cultura/B51A7341.jpg",
    position: "object-[center_42%]",
  },
  {
    id: "wildlife",
    room: "SALA II",
    discipline: "FAUNA SALVAJE",
    title: "Mirada del Lince Boreal",
    location: "Taiga Boreal · España",
    image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
    position: "object-[center_35%]",
  },
  {
    id: "peaks",
    room: "SALA III",
    discipline: "PAISAJE MINERAL",
    title: "Cumbre Nevada al Alba",
    location: "Macizo Central · Alta Montaña",
    image: "/images/portfolio/paisajes-documental/B51A0149.jpg",
    position: "object-[center_32%]",
  },
  {
    id: "motorsport",
    room: "SALA IV",
    discipline: "AUTOMOVILISMO",
    title: "Cruzada sobre el Asfalto",
    location: "Tramo Cronometrado · Rally Histórico",
    image: "/images/portfolio/coches-rally/B51A9718.jpg",
    position: "object-[center_45%]",
  },
  {
    id: "documentary",
    room: "SALA V",
    discipline: "ETNOGRAFÍA",
    title: "El Oficio y la Chispa",
    location: "Herrería Tradicional · Memoria Rural",
    image: "/images/portfolio/viajes-cultura/soldador.jpg",
    position: "object-[center_40%]",
  },
];

const SLIDE_DURATION = 6500;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(nextSlide, SLIDE_DURATION);
    return () => window.clearInterval(interval);
  }, [isPaused, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section
      className="relative min-h-screen min-h-svh w-full bg-[#0B0C0E] overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Museo de Fotografía de Autor — Javier Espinosa"
    >
      {/* Slideshow fotográfico a gran escala */}
      {HERO_SLIDES.map((slide, idx) => {
        const isCurrent = idx === activeSlide;
        const isNext = idx === (activeSlide + 1) % HERO_SLIDES.length;
        if (!isCurrent && !isNext) return null;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
            }`}
            aria-hidden={!isCurrent}
          >
            <div
              className={`relative h-full w-full transition-transform duration-[7000ms] ease-out motion-reduce:transform-none ${
                isCurrent ? "scale-[1.03]" : "scale-100"
              }`}
            >
              <Image
                src={slide.image}
                alt={`${slide.title} — ${slide.discipline} por Javier Espinosa Martínez`}
                fill
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className={`object-cover ${slide.position} brightness-[0.82] contrast-[1.05]`}
              />
            </div>
          </div>
        );
      })}

      {/* Veladura cinematográfica dual (garantiza lectura perfecta sobre fotos luminosas y nevadas) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#0B0C0E]/80 via-[#0B0C0E]/35 to-[#0B0C0E]/95"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 72% 62% at 50% 48%, rgba(11,12,14,0.62) 0%, rgba(11,12,14,0.34) 58%, rgba(11,12,14,0.84) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Contenido Editorial Central */}
      <div className="relative z-20 mx-auto flex min-h-screen min-h-svh w-full max-w-6xl flex-col items-center justify-between px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-16 text-center text-[#F7F4EE]">
        {/* Indicador superior de sala en cápsula oscura legible */}
        <div className="inline-flex items-center gap-3 border border-[#C5A880]/30 bg-[#0B0C0E]/70 px-4 py-1.5 backdrop-blur-md">
          <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.38em] text-[#E5D3B3]">
            {currentSlide.room} · {currentSlide.discipline}
          </p>
          <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
        </div>

        {/* Cartela arquitectónica central andalusí: máxima elegancia y legibilidad */}
        <div className="relative my-auto w-full max-w-3xl border border-[#C5A880]/30 bg-[#0B0C0E]/65 px-6 py-10 shadow-[0_32px_90px_rgba(0,0,0,0.75)] backdrop-blur-md sm:px-14 sm:py-12">
          <AndalusianCornerOrnaments className="text-[#C5A880]/70" />

          {/* Emblema JE andalusí */}
          <div className="mx-auto mb-5 flex justify-center">
            <Image
              src="/icon.svg"
              alt="Monograma JE — Javier Espinosa"
              width={48}
              height={48}
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] ring-1 ring-[#C5A880]/35"
            />
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.22em] uppercase text-[#F7F4EE] leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">
            Javier Espinosa
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#C5A880]/55 sm:w-14" />
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            <h2 className="font-serif italic text-lg sm:text-2xl font-normal tracking-wide text-[#E5D3B3] [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              The Art of Seeing
            </h2>
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            <span className="h-px w-8 bg-[#C5A880]/55 sm:w-14" />
          </div>

          <p className="mx-auto mt-5 max-w-xl text-xs sm:text-sm font-light tracking-wide text-[#EBE7DF]/90 leading-relaxed">
            La verdad óptica del territorio, la luz natural disponible y la paciente contemplación del instante irrepetible.
          </p>

          {/* Accesos principales */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-7 py-3 text-[11px] uppercase tracking-[0.26em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              <span>Explorar Obras</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border border-[#C5A880]/45 bg-[#0B0C0E]/75 px-7 py-3 text-[11px] uppercase tracking-[0.26em] text-[#F7F4EE] transition-all duration-300 hover:border-[#C5A880] hover:bg-[#151618]"
            >
              Series Monográficas
            </Link>
          </div>
        </div>

        {/* Barra inferior de sala en cristal oscuro legible */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C5A880]/20 bg-[#0B0C0E]/75 px-5 py-3.5 backdrop-blur-md">
          {/* Obra activa y localización */}
          <div className="text-center sm:text-left">
            <p className="font-serif text-sm sm:text-base font-light text-[#F7F4EE] tracking-wide">
              {currentSlide.title}
            </p>
            <p className="font-mono text-[10px] text-[#C5A880]/90 tracking-wider mt-0.5">
              {currentSlide.location}
            </p>
          </div>

          {/* Selector interactivo de salas */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, idx) => {
              const isSelected = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Entrar a ${slide.room}: ${slide.title}`}
                  className="group relative py-1.5 px-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${
                        isSelected ? "text-[#F7F4EE] font-medium" : "text-[#EBE7DF]/55 group-hover:text-[#EBE7DF]"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div
                      className={`mt-1.5 h-[2px] transition-all duration-500 rounded-full ${
                        isSelected
                          ? "w-8 sm:w-10 bg-[#C5A880]"
                          : "w-3 sm:w-4 bg-white/25 group-hover:bg-[#C5A880]/60"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Indicador de desplazamiento */}
          <a
            href="#selected-work"
            className="hidden md:flex items-center gap-2 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF]/80 transition hover:text-[#C5A880]"
          >
            <span>Descubrir</span>
            <span>↓</span>
          </a>
        </div>
      </div>

      {/* Cenefa andalusí marcando la entrada a las salas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <AndalusianCenefa variant="estrella" className="text-[#C5A880]/45" />
      </div>
    </section>
  );
}
