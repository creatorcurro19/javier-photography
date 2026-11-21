"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AndalusianCenefa,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";

import {
  getAllPhotos,
  getPhotoBySlug,
  getPhotosByCategory,
  getAllProjects,
} from "@/lib/photos";
import { CATEGORY_METADATA, type PhotoCategory } from "@/types/photo";

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

const HERO_SLIDE_CONFIG: {
  id: string;
  slug: string;
  category: PhotoCategory;
  room: string;
  discipline: string;
  position: string;
}[] = [
  {
    id: "landscapes",
    slug: "ocaso-sobre-el-erg",
    category: "paisajes-documental",
    room: "SALA I",
    discipline: "TERRITORIO",
    position: "object-[center_42%]",
  },
  {
    id: "wildlife",
    slug: "mirada-del-lince-boreal",
    category: "fauna-naturaleza",
    room: "SALA II",
    discipline: "FAUNA Y NATURALEZA",
    position: "object-[center_30%]",
  },
  {
    id: "peaks",
    slug: "cumbre-nevada-al-alba",
    category: "paisajes-documental",
    room: "SALA III",
    discipline: "PAISAJE MINERAL",
    position: "object-[center_32%]",
  },
  {
    id: "motorsport",
    slug: "cruzada-sobre-el-asfalto",
    category: "coches-rally",
    room: "SALA IV",
    discipline: "AUTOMOVILISMO",
    position: "object-[center_45%]",
  },
  {
    id: "documentary",
    slug: "el-oficio-y-la-chispa",
    category: "viajes-cultura",
    room: "SALA V",
    discipline: "DOCUMENTAL",
    position: "object-[center_38%]",
  },
];

const HERO_SLIDES: HeroSlide[] = HERO_SLIDE_CONFIG.map((cfg, idx) => {
  const slot = idx + 1;
  const allPhotos = getAllPhotos();
  const customHeroWork = allPhotos.find((p) => p.heroOrder === slot);
  const catPhotos = getPhotosByCategory(cfg.category);
  const work =
    customHeroWork ??
    getPhotoBySlug(cfg.slug) ??
    catPhotos.find((p) => p.featured) ??
    catPhotos[0];
  const discipline = customHeroWork
    ? CATEGORY_METADATA[customHeroWork.category]?.code ?? cfg.discipline
    : cfg.discipline;
  return {
    ...cfg,
    discipline,
    slug: work?.slug ?? cfg.slug,
    title: work?.title ?? cfg.discipline,
    location: work?.location
      ? `${work.location}${work.country && !work.location.includes(work.country) ? ` · ${work.country}` : ""}`
      : "Archivo Fotográfico",
    image: work?.image ?? "/images/portfolio/hero/hero.jpg",
  };
});

const TOTAL_SERIES_COUNT = getAllProjects().length;

const DARK_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSclMjMxNTE2MTgnLz48L3N2Zz4=";

const SLIDE_DURATION = 6500;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const { t } = useLanguage();

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

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
      {/* Escenario fotográfico: en móvil con controles integrados directamente sobre la foto; en escritorio a pantalla completa */}
      <div
        className="relative mt-[71px] h-[48svh] min-h-[300px] w-full overflow-hidden md:mt-0 md:absolute md:inset-0 md:h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
                  placeholder="blur"
                  draggable={false}
                  blurDataURL={DARK_BLUR_DATA_URL}
                  sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
                  className={`object-cover ${slide.position} brightness-[0.94] contrast-[1.03] md:brightness-[0.88] select-none pointer-events-none`}
                />
              </div>
            </div>
          );
        })}

        {/* Degradado sutil solo en el borde inferior en móvil, y cinematográfico en el tercio inferior en escritorio */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#0B0C0E]/25 via-transparent to-[#0B0C0E]/90 md:from-[#0B0C0E]/55 md:via-[#0B0C0E]/15 md:via-45% md:to-[#0B0C0E]"
          aria-hidden="true"
        />
        {/* Segundo velo inferior suave en escritorio para garantizar lectura perfecta sin tapar la foto */}
        <div
          className="pointer-events-none hidden md:block absolute inset-x-0 bottom-0 z-10 h-[56%] bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/75 to-transparent"
          aria-hidden="true"
        />

        {/* Etiqueta discreta de sala en esquina superior (sin tapar el sujeto) */}
        <div className="absolute top-3.5 left-3.5 z-20 md:top-24 md:left-1/2 md:-translate-x-1/2">
          <div className="inline-flex items-center gap-2 border border-[#C5A880]/30 bg-[#0B0C0E]/75 px-3 py-1 backdrop-blur-md sm:px-4 sm:py-1.5">
            <AndalusianStarMark className="h-2.5 w-2.5 text-[#C5A880] sm:h-3 sm:w-3" />
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.36em] text-[#E5D3B3] whitespace-nowrap">
              {currentSlide.room} · {currentSlide.discipline}
            </p>
          </div>
        </div>

        {/* EN MÓVIL: Selector de portada y datos de la obra situados directamente sobre la fotografía */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-3 rounded-lg border border-[#C5A880]/30 bg-[#0B0C0E]/85 px-3.5 py-2 backdrop-blur-md md:hidden shadow-xl">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-xs font-light text-[#F7F4EE]">
              {currentSlide.title}
            </p>
            <p className="truncate font-mono text-[9px] text-[#C5A880] tracking-wider mt-0.5">
              {currentSlide.location}
            </p>
          </div>

          {/* Números táctiles para elegir la portada sobre la propia foto */}
          <div className="flex items-center gap-0.5 shrink-0" role="tablist" aria-label="Elegir portada">
            {HERO_SLIDES.map((slide, idx) => {
              const isSelected = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Ver portada 0${idx + 1}: ${slide.title}`}
                  className="flex min-h-[38px] min-w-[34px] items-center justify-center p-1 focus:outline-none"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-[11px] tracking-wider transition-colors duration-200 ${
                        isSelected ? "text-[#C5A880] font-bold" : "text-[#8E8A80]"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div
                      className={`mt-0.5 h-[2px] rounded-full transition-all duration-300 ${
                        isSelected ? "w-4 bg-[#C5A880]" : "w-1.5 bg-white/20"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
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

          {/* CTA Primario Único en Hero + Enlaces secundarios de exploración */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 md:mt-7">
            <Link
              href="/prints"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#C5A880] bg-[#C5A880] px-8 py-3.5 text-[11px] uppercase tracking-[0.24em] text-[#0B0C0E] font-semibold transition-all duration-300 hover:bg-white hover:border-white shadow-lg"
            >
              <span>{t("Encargar una copia Fine Art", "Order a Fine Art Print")}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Enlaces secundarios limpios */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[#A39E93]">
            <Link
              href="/portfolio"
              className="inline-flex min-h-[44px] items-center px-2 transition-colors hover:text-[#EBE7DF] hover:underline underline-offset-4"
            >
              {t("Explorar Obra", "Explore Works")} →
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/servicios"
              className="inline-flex min-h-[44px] items-center px-2 transition-colors hover:text-[#EBE7DF] hover:underline underline-offset-4"
            >
              {t("Encargos y Presupuestos", "Commissions & Quotes")} →
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/projects"
              className="inline-flex min-h-[44px] items-center px-2 transition-colors hover:text-[#EBE7DF] hover:underline underline-offset-4"
            >
              {t(`${TOTAL_SERIES_COUNT} Series`, `${TOTAL_SERIES_COUNT} Series`)} →
            </Link>
          </div>
        </div>

        {/* Barra de obra activa y selector de salas (visible en escritorio) */}
        <div className="hidden md:flex mt-8 items-center justify-between gap-4 border-t border-[#C5A880]/20 pt-5 md:mt-10">
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
