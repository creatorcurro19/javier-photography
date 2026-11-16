"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllPhotos, getAllProjects } from "@/lib/photos";
import { CATEGORY_METADATA, PhotoCategory } from "@/types/photo";

const QUICK_TAGS = [
  { label: "600mm Teleobjetivo", value: "600mm" },
  { label: "Villanueva de la Vera", value: "Villanueva de la Vera" },
  { label: "Lince Ibérico", value: "Lince" },
  { label: "Lobo Ibérico", value: "Lobo" },
  { label: "Sahara & Dunas", value: "Sahara" },
  { label: "Canarias & Teide", value: "Tenerife" },
  { label: "Rally & Velocidad", value: "Rally" },
  { label: "Marruecos", value: "Marruecos" },
];

const CATEGORIES: { id: "all" | PhotoCategory; label: string }[] = [
  { id: "all", label: "Todo el Archivo" },
  { id: "fauna-naturaleza", label: "Fauna & Naturaleza" },
  { id: "paisajes-documental", label: "Paisajes" },
  { id: "coches-rally", label: "Coches & Rally" },
  { id: "arquitectura-urbana", label: "Arquitectura" },
  { id: "viajes-cultura", label: "Documental" },
];

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | PhotoCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allPhotos = useMemo(() => getAllPhotos(), []);
  const allProjects = useMemo(() => getAllProjects(), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onOpenCustom = () => {
      setSelectedIndex(0);
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-visual-search", onOpenCustom);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-visual-search", onOpenCustom);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const normalized = query.trim().toLowerCase();

  const matchedProjects = useMemo(() => {
    if (!open) return [];
    if (!normalized && activeCategory === "all") return allProjects.slice(0, 4);
    if (!normalized && activeCategory !== "all") return [];
    return allProjects
      .filter(
        (p) =>
          p.title.toLowerCase().includes(normalized) ||
          p.subtitle.toLowerCase().includes(normalized) ||
          (p.location && p.location.toLowerCase().includes(normalized)) ||
          p.discipline.toLowerCase().includes(normalized)
      )
      .slice(0, 4);
  }, [allProjects, normalized, activeCategory, open]);

  const matchedPhotos = useMemo(() => {
    if (!open) return [];
    const byCat =
      activeCategory === "all"
        ? allPhotos
        : allPhotos.filter((p) => p.category === activeCategory);

    if (!normalized) return byCat.slice(0, 10);

    return byCat
      .filter((p) => {
        const catTitle = CATEGORY_METADATA[p.category]?.title ?? "";
        return (
          p.title.toLowerCase().includes(normalized) ||
          p.description.toLowerCase().includes(normalized) ||
          (p.location && p.location.toLowerCase().includes(normalized)) ||
          (p.country && p.country.toLowerCase().includes(normalized)) ||
          p.focalLength.toLowerCase().includes(normalized) ||
          p.camera.toLowerCase().includes(normalized) ||
          catTitle.toLowerCase().includes(normalized) ||
          p.keywords.some((k) => k.toLowerCase().includes(normalized))
        );
      })
      .slice(0, 16);
  }, [allPhotos, normalized, activeCategory, open]);

  const safeIndex =
    matchedPhotos.length > 0
      ? Math.min(selectedIndex, matchedPhotos.length - 1)
      : 0;
  const activePhoto = matchedPhotos[safeIndex] ?? allPhotos[0];

  const navigateTo = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  // Keyboard arrow navigation inside modal
  useEffect(() => {
    if (!open) return;
    const onArrowKey = (e: KeyboardEvent) => {
      if (matchedPhotos.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % matchedPhotos.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + matchedPhotos.length) % matchedPhotos.length
        );
      } else if (e.key === "Enter" && activePhoto) {
        // Only trigger if focus is in search input
        if (document.activeElement === inputRef.current) {
          e.preventDefault();
          navigateTo(`/portfolio/${activePhoto.slug}`);
        }
      }
    };
    window.addEventListener("keydown", onArrowKey);
    return () => window.removeEventListener("keydown", onArrowKey);
  });

  return (
    <>
      {/* Editorial Minimalist Search Trigger in Navbar */}
      <button
        type="button"
        onClick={() => {
          setSelectedIndex(0);
          setOpen(true);
        }}
        aria-label="Abrir buscador visual del archivo (Comando + K)"
        className="group relative flex items-center gap-2.5 border border-[#1D2021] bg-[#101112]/80 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[#D8D5CD]/80 transition-all duration-300 hover:border-[#95836B]/80 hover:bg-[#1D2021]/60 hover:text-white"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#95836B] transition-transform duration-300 group-hover:scale-125" />
        <span className="hidden sm:inline">Índice</span>
        <svg
          className="h-3.5 w-3.5 text-[#95836B] transition-transform duration-300 group-hover:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <kbd className="hidden border-l border-[#1D2021] pl-2 font-mono text-[9px] tracking-widest text-[#95836B] transition-colors group-hover:border-[#95836B]/40 group-hover:text-[#D8D5CD] md:inline">
          ⌘K
        </kbd>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Índice visual y buscador del archivo"
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0B0C0D]/92 px-4 pt-6 pb-8 backdrop-blur-2xl sm:px-8 sm:pt-12"
            onClick={() => setOpen(false)}
          >
            {/* Subtle Ambient Optical Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed top-0 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-[#95836B]/10 blur-[130px]"
            />

            <div
              className="relative w-full max-w-6xl overflow-hidden border border-[#1D2021] bg-[#101112] shadow-[0_35px_90px_rgba(0,0,0,0.85)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Telemetry Bar */}
              <div className="flex items-center justify-between border-b border-[#1D2021] bg-[#0D0E0F] px-6 py-2.5 text-[10px] uppercase tracking-[0.3em] text-[#95836B] font-mono">
                <div className="flex items-center gap-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#95836B]" />
                  <span>Archivo Fotográfico · Índice Óptico Interactivo</span>
                </div>
                <div className="hidden items-center gap-5 text-neutral-500 sm:flex">
                  <span>↑↓ Navegar</span>
                  <span>↵ Abrir Obra</span>
                  <span>ESC Cerrar</span>
                </div>
              </div>

              {/* Editorial Typographic Search Input */}
              <div className="relative flex items-center gap-4 border-b border-[#1D2021] px-6 py-5 sm:px-8 sm:py-6">
                <svg
                  className="h-5 w-5 shrink-0 text-[#95836B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.4}
                    d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Escribe un lugar, especie, óptica o concepto (ej. Villanueva, Lince, 600mm, Sahara)..."
                  className="w-full bg-transparent font-serif text-xl font-light tracking-wide text-[#D8D5CD] placeholder-[#D8D5CD]/30 focus:outline-none sm:text-3xl"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSelectedIndex(0);
                      inputRef.current?.focus();
                    }}
                    className="shrink-0 border border-[#1D2021] bg-[#1D2021]/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#95836B] transition hover:border-[#95836B] hover:text-white"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 border border-[#1D2021] px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-neutral-400 transition hover:border-[#D8D5CD] hover:text-white"
                >
                  Cerrar
                </button>
              </div>

              {/* Interactive Discipline Tabs + Optical Suggestion Chips */}
              <div className="flex flex-col justify-between gap-3 border-b border-[#1D2021] bg-[#141617]/60 px-4 py-3 sm:px-8 sm:py-3.5 lg:flex-row lg:items-center">
                {/* Category Filter Pills - Horizontally swipeable on mobile */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:py-0">
                  {CATEGORIES.map((cat) => {
                    const active = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setSelectedIndex(0);
                        }}
                        className={`shrink-0 px-3 py-1 text-[10px] uppercase tracking-[0.22em] transition-all ${
                          active
                            ? "border border-[#95836B] bg-[#95836B]/20 text-[#D8D5CD]"
                            : "border border-transparent text-neutral-400 hover:border-[#1D2021] hover:text-[#D8D5CD]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Atmospheric Tags - Horizontally swipeable on mobile */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:py-0">
                  <span className="shrink-0 mr-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#95836B]">
                    Atajos:
                  </span>
                  {QUICK_TAGS.map((tag) => {
                    const isSelected =
                      query.toLowerCase() === tag.value.toLowerCase();
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          setQuery(isSelected ? "" : tag.value);
                          setSelectedIndex(0);
                        }}
                        className={`shrink-0 border px-2.5 py-0.5 text-[10px] tracking-wider transition ${
                          isSelected
                            ? "border-[#D8D5CD] bg-[#D8D5CD] text-[#101112] font-medium"
                            : "border-[#1D2021] bg-[#101112] text-[#D8D5CD]/75 hover:border-[#95836B]/60 hover:text-white"
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Split-View Main Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Column: Indexed Results List */}
                <div className="max-h-[62vh] overflow-y-auto border-b border-[#1D2021] p-6 sm:px-8 lg:col-span-7 lg:border-r lg:border-b-0">
                  {/* Matched Projects Strip */}
                  {matchedProjects.length > 0 && (
                    <div className="mb-7">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#95836B]">
                          Series & Ensayos Documentales ({matchedProjects.length})
                        </p>
                        <button
                          type="button"
                          onClick={() => navigateTo("/projects")}
                          className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-[#D8D5CD]"
                        >
                          Ver las 8 series →
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {matchedProjects.map((proj) => (
                          <button
                            key={proj.id}
                            type="button"
                            onClick={() => navigateTo(`/projects/${proj.slug}`)}
                            className="group flex items-center gap-3.5 border border-[#1D2021] bg-[#141617]/50 p-2.5 text-left transition-all duration-200 hover:border-[#95836B]/70 hover:bg-[#1D2021]/60"
                          >
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-[#1D2021]">
                              <Image
                                src={proj.coverImage}
                                alt={proj.title}
                                fill
                                sizes="64px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-serif text-base text-[#D8D5CD] group-hover:text-white">
                                {proj.title}
                              </p>
                              <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-[#95836B]">
                                {proj.location ?? proj.discipline} ·{" "}
                                {proj.photoIds.length} obras
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Works Index */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#95836B]">
                        Obras en Catálogo ({matchedPhotos.length} mostradas)
                      </p>
                      <button
                        type="button"
                        onClick={() => navigateTo("/portfolio")}
                        className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-[#D8D5CD]"
                      >
                        Abrir Archivo Completo →
                      </button>
                    </div>

                    {matchedPhotos.length === 0 ? (
                      <div className="border border-[#1D2021] bg-[#141617]/30 py-14 text-center">
                        <p className="font-serif text-xl text-[#D8D5CD]">
                          Sin coincidencias para «{query}»
                        </p>
                        <p className="mt-2 text-xs text-neutral-400">
                          Prueba con una focal («600mm», «18mm»), localización («Sahara», «Tenerife») o disciplina.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#1D2021]/70 border border-[#1D2021]">
                        {matchedPhotos.map((photo, idx) => {
                          const isSelected = idx === safeIndex;
                          return (
                            <button
                              key={photo.id}
                              type="button"
                              onMouseEnter={() => setSelectedIndex(idx)}
                              onClick={() =>
                                navigateTo(`/portfolio/${photo.slug}`)
                              }
                              className={`group relative flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                                isSelected
                                  ? "bg-[#1D2021]/80 text-white"
                                  : "bg-[#101112] hover:bg-[#1D2021]/40"
                              }`}
                            >
                              {/* Active left bar */}
                              <span
                                className={`absolute inset-y-0 left-0 w-0.5 transition-opacity ${
                                  isSelected
                                    ? "bg-[#95836B] opacity-100"
                                    : "opacity-0"
                                }`}
                              />

                              <span className="w-6 shrink-0 font-mono text-[10px] text-[#95836B]/70">
                                {String(idx + 1).padStart(2, "0")}
                              </span>

                              <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-[#1D2021]">
                                <Image
                                  src={photo.image}
                                  alt={photo.alt}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate font-serif text-lg text-[#D8D5CD] group-hover:text-white">
                                  {photo.title}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-neutral-400">
                                  <span className="text-[#95836B]">
                                    {CATEGORY_METADATA[photo.category]?.title}
                                  </span>
                                  {photo.location && (
                                    <>
                                      <span>·</span>
                                      <span className="truncate">
                                        {photo.location}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                                <span className="border border-[#1D2021] bg-[#101112] px-2 py-0.5 font-mono text-[10px] text-[#95836B]">
                                  {photo.focalLength}
                                </span>
                                <span
                                  className={`text-xs transition-transform ${
                                    isSelected
                                      ? "translate-x-0.5 text-[#D8D5CD]"
                                      : "text-neutral-600"
                                  }`}
                                >
                                  →
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Live Curatorial Stage Preview */}
                <div className="hidden flex-col justify-between bg-[#0D0E0F] p-7 lg:col-span-5 lg:flex">
                  {activePhoto ? (
                    <>
                      <div>
                        <div className="flex items-center justify-between border-b border-[#1D2021] pb-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#95836B]">
                            Previsualización Óptica
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400">
                            {activePhoto.width} × {activePhoto.height} px
                          </span>
                        </div>

                        {/* Framed Preview Image */}
                        <div
                          onClick={() =>
                            navigateTo(`/portfolio/${activePhoto.slug}`)
                          }
                          className="group relative mt-5 flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden border border-[#1D2021] bg-[#101112] p-4"
                        >
                          <div className="relative h-full w-full">
                            <Image
                              src={activePhoto.image}
                              alt={activePhoto.alt}
                              fill
                              sizes="420px"
                              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                          {activePhoto.prints && (
                            <span className="absolute top-3 right-3 border border-[#95836B]/50 bg-[#101112]/90 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#D8D5CD]">
                              Edición Fine Art
                            </span>
                          )}
                        </div>

                        {/* Metadata & Editorial Caption */}
                        <div className="mt-5">
                          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#95836B]">
                            {CATEGORY_METADATA[activePhoto.category]?.title}
                            {activePhoto.location
                              ? ` · ${activePhoto.location}`
                              : ""}
                          </p>
                          <h3 className="mt-1.5 font-serif text-2xl font-light text-[#D8D5CD]">
                            {activePhoto.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#D8D5CD]/75 font-light">
                            {activePhoto.description}
                          </p>
                        </div>

                        {/* Live EXIF Telemetry Strip */}
                        <div className="mt-5 grid grid-cols-4 gap-2 border-y border-[#1D2021] py-3 font-mono text-[10px]">
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-neutral-500">
                              Focal
                            </span>
                            <span className="text-[#D8D5CD]">
                              {activePhoto.focalLength}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-neutral-500">
                              Apertura
                            </span>
                            <span className="text-[#D8D5CD]">
                              {activePhoto.aperture}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-neutral-500">
                              Obturación
                            </span>
                            <span className="text-[#D8D5CD]">
                              {activePhoto.shutter}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-neutral-500">
                              Sensibilidad
                            </span>
                            <span className="text-[#D8D5CD]">
                              ISO {activePhoto.iso}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="mt-6 flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigateTo(`/portfolio/${activePhoto.slug}`)
                          }
                          className="flex-1 border border-[#D8D5CD] bg-[#D8D5CD] px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold text-[#101112] transition hover:bg-transparent hover:text-white"
                        >
                          Abrir Obra ↵
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigateTo(
                              `/prints?obra=${encodeURIComponent(
                                activePhoto.title
                              )}`
                            )
                          }
                          className="border border-[#1D2021] bg-[#141617] px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#D8D5CD] transition hover:border-[#95836B]"
                        >
                          Fine Art
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
