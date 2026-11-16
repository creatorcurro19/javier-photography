"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_SLIDES = [
  {
    id: "landscapes",
    code: "LANDSCAPES",
    title: "Ocaso sobre el Erg",
    image: "/images/portfolio/viajes-cultura/B51A7341.jpg",
    mobileImage: "/images/portfolio/viajes-cultura/B51A7340.jpg",
    position: "object-[center_38%]",
  },
  {
    id: "wildlife",
    code: "WILDLIFE",
    title: "Mirada del Lince Boreal",
    image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
    mobileImage: "/images/portfolio/fauna-naturaleza/B51A8662.jpg",
    position: "object-center",
  },
  {
    id: "peaks",
    code: "TERRITORY",
    title: "Cumbre Nevada al Alba",
    image: "/images/portfolio/paisajes-documental/B51A0149.jpg",
    mobileImage: "/images/portfolio/paisajes-documental/B51A4880.jpg",
    position: "object-center",
  },
  {
    id: "motorsport",
    code: "MOTORSPORT",
    title: "Cruzada sobre el Asfalto",
    image: "/images/portfolio/coches-rally/B51A9718.jpg",
    mobileImage: "/images/portfolio/coches-rally/B51A9118.jpg",
    position: "object-center",
  },
  {
    id: "documentary",
    code: "DOCUMENTARY",
    title: "El Oficio y la Chispa",
    image: "/images/portfolio/viajes-cultura/soldador.jpg",
    mobileImage: "/images/portfolio/viajes-cultura/B51A6388.jpg",
    position: "object-center",
  },
] as const;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-svh w-full bg-[#101112] overflow-hidden flex items-center justify-center">
      {/* Slideshow de obras maestras horizontales (Escritorio) y verticales (Móvil) */}
      {HERO_SLIDES.map((slide, idx) => {
        const isCurrent = idx === activeSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!isCurrent}
          >
            <Image
              src={slide.image}
              alt={`${slide.title} — Fotografía de autor por Javier Espinosa Martínez`}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`hidden sm:block object-cover ${slide.position} brightness-[0.92] contrast-[1.04]`}
            />
            <Image
              src={slide.mobileImage}
              alt={`${slide.title} — Fotografía de autor por Javier Espinosa Martínez`}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="block sm:hidden object-cover object-center brightness-[0.92] contrast-[1.04]"
            />
          </div>
        );
      })}

      <div
        className="absolute inset-0 bg-gradient-to-b from-[#101112]/55 via-[#101112]/35 to-[#101112]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 pt-28 pb-28 sm:px-12 md:px-16 lg:px-20 text-center text-[#D8D5CD]">
        <p className="mb-6 text-[11px] sm:text-xs uppercase tracking-[0.45em] text-[#D8D5CD] drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)] font-normal">
          Fotografía de Autor · España
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light tracking-[0.05em] leading-[1.08] text-[#D8D5CD] drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]">
          Javier Espinosa
        </h1>

        <p className="mt-6 text-[11px] sm:text-xs uppercase tracking-[0.32em] text-[#D8D5CD]/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)] font-light">
          Landscapes · Wildlife · Architecture · Motorsport · Documentary
        </p>

        <p className="mt-8 max-w-2xl text-base sm:text-lg font-light text-[#D8D5CD]/90 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
          La luz natural como guía, el rigor geométrico del espacio y la paciente observación documental del instante decisivo.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-9 py-4 text-xs uppercase tracking-[0.28em] text-[#101112] font-medium transition duration-300 hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Ver Colecciones
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center border border-[#D8D5CD]/40 bg-[#101112]/65 px-9 py-4 text-xs uppercase tracking-[0.28em] text-[#D8D5CD] backdrop-blur-md transition duration-300 hover:border-[#D8D5CD] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Proyectos Narrativos
          </Link>
        </div>

        {/* Selector interactivo de obra en portada */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`rounded-full px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] backdrop-blur-md transition ${
                  idx === activeSlide
                    ? "border border-[#D8D5CD] bg-[#101112]/80 text-[#D8D5CD]"
                    : "border border-white/15 bg-[#101112]/40 text-[#D8D5CD]/60 hover:text-[#D8D5CD]"
                }`}
              >
                {slide.code}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-serif italic tracking-wider text-[#D8D5CD]/75">
            {HERO_SLIDES[activeSlide].title}
          </span>
        </div>
      </div>
    </section>
  );
}
