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
    position: "object-[center_42%]",
  },
  {
    id: "wildlife",
    code: "WILDLIFE",
    title: "Mirada del Lince Boreal",
    image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
    position: "object-[center_35%]",
  },
  {
    id: "peaks",
    code: "TERRITORY",
    title: "Cumbre Nevada al Alba",
    image: "/images/portfolio/paisajes-documental/B51A0149.jpg",
    position: "object-[center_32%]",
  },
  {
    id: "motorsport",
    code: "MOTORSPORT",
    title: "Cruzada sobre el Asfalto",
    image: "/images/portfolio/coches-rally/B51A9718.jpg",
    position: "object-[center_45%]",
  },
  {
    id: "documentary",
    code: "DOCUMENTARY",
    title: "El Oficio y la Chispa",
    image: "/images/portfolio/viajes-cultura/soldador.jpg",
    position: "object-[center_40%]",
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
      {/* Slideshow: renderiza la imagen canónica con encuadre óptico responsivo */}
      {HERO_SLIDES.map((slide, idx) => {
        const isCurrent = idx === activeSlide;
        const isNext = idx === (activeSlide + 1) % HERO_SLIDES.length;
        if (!isCurrent && !isNext) return null;

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
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className={`object-cover ${slide.position} brightness-[0.92] contrast-[1.04]`}
            />
          </div>
        );
      })}

      <div
        className="absolute inset-0 bg-gradient-to-b from-[#101112]/45 via-transparent to-[#101112]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-5xl flex-col items-center justify-center px-6 pt-24 pb-28 text-center text-[#D8D5CD]">
        <p className="mb-4 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#D8D5CD]/80 font-normal">
          Fotografía de Autor
        </p>

        <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#D8D5CD] leading-none">
          Javier Espinosa
        </h1>

        <p className="mt-5 text-xs sm:text-sm uppercase tracking-[0.3em] text-[#95836B] font-light">
          Fauna · Paisaje · Rally · Arquitectura · Territorio
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/portfolio"
            className="border border-[#D8D5CD] bg-[#D8D5CD] px-7 py-3 text-[11px] uppercase tracking-[0.26em] text-[#101112] font-medium transition duration-300 hover:bg-transparent hover:text-white"
          >
            Ver Obras
          </Link>
          <Link
            href="/projects"
            className="border border-[#1D2021] bg-[#101112]/60 px-7 py-3 text-[11px] uppercase tracking-[0.26em] text-[#D8D5CD] backdrop-blur-md transition duration-300 hover:border-[#95836B] hover:text-white"
          >
            Series
          </Link>
        </div>

        {/* Minimalist Slide Telemetry Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
            0{activeSlide + 1} / 0{HERO_SLIDES.length}
          </span>
          <span className="text-neutral-600">·</span>
          <span className="font-serif italic text-xs tracking-wider text-[#D8D5CD]/80">
            {HERO_SLIDES[activeSlide].title}
          </span>
          <div className="ml-2 flex items-center gap-1.5">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Ir a diapositiva ${idx + 1}: ${slide.title}`}
                className={`h-1 transition-all ${
                  idx === activeSlide
                    ? "w-6 bg-[#D8D5CD]"
                    : "w-2 bg-white/25 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
