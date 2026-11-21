"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllPhotos, getAllProjects } from "@/lib/photos";
import { CATEGORY_METADATA, PhotoCategory } from "@/types/photo";
import { AndalusianMicroCenefa } from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";

const COLLECTIONS: { id: PhotoCategory; label: string; subtitle: string }[] = [
  { id: "paisajes-documental", label: "Paisajes", subtitle: "Territorio y naturaleza" },
  { id: "fauna-naturaleza", label: "Fauna & Naturaleza", subtitle: "Vida salvaje en libertad" },
  { id: "coches-rally", label: "Coches & Rally", subtitle: "Automovilismo clásico" },
  { id: "arquitectura-urbana", label: "Arquitectura", subtitle: "Patrimonio y geometría" },
  { id: "viajes-cultura", label: "Documental", subtitle: "Oficios y cultura" },
];

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

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
    const onOpenCustom = () => setOpen(true);

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
    if (!open || !normalized) return [];
    return allProjects
      .filter(
        (p) =>
          p.title.toLowerCase().includes(normalized) ||
          p.subtitle.toLowerCase().includes(normalized) ||
          (p.location && p.location.toLowerCase().includes(normalized)) ||
          p.discipline.toLowerCase().includes(normalized)
      )
      .slice(0, 3);
  }, [allProjects, normalized, open]);

  const matchedPhotos = useMemo(() => {
    if (!open || !normalized) return [];
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
      .slice(0, 8);
  }, [allPhotos, normalized, open]);

  const navigateTo = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const hasResults = matchedProjects.length > 0 || matchedPhotos.length > 0;

  return (
    <>
      {/* Botón limpio de búsqueda en la barra de navegación */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar fotografías o colecciones"
        className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 border border-white/[0.12] bg-[#151618] px-3 py-2 text-[#EBE7DF] transition hover:border-white/30 hover:bg-[#202226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A880]"
      >
        <svg
          className="h-4 w-4 text-[#EBE7DF] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF]">
          {t("Buscar", "Search")}
        </span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar en el archivo fotográfico"
            className="fixed inset-0 z-[100] flex items-start justify-center bg-[#0B0C0E]/85 px-4 pt-14 pb-8 backdrop-blur-xl sm:pt-24"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-xl overflow-hidden border border-[#C5A880]/25 bg-[#0B0C0E] shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Campo de búsqueda único y sereno */}
              <div className="flex items-center gap-3.5 px-5 py-4 sm:px-6 sm:py-5">
                <svg
                  className="h-5 w-5 shrink-0 text-[#8E8A80]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && matchedPhotos.length > 0) {
                      e.preventDefault();
                      navigateTo(`/portfolio/${matchedPhotos[0].slug}`);
                    }
                  }}
                  placeholder={t(
                    "Buscar obras, lugares o colecciones...",
                    "Search artworks, places or collections..."
                  )}
                  className="w-full bg-transparent font-serif text-lg font-light text-[#EBE7DF] placeholder-[#8E8A80]/60 focus:outline-none sm:text-xl"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Limpiar búsqueda"
                    className="shrink-0 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[#8E8A80] transition hover:text-white"
                  >
                    Borrar
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar buscador"
                  className="shrink-0 p-1.5 text-[#8E8A80] transition hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <AndalusianMicroCenefa className="text-[#C5A880]/35" />

              {/* Contenido: Colecciones directas o Resultados limpios */}
              <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6">
                {!normalized ? (
                  <div>
                    <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
                      Explorar por Colección
                    </p>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {COLLECTIONS.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => navigateTo(`/portfolio/${col.id}`)}
                          className="group flex items-center justify-between border border-white/[0.06] bg-[#151618]/60 px-4 py-3 text-left transition hover:border-white/25 hover:bg-[#151618]"
                        >
                          <div>
                            <p className="font-serif text-base font-light text-[#EBE7DF] group-hover:text-white">
                              {col.label}
                            </p>
                            <p className="text-[11px] font-light text-[#8E8A80]">
                              {col.subtitle}
                            </p>
                          </div>
                          <span className="text-xs text-[#8E8A80] transition-transform group-hover:translate-x-0.5 group-hover:text-[#EBE7DF]">
                            →
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 px-2">
                      <button
                        type="button"
                        onClick={() => navigateTo("/portfolio")}
                        className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8E8A80] transition hover:text-[#EBE7DF]"
                      >
                        {t("Ver todo el catálogo →", "View full archive →")}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateTo("/prints")}
                        className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8E8A80] transition hover:text-[#EBE7DF]"
                      >
                        {t("Copias de Autor →", "Fine Art Prints →")}
                      </button>
                    </div>
                  </div>
                ) : !hasResults ? (
                  <div className="py-12 text-center">
                    <p className="font-serif text-lg font-light text-[#EBE7DF]">
                      No encontramos resultados para «{query}»
                    </p>
                    <p className="mt-1.5 text-xs font-light text-[#8E8A80]">
                      Prueba con un lugar o tema, como «Lince», «Sahara», «Tenerife» o «Rally».
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Series coincidentes */}
                    {matchedProjects.length > 0 && (
                      <div>
                        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
                          Series
                        </p>
                        <div className="space-y-1">
                          {matchedProjects.map((proj) => (
                            <button
                              key={proj.id}
                              type="button"
                              onClick={() => navigateTo(`/projects/${proj.slug}`)}
                              className="group flex w-full items-center gap-3.5 px-2 py-2 text-left transition hover:bg-[#151618]"
                            >
                              <div className="relative h-10 w-14 shrink-0 overflow-hidden bg-[#151618]">
                                <Image
                                  src={proj.coverImage}
                                  alt={proj.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-serif text-base font-light text-[#EBE7DF] group-hover:text-white">
                                  {proj.title}
                                </p>
                                <p className="truncate text-[11px] text-[#8E8A80]">
                                  Serie · {proj.location ?? proj.discipline}
                                </p>
                              </div>
                              <span className="text-xs text-[#8E8A80] group-hover:text-[#EBE7DF]">
                                →
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Obras coincidentes */}
                    {matchedPhotos.length > 0 && (
                      <div>
                        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
                          Fotografías
                        </p>
                        <div className="space-y-1">
                          {matchedPhotos.map((photo) => (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => navigateTo(`/portfolio/${photo.slug}`)}
                              className="group flex w-full items-center gap-3.5 px-2 py-2 text-left transition hover:bg-[#151618]"
                            >
                              <div className="relative h-11 w-14 shrink-0 overflow-hidden bg-[#151618]">
                                <Image
                                  src={photo.image}
                                  alt={photo.alt}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-serif text-base font-light text-[#EBE7DF] group-hover:text-white">
                                  {photo.title}
                                </p>
                                <p className="truncate text-[11px] text-[#8E8A80]">
                                  {CATEGORY_METADATA[photo.category]?.title}
                                  {photo.location ? ` · ${photo.location}` : ""}
                                </p>
                              </div>
                              <span className="text-xs text-[#8E8A80] group-hover:text-[#EBE7DF]">
                                →
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
