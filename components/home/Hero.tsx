"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

import {
  getAllPhotos,
  getPhotoBySlug,
  getPhotosByCategory,
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
    slug: "mar-de-dunas-al-ocaso",
    category: "paisajes-documental",
    room: "SALA I",
    discipline: "TERRITORIO",
    position: "object-[center_48%]",
  },
  {
    id: "peaks",
    slug: "cumbre-nevada-al-alba",
    category: "paisajes-documental",
    room: "SALA II",
    discipline: "PAISAJE MINERAL",
    position: "object-[center_36%]",
  },
  {
    id: "wildlife",
    slug: "mirada-del-lince-boreal",
    category: "fauna-naturaleza",
    room: "SALA III",
    discipline: "FAUNA Y NATURALEZA",
    position: "object-[center_30%]",
  },
  {
    id: "anaga-wildlife",
    slug: "cuervo-canario-ante-las-cumbres",
    category: "fauna-naturaleza",
    room: "SALA IV",
    discipline: "FAUNA Y TERRITORIO",
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
        className="relative mt-[64px] h-[62svh] min-h-[360px] w-full overflow-hidden md:mt-0 md:absolute md:inset-0 md:h-full"
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
                  sizes="100vw"
                  quality={90}
                  className={`object-cover ${slide.position} select-none pointer-events-none`}
                />
              </div>
            </div>
          );
        })}

        {/* Degradado sutil solo en el borde inferior para que la fotografía se vea limpia */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#0B0C0E]/20 via-transparent to-[#0B0C0E]/85 md:from-[#0B0C0E]/40 md:via-transparent md:to-[#0B0C0E]/95"
          aria-hidden="true"
        />
        {/* Segundo velo inferior compacto en escritorio */}
        <div
          className="pointer-events-none hidden md:block absolute inset-x-0 bottom-0 z-10 h-[38%] bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/65 to-transparent"
          aria-hidden="true"
        />

        {/* EN MÓVIL: Selector de portada y datos de la obra situados directamente sobre la fotografía */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-3 rounded-lg border border-[#C5A880]/30 bg-[#0B0C0E]/85 px-3.5 py-2 backdrop-blur-md md:hidden shadow-xl">
          <Link href={`/portfolio/${currentSlide.slug}`} className="min-w-0 flex-1 group/title">
            <p className="truncate font-serif text-xs font-light text-[#F7F4EE] group-hover/title:text-[#C5A880] transition-colors">
              {currentSlide.title}
            </p>
            <p className="truncate font-mono text-[9px] text-[#C5A880] tracking-wider mt-0.5">
              {currentSlide.location}
            </p>
          </Link>

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

      {/* Bloque Minimalista: Título claro y 2 botones directos (textos largos ocultos sin eliminar) */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-5 pt-6 pb-10 text-center text-[#F7F4EE] sm:px-8 md:pt-0 md:pb-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-sans text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#F7F4EE] leading-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]">
            Javier Espinosa
            <span className="block mt-1.5 font-mono text-[11px] sm:text-xs font-normal tracking-[0.26em] text-[#C5A880] uppercase">
              {t("Fotografía en Tenerife · Naturaleza, paisaje y motor", "Photography in Tenerife · Wildlife, landscape & motorsport")}
            </span>
          </h1>

          {/* 2 Botones Grandes y Claros: Ver Fotos / Comprar Láminas */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/portfolio"
              className="w-full sm:w-auto group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[#C5A880] bg-[#C5A880] px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition-all duration-300 hover:bg-white hover:border-white shadow-lg"
            >
              <span>{t("Ver todas las fotos", "View all photos")}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/prints"
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-white/25 bg-[#0B0C0E]/80 px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-[#F7F4EE] font-medium backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              <span>{t("Comprar láminas", "Buy prints")}</span>
            </Link>
          </div>
        </div>

        {/* Barra de obra activa y selector de portada en escritorio */}
        <div className="hidden md:flex mt-6 items-center justify-between gap-4 border-t border-white/15 pt-4">
          <Link
            href={`/portfolio/${currentSlide.slug}`}
            className="text-center sm:text-left group/title"
          >
            <p className="font-serif text-sm sm:text-base font-light text-[#F7F4EE] tracking-wide group-hover/title:text-[#C5A880] transition-colors">
              {currentSlide.title}
            </p>
            <p className="font-mono text-[10px] text-[#C5A880] tracking-wider mt-0.5">
              {currentSlide.location}
            </p>
          </Link>

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
            href="#colecciones"
            className="hidden md:inline-flex min-h-[44px] items-center gap-2 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF]/90 transition hover:text-[#C5A880]"
          >
            <span>Descubrir</span>
            <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
