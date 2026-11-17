"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

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

const SLIDE_DURATION = 6500; // ms

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

  // Keyboard navigation for accessibility
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
      {/* Slideshow: Renderiza la imagen canónica en gran escala con zoom ambiental ultra sutil */}
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
                className={`object-cover ${slide.position} brightness-[0.88] contrast-[1.04]`}
              />
            </div>
          </div>
        );
      })}

      {/* Sombras y veladuras cinematográficas de museo (gradiente sutil arriba y abajo, centro diáfano) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0B0C0E]/70 via-transparent to-[#0B0C0E] pointer-events-none z-10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-radial from-transparent via-[#0B0C0E]/20 to-[#0B0C0E]/75 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Contenido Editorial Central */}
      <div className="relative z-20 mx-auto flex min-h-screen min-h-svh w-full max-w-6xl flex-col items-center justify-between px-6 pt-32 pb-16 sm:pb-20 text-center text-[#EBE7DF]">
        {/* Top Room Indicator */}
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-white/20 sm:w-10" />
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.42em] text-[#8E8A80]">
            {currentSlide.room} · {currentSlide.discipline}
          </p>
          <span className="h-px w-6 bg-white/20 sm:w-10" />
        </div>

        {/* Center: Title & Concept */}
        <div className="my-auto flex flex-col items-center max-w-4xl px-2">
          <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light tracking-[0.22em] uppercase text-[#EBE7DF] leading-tight drop-shadow-sm">
            Javier Espinosa
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#8E8A80]/40 sm:w-12" />
            <h2 className="font-serif italic text-base sm:text-xl md:text-2xl font-normal tracking-wide text-[#EBE7DF]/90">
              The Art of Seeing
            </h2>
            <span className="h-px w-8 bg-[#8E8A80]/40 sm:w-12" />
          </div>

          <p className="mt-5 max-w-xl text-xs sm:text-sm font-light tracking-wide text-[#8E8A80] leading-relaxed">
            La verdad óptica del territorio, la luz natural disponible y la paciente contemplación del instante irrepetible.
          </p>

          {/* Micro-interacción: Botones de acceso estilo museo */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/portfolio"
              className="group relative inline-flex items-center gap-2 overflow-hidden border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-[11px] uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              <span>Explorar Obras</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border border-white/20 bg-[#0B0C0E]/60 px-8 py-3.5 text-[11px] uppercase tracking-[0.28em] text-[#EBE7DF] backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-[#0B0C0E]/80 hover:text-white"
            >
              Series Monográficas
            </Link>
          </div>
        </div>

        {/* Bottom Bar: Telemetría de Sala & Conmutador Apple-like */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
          {/* Obra activa & Localización */}
          <div className="text-center sm:text-left">
            <p className="font-serif text-sm sm:text-base font-light text-[#EBE7DF] tracking-wide">
              {currentSlide.title}
            </p>
            <p className="font-mono text-[10px] text-[#8E8A80] tracking-wider mt-0.5">
              {currentSlide.location}
            </p>
          </div>

          {/* Selector de Salas interactivo */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, idx) => {
              const isSelected = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Entrar a ${slide.room}: ${slide.title}`}
                  className="group relative py-2 px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${
                        isSelected ? "text-[#EBE7DF]" : "text-[#8E8A80]/60 group-hover:text-[#8E8A80]"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div
                      className={`mt-1.5 h-[2px] transition-all duration-500 rounded-full ${
                        isSelected
                          ? "w-8 sm:w-10 bg-[#EBE7DF]"
                          : "w-3 sm:w-4 bg-white/20 group-hover:bg-white/40"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Desplazamiento sutil */}
          <div className="hidden md:flex items-center gap-2 text-right">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
              Salas de Colección
            </span>
            <span className="text-white/30">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
