"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import CategoryNav from "@/components/portfolio/CategoryNav";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import { CATEGORY_METADATA, type Photo, type PhotoCategory } from "@/types/photo";

function subscribeToSearchQuery(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("je-search-query-change", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("je-search-query-change", callback);
  };
}

function getSearchQuerySnapshot() {
  return new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
}

function getServerSearchQuerySnapshot() {
  return "";
}

interface CategoryBucket {
  category: PhotoCategory;
  photos: Photo[];
}

interface PortfolioPageContentProps {
  photos: Photo[];
  buckets: CategoryBucket[];
}

export default function PortfolioPageContent({
  photos,
  buckets,
}: PortfolioPageContentProps) {
  const { lang, t } = useLanguage();
  const searchQuery = useSyncExternalStore(
    subscribeToSearchQuery,
    getSearchQuerySnapshot,
    getServerSearchQuerySnapshot
  );

  const displayedPhotos = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return photos;
    return photos.filter((raw) => {
      const p = getLocalizedPhoto(raw, lang);
      const haystack = [
        p.title,
        p.description,
        p.alt,
        p.location,
        p.country,
        p.category,
        ...(p.keywords ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [photos, searchQuery, lang]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-28 pb-24 text-[#EBE7DF]">
      <Container className="relative z-10">
        <header className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C5A880]">
            {t("Galería Fotográfica", "Photography Gallery")} · {photos.length}{" "}
            {t("fotos", "photos")}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#EBE7DF]">
            {t("Todas las Fotos", "All Photos")}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            {t(
              "Elige un tema arriba, busca por lugar o especie, o toca cualquier foto para abrir su ficha completa.",
              "Choose a theme below, search by place or subject, or select any photograph to open its full sheet."
            )}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C5A880]/75"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  const url = new URL(window.location.href);
                  if (val.trim()) {
                    url.searchParams.set("q", val);
                  } else {
                    url.searchParams.delete("q");
                  }
                  window.history.replaceState(null, "", url.pathname + url.search);
                  window.dispatchEvent(new Event("je-search-query-change"));
                }}
                aria-label={t(
                  "Buscar fotografías por título, lugar o etiqueta",
                  "Search photographs by title, location, or keyword"
                )}
                placeholder={t(
                  "Buscar por lugar, especie o equipo (ej. Tenerife, Teide, 600mm, Rally…)",
                  "Search by location, subject, or lens (e.g. Tenerife, Wildlife, 600mm, Rally…)"
                )}
                className="w-full rounded-xl border border-white/[0.12] bg-[#151618] py-2.5 pl-10 pr-20 font-sans text-sm text-[#EBE7DF] placeholder-[#7C7870] transition focus:border-[#C5A880] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    window.history.replaceState(null, "", window.location.pathname);
                    window.dispatchEvent(new Event("je-search-query-change"));
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-white/15 bg-[#0B0C0E] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#C5A880] hover:border-[#C5A880] hover:text-white transition cursor-pointer"
                >
                  {t("Limpiar", "Clear")}
                </button>
              )}
            </div>
            {searchQuery && (
              <span className="shrink-0 font-mono text-xs text-[#A39E93]">
                {displayedPhotos.length}{" "}
                {displayedPhotos.length === 1
                  ? t("resultado", "result")
                  : t("resultados", "results")}
              </span>
            )}
          </div>
        </header>

        <div className="mt-6">
          <CategoryNav />
        </div>

        <div className="mt-8">
          <ExhibitionGallery photos={displayedPhotos} />
        </div>

        {/* Índice Curatorial Completo de las Obras (oculto visualmente con sr-only para conservar SEO SSR al 100%) */}
        <section
          aria-label={t(
            "Índice completo del archivo catalogado",
            "Complete index of the cataloged archive"
          )}
          className="sr-only"
        >
          <details className="group">
            <summary className="flex cursor-pointer list-none flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
                  {t(
                    `Archivo Fotográfico Completo (${photos.length} Obras)`,
                    `Complete Photographic Archive (${photos.length} Works)`
                  )}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-light text-[#EBE7DF]">
                  {t(
                    "Índice Completo del Archivo por Disciplina",
                    "Complete Archive Index by Discipline"
                  )}
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 border border-white/15 bg-[#0B0C0E] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF] transition group-hover:border-[#C5A880]">
                <span>
                  {t(
                    `Desplegar catálogo (${photos.length} obras)`,
                    `Expand catalog (${photos.length} works)`
                  )}
                </span>
                <span className="transition group-open:rotate-45">+</span>
              </span>
            </summary>

            <div className="mt-8 grid grid-cols-1 gap-10 border-t border-white/[0.08] pt-8 md:grid-cols-2 lg:grid-cols-3">
              {buckets.map(({ category, photos: catPhotos }) => {
                const info = CATEGORY_METADATA[category];
                return (
                  <div key={category} className="space-y-3">
                    <div className="border-b border-white/[0.08] pb-2">
                      <Link
                        href={`/portfolio/${category}`}
                        className="font-serif text-lg font-light text-[#EBE7DF] hover:text-[#C5A880] transition"
                      >
                        {lang === "en" ? info.titleEn : info.title} ({catPhotos.length})
                      </Link>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8E8A80]">
                        {lang === "en" ? info.title : info.titleEn}
                      </p>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {catPhotos.map((raw) => {
                        const p = getLocalizedPhoto(raw, lang);
                        return (
                          <li key={p.id} className="flex items-baseline justify-between gap-2">
                            <Link
                              href={`/portfolio/${p.slug}`}
                              className="truncate text-[#8E8A80] hover:text-[#EBE7DF] transition"
                            >
                              {p.title}
                            </Link>
                            <span className="shrink-0 font-mono text-[10px] text-[#8E8A80]/60">
                              {p.location?.split(",")[0]} · {p.focalLength}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </details>
        </section>
      </Container>
    </div>
  );
}
