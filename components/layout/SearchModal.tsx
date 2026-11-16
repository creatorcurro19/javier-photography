"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllPhotos, getAllProjects } from "@/lib/photos";
import { CATEGORY_METADATA } from "@/types/photo";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const normalized = query.trim().toLowerCase();

  const matchedProjects = useMemo(() => {
    if (!normalized) return allProjects.slice(0, 3);
    return allProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(normalized) ||
        p.subtitle.toLowerCase().includes(normalized) ||
        (p.location && p.location.toLowerCase().includes(normalized)) ||
        p.discipline.toLowerCase().includes(normalized)
    );
  }, [allProjects, normalized]);

  const matchedPhotos = useMemo(() => {
    if (!normalized) return allPhotos.slice(0, 6);
    return allPhotos
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
      .slice(0, 12);
  }, [allPhotos, normalized]);

  const navigateTo = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar obras o proyectos (Comando + K)"
        className="flex items-center gap-2 rounded-full border border-[#1D2021] bg-[#1D2021]/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#D8D5CD]/80 transition hover:border-[#95836B] hover:text-white"
      >
        <svg
          className="h-3.5 w-3.5 text-[#95836B]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <span className="hidden xl:inline">Buscar</span>
        <kbd className="hidden rounded border border-[#1D2021] bg-[#101112] px-1.5 py-0.5 text-[9px] text-[#95836B] sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Buscador de obras y proyectos"
          className="fixed inset-0 z-[70] flex items-start justify-center bg-[#101112]/85 px-4 pt-20 pb-10 backdrop-blur-xl"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#1D2021] bg-[#101112] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 border-b border-[#1D2021] px-5 py-4">
              <svg
                className="h-4 w-4 shrink-0 text-[#95836B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, lugar (Villanueva, Sahara, Canarias), especie (lince, lobo), focal (600mm)..."
                className="w-full bg-transparent text-sm text-[#D8D5CD] placeholder-[#D8D5CD]/40 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs text-[#95836B] hover:text-[#D8D5CD]"
                >
                  Limpiar
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-[#1D2021] px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white"
              >
                Esc
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-[#1D2021]/60 bg-[#1D2021]/20 px-5 py-2.5 text-[10px]">
              <span className="mr-1 uppercase tracking-wider text-[#95836B]">Sugerencias:</span>
              {["600mm", "Villanueva de la Vera", "Lince", "Lobo", "Dunas", "Rally", "Teide", "Marruecos"].map(
                (chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setQuery(chip)}
                    className="rounded-full border border-[#1D2021] bg-[#101112] px-2.5 py-0.5 text-[#D8D5CD]/80 transition hover:border-[#95836B] hover:text-white"
                  >
                    {chip}
                  </button>
                )
              )}
            </div>

            {/* Results */}
            <div className="max-h-[62vh] overflow-y-auto p-5 space-y-6">
              {matchedProjects.length > 0 && (
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#95836B]">
                    Proyectos Narrativos ({matchedProjects.length})
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {matchedProjects.map((proj) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => navigateTo(`/projects/${proj.slug}`)}
                        className="flex items-center gap-3 rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-2.5 text-left transition hover:border-[#95836B]/60 hover:bg-[#1D2021]/60"
                      >
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-[#1D2021]">
                          <Image
                            src={proj.coverImage}
                            alt={proj.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-serif text-base text-[#D8D5CD]">
                            {proj.title}
                          </p>
                          <p className="truncate text-[10px] uppercase tracking-wider text-[#95836B]">
                            {proj.location ?? proj.discipline}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#95836B]">
                  Obras en el Archivo ({matchedPhotos.length})
                </p>
                {matchedPhotos.length === 0 ? (
                  <p className="py-8 text-center text-sm text-neutral-400">
                    No se encontraron obras para «{query}».
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {matchedPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => navigateTo(`/portfolio/${photo.slug}`)}
                        className="flex items-center gap-3.5 rounded-lg border border-[#1D2021] bg-[#1D2021]/25 p-2.5 text-left transition hover:border-[#95836B]/60 hover:bg-[#1D2021]/60"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-[#1D2021]">
                          <Image
                            src={photo.image}
                            alt={photo.alt}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-base text-[#D8D5CD]">
                            {photo.title}
                          </p>
                          <p className="truncate text-[10px] uppercase tracking-wider text-[#95836B]">
                            {CATEGORY_METADATA[photo.category]?.title} · {photo.focalLength}
                          </p>
                          {photo.location && (
                            <p className="truncate text-[10px] text-neutral-400">
                              {photo.location}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
