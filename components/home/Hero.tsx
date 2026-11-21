"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AndalusianCenefa,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";

import { getPhotoBySlug } from "@/lib/photos";

interface HeroSlide {
  id: string;
  slug: string;
  room: string;
  discipline: string;
  title: string;
  location: string;
  image: string;
  position: string;
}

const HERO_SLIDE_CONFIG = [
  {
    id: "landscapes",
    slug: "ocaso-sobre-el-erg",
    room: "SALA I",
    discipline: "TERRITORIO",
    position: "object-[center_42%]",
  },
  {
    id: "wildlife",
    slug: "mirada-del-lince-boreal",
    room: "SALA II",
    discipline: "FAUNA Y NATURALEZA",
    position: "object-[center_30%]",
  },
  {
    id: "peaks",
    slug: "cumbre-nevada-al-alba",
    room: "SALA III",
    discipline: "PAISAJE MINERAL",
    position: "object-[center_32%]",
  },
  {
    id: "motorsport",
    slug: "cruzada-sobre-el-asfalto",
    room: "SALA IV",
    discipline: "AUTOMOVILISMO",
    position: "object-[center_45%]",
  },
  {
    id: "documentary",
    slug: "el-oficio-y-la-chispa",
    room: "SALA V",
    discipline: "DOCUMENTAL",
    position: "object-[center_38%]",
  },
] as const;

const HERO_SLIDES: HeroSlide[] = HERO_SLIDE_CONFIG.map((cfg) => {
  const work = getPhotoBySlug(cfg.slug);
  return {
    ...cfg,
    title: work?.title ?? cfg.slug,
    location: work?.location
      ? `${work.location}${work.country && !work.location.includes(work.country) ? ` · ${work.country}` : ""}`
      : "Archivo Fotográfico",
    image: work?.image ?? `/images/portfolio/paisajes-documental/${cfg.slug}.jpg`,
  };
});

const SLIDE_DURATION = 6500;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useLanguage();

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
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
        <div className="absolute top-4 left-4 z-20 md:top-24 md:left-1/2 md:-translate-x-1/2">
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
          <h1 className="font-sans text-2xl sm:text-4xl md:text-6xl font-light tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#F7F4EE] leading-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]">
            Javier Espinosa
            <span className="block mt-1.5 font-mono text-[10px] sm:text-xs md:text-sm font-normal tracking-[0.32em] text-[#C5A880] uppercase">
              {t("Fotografía de Autor en Tenerife", "Fine Art Photography in Tenerife")}
            </span>
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

          {/* Propuesta de Valor Concreta */}
          <p className="mx-auto mt-3.5 max-w-2xl text-xs sm:text-sm font-light tracking-wide text-[#EBE7DF]/90 leading-relaxed">
            {t(
              "Fotografía de naturaleza, paisaje, arquitectura, motor y vida cotidiana desde Tenerife. Me interesan los lugares con carácter, la huella del tiempo y los detalles que suelen pasar desapercibidos. Todas las imágenes están tomadas con luz natural y están disponibles como copia en papel de algodón Hahnemühle o para encargos y proyectos.",
              "Nature, landscape, architecture, motorsport, and documentary photography based in Tenerife. I am drawn to places with character, the trace of time, and the details that often go unnoticed. Every image is shot in natural light and available as a Hahnemühle cotton print or for editorial and commercial projects."
            )}
          </p>

          {/* Bio Breve de 2 Líneas con Enlace a /about */}
          <p className="mx-auto mt-2 max-w-xl text-[11px] sm:text-xs font-light text-[#8E8A80] leading-relaxed">
            {t(
              "Distintos temas —del silencio del bosque al ruido de un tramo o la sombra de una calle antigua—, unidos por una misma forma de mirar.",
              "Different subjects—from the quiet of the forest to a mountain rally stage or a shaded street—connected by the same way of looking."
            )}{" "}
            <Link
              href="/about"
              className="inline-flex min-h-[44px] items-center px-1 text-[#C5A880] underline underline-offset-4 hover:text-white transition whitespace-nowrap"
            >
              {t("Sobre mi trabajo →", "About my work →")}
            </Link>
          </p>

          {/* Jerarquía de CTAs: Principal "Encargar una copia", Secundario "Pedir presupuesto", Terciarios de exploración */}
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-7">
            <Link
              href="/prints"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#C5A880] bg-[#C5A880] px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[#0B0C0E] font-semibold transition-all duration-300 hover:bg-white hover:border-white shadow-lg"
            >
              <span>{t("Encargar una copia", "Order a Print")}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/servicios"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-white/30 bg-[#0B0C0E]/80 px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[#F7F4EE] font-medium transition-all duration-300 hover:border-[#C5A880] hover:text-white hover:bg-[#151618]"
            >
              <span>{t("Pedir presupuesto", "Request a Quote")}</span>
            </Link>
          </div>

          {/* Enlaces terciarios de exploración del archivo */}
          <div className="mt-3.5 flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-[#A39E93]">
            <Link
              href="/portfolio"
              className="inline-flex min-h-[44px] items-center px-2 transition-colors hover:text-[#EBE7DF] hover:underline underline-offset-4"
            >
              {t("Explorar Obras", "Explore Works")} →
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/projects"
              className="inline-flex min-h-[44px] items-center px-2 transition-colors hover:text-[#EBE7DF] hover:underline underline-offset-4"
            >
              {t("Series Monográficas", "Monograph Series")} →
            </Link>
          </div>
        </div>

        {/* Barra de obra activa y selector de salas */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#C5A880]/20 pt-5 sm:flex-row md:mt-10">
          <div className="text-center sm:text-left">
            <p className="font-serif text-sm sm:text-base font-light text-[#F7F4EE] tracking-wide">
              {currentSlide.title}
            </p>
            <p className="font-mono text-[10px] text-[#C5A880] tracking-wider mt-0.5">
              {currentSlide.location}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((slide, idx) => {
              const isSelected = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Entrar a ${slide.room}: ${slide.title}`}
                  className="group relative flex min-h-[44px] min-w-[44px] items-center justify-center py-2 px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A880]"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                        isSelected ? "text-[#F7F4EE] font-medium" : "text-[#A39E93] group-hover:text-[#EBE7DF]"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div
                      className={`mt-1.5 h-[2px] transition-all duration-500 rounded-full ${
                        isSelected
                          ? "w-7 sm:w-10 bg-[#C5A880]"
                          : "w-4 sm:w-5 bg-white/35 group-hover:bg-[#C5A880]/75"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <a
            href="#selected-work"
            className="hidden md:inline-flex min-h-[44px] items-center gap-2 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF]/90 transition hover:text-[#C5A880]"
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
