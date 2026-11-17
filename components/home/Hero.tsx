"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AndalusianCenefa,
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
    position: "object-[center_30%]",
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
    position: "object-[center_38%]",
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
      className="relative w-full bg-[#0B0C0E] overflow-hidden select-none md:min-h-screen md:min-h-svh md:flex md:flex-col md:justify-end"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Museo de Fotografía de Autor — Javier Espinosa"
    >
      {/* Escenario fotográfico: en móvil limpio y sin cuadros encima; en escritorio a pantalla completa */}
      <div className="relative mt-[71px] h-[46svh] min-h-[290px] w-full overflow-hidden md:mt-0 md:absolute md:inset-0 md:h-full">
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
                  className={`object-cover ${slide.position} brightness-[0.94] contrast-[1.03] md:brightness-[0.88]`}
                />
              </div>
            </div>
          );
        })}

        {/* Degradado sutil solo en el borde inferior en móvil, y cinematográfico en el tercio inferior en escritorio */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#0B0C0E]/20 via-transparent to-[#0B0C0E] md:from-[#0B0C0E]/55 md:via-[#0B0C0E]/15 md:via-45% md:to-[#0B0C0E]"
          aria-hidden="true"
        />
        {/* Segundo velo inferior suave en escritorio para garantizar lectura perfecta sin tapar la foto */}
        <div
          className="pointer-events-none hidden md:block absolute inset-x-0 bottom-0 z-10 h-[56%] bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/75 to-transparent"
          aria-hidden="true"
        />

        {/* Etiqueta discreta de sala en esquina superior (sin tapar el sujeto) */}
        <div className="absolute top-4 left-4 z-20 md:top-28 md:left-1/2 md:-translate-x-1/2">
          <div className="inline-flex items-center gap-2 border border-[#C5A880]/30 bg-[#0B0C0E]/70 px-3 py-1 backdrop-blur-md sm:px-4 sm:py-1.5">
            <AndalusianStarMark className="h-2.5 w-2.5 text-[#C5A880] sm:h-3 sm:w-3" />
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.36em] text-[#E5D3B3] whitespace-nowrap">
              {currentSlide.room} · {currentSlide.discipline}
            </p>
          </div>
        </div>
      </div>

      {/* Bloque Editorial: debajo de la foto en móvil, y anclado limpiamente al tercio inferior en escritorio */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-5 pt-6 pb-12 text-center text-[#F7F4EE] sm:px-8 md:pt-0 md:pb-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-sans text-2xl sm:text-4xl md:text-6xl font-light tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#F7F4EE] leading-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]">
            Javier Espinosa
          </h1>

          <div className="mt-3 flex items-center justify-center gap-2.5 sm:gap-3">
            <span className="h-px w-6 bg-[#C5A880]/55 sm:w-12" />
            <AndalusianStarMark className="h-3 w-3 text-[#C5A880] sm:h-3.5 sm:w-3.5" />
            <h2 className="font-serif italic text-base sm:text-xl md:text-2xl font-normal tracking-wide text-[#E5D3B3] [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
              The Art of Seeing
            </h2>
            <AndalusianStarMark className="h-3 w-3 text-[#C5A880] sm:h-3.5 sm:w-3.5" />
            <span className="h-px w-6 bg-[#C5A880]/55 sm:w-12" />
          </div>

          <p className="mx-auto mt-3.5 max-w-xl text-xs sm:text-sm font-light tracking-wide text-[#EBE7DF]/85 leading-relaxed">
            La verdad óptica del territorio, la luz natural disponible y la paciente contemplación del instante irrepetible.
          </p>

          {/* Accesos principales */}
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-7">
            <Link
              href="/portfolio"
              className="group inline-flex items-center justify-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-7 py-3 text-[11px] uppercase tracking-[0.26em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              <span>Explorar Obras</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 border border-[#C5A880]/45 bg-[#0B0C0E]/75 px-7 py-3 text-[11px] uppercase tracking-[0.26em] text-[#F7F4EE] transition-all duration-300 hover:border-[#C5A880] hover:bg-[#151618]"
            >
              Series Monográficas
            </Link>
          </div>
        </div>

        {/* Barra de obra activa y selector de salas */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#C5A880]/20 pt-5 sm:flex-row md:mt-10">
          <div className="text-center sm:text-left">
            <p className="font-serif text-sm sm:text-base font-light text-[#F7F4EE] tracking-wide">
              {currentSlide.title}
            </p>
            <p className="font-mono text-[10px] text-[#C5A880]/90 tracking-wider mt-0.5">
              {currentSlide.location}
            </p>
          </div>

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
                          ? "w-7 sm:w-10 bg-[#C5A880]"
                          : "w-3 sm:w-4 bg-white/25 group-hover:bg-[#C5A880]/60"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

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
      <div className="pointer-events-none relative z-20 md:absolute md:inset-x-0 md:bottom-0">
        <AndalusianCenefa variant="estrella" className="text-[#C5A880]/45" />
      </div>
    </section>
  );
}
