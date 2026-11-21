"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import PrintCardAction from "@/components/cart/PrintCardAction";

const LightboxModal = dynamic(() => import("@/components/ui/LightboxModal"), {
  ssr: false,
});
const ZenGalleryModal = dynamic(
  () => import("@/components/portfolio/ZenGalleryModal"),
  { ssr: false }
);

const DARK_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSclMjMxNTE2MTgnLz48L3N2Zz4=";

type ExhibitionGalleryProps = {
  photos: Photo[];
  showMeta?: boolean;
};

type ViewMode = "masonry" | "immersive" | "grid" | "archive";
type FilterMode = "all" | "vertical" | "horizontal" | "telephoto" | "prints";
type PaletteMode = "all" | "ochre" | "green" | "dark" | "earth";

const PALETTES = [
  { id: "all", label: "Toda la Paleta", color: null },
  { id: "ochre", label: "Ocres & Calima", color: "bg-[#D4A373]" },
  { id: "green", label: "Verde Profundo", color: "bg-[#4F772D]" },
  { id: "dark", label: "Carbón & Asfalto", color: "bg-[#2B2D42]" },
  { id: "earth", label: "Tierra & Granito", color: "bg-[#8D6E63]" },
] as const;

const INITIAL_BATCH = 24;

export default function ExhibitionGallery({
  photos,
  showMeta = true,
}: ExhibitionGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zenOpen, setZenOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);

  const filteredPhotos = photos.filter((photo) => {
    if (filterMode === "vertical" && photo.height <= photo.width) return false;
    if (filterMode === "horizontal" && photo.width <= photo.height) return false;
    if (filterMode === "telephoto") {
      const mm = parseInt(photo.focalLength, 10);
      if (Number.isNaN(mm) || mm < 150) return false;
    }
    if (filterMode === "prints" && !photo.prints) return false;

    if (paletteMode !== "all") {
      const text = `${photo.category} ${photo.title} ${photo.location ?? ""} ${photo.keywords.join(" ")}`.toLowerCase();
      if (paletteMode === "ochre") {
        return (
          text.includes("paisajes") ||
          text.includes("sahara") ||
          text.includes("duna") ||
          text.includes("marruecos") ||
          text.includes("teide") ||
          text.includes("dorad")
        );
      }
      if (paletteMode === "green") {
        return (
          text.includes("fauna") ||
          text.includes("lince") ||
          text.includes("bosque") ||
          text.includes("ave") ||
          text.includes("verde") ||
          text.includes("gomera")
        );
      }
      if (paletteMode === "dark") {
        return (
          text.includes("rally") ||
          text.includes("coche") ||
          text.includes("asfalto") ||
          text.includes("nocturn") ||
          text.includes("velocidad")
        );
      }
      if (paletteMode === "earth") {
        return (
          text.includes("vera") ||
          text.includes("caceres") ||
          text.includes("arquitectura") ||
          text.includes("pueblo") ||
          text.includes("oficio") ||
          text.includes("tradicion") ||
          text.includes("piedra")
        );
      }
    }

    return true;
  });

  const visiblePhotos =
    viewMode === "archive"
      ? filteredPhotos
      : filteredPhotos.slice(0, visibleCount);

  if (photos.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-xl text-[#8E8A80]">
          No hay fotografías en esta selección en este momento.
        </p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Gallery Filter & View Controls */}
      <div className="mb-10 flex flex-col gap-4 border-b border-white/[0.08] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap text-[11px] uppercase tracking-wider">
          <span className="shrink-0 mr-1 font-mono text-xs text-[#8E8A80]">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? "foto" : "fotos"}
          </span>
          {photos.length > 4 && (
            <>
              <span className="hidden sm:inline text-white/20">|</span>
              {(
                [
                  { id: "all", label: "Todas" },
                  { id: "vertical", label: "Vertical" },
                  { id: "horizontal", label: "Horizontal" },
                  { id: "telephoto", label: "Tele ≥150mm" },
                  { id: "prints", label: "Fine Art" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilterMode(item.id);
                    setSelectedIndex(0);
                    setVisibleCount(INITIAL_BATCH);
                  }}
                  className={`shrink-0 inline-flex min-h-[44px] items-center rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider transition ${
                    filterMode === item.id
                      ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                      : "border border-white/[0.12] bg-[#151618] text-[#A39E93] hover:border-white/30 hover:text-[#EBE7DF]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[#A39E93] overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 shrink-0">
          <span className="hidden sm:inline mr-2 text-[#A39E93]">Presentación:</span>
          <button
            type="button"
            onClick={() => setViewMode("masonry")}
            className={`inline-flex min-h-[44px] items-center rounded px-3 py-2 transition ${
              viewMode === "masonry"
                ? "bg-white/[0.12] text-[#EBE7DF] font-medium"
                : "hover:text-[#EBE7DF]"
            }`}
          >
            Editorial
          </button>
          <span className="text-white/25">·</span>
          <button
            type="button"
            onClick={() => setViewMode("immersive")}
            className={`inline-flex min-h-[44px] items-center rounded px-3 py-2 transition ${
              viewMode === "immersive"
                ? "bg-white/[0.12] text-[#EBE7DF] font-medium"
                : "hover:text-[#EBE7DF]"
            }`}
          >
            Inmersiva
          </button>
          <span className="text-white/25">·</span>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex min-h-[44px] items-center rounded px-3 py-2 transition ${
              viewMode === "grid"
                ? "bg-white/[0.12] text-[#EBE7DF] font-medium"
                : "hover:text-[#EBE7DF]"
            }`}
          >
            Índice
          </button>
          <span className="text-white/25">·</span>
          <button
            type="button"
            onClick={() => setViewMode("archive")}
            className={`inline-flex min-h-[44px] items-center rounded px-3 py-2 transition ${
              viewMode === "archive"
                ? "bg-white/[0.12] text-[#EBE7DF] font-medium"
                : "hover:text-[#EBE7DF]"
            }`}
          >
            Archivo
          </button>
          <span className="text-white/25">|</span>
          <button
            type="button"
            onClick={() => setZenOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-white/20 bg-white/[0.05] px-3 py-2 text-[#EBE7DF] transition hover:border-white/40 hover:bg-white/[0.1]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EBE7DF]" />
            <span>Pase Zen</span>
          </button>
        </div>
      </div>

      {/* Selector de Armonía Cromática para Interiorismo */}
      {photos.length > 6 && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/[0.08] bg-[#151618] px-4 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
              Armonía Cromática:
            </span>
            {PALETTES.map((pal) => {
              const active = paletteMode === pal.id;
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => {
                    setPaletteMode(pal.id);
                    setSelectedIndex(0);
                    setVisibleCount(INITIAL_BATCH);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                    active
                      ? "border-white/40 bg-white/[0.1] text-[#EBE7DF]"
                      : "border-transparent text-[#8E8A80] hover:border-white/[0.1] hover:text-[#EBE7DF]"
                  }`}
                >
                  {pal.color && (
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${pal.color}`}
                    />
                  )}
                  <span>{pal.label}</span>
                </button>
              );
            })}
          </div>

          {paletteMode !== "all" && (
            <button
              type="button"
              onClick={() => setPaletteMode("all")}
              className="shrink-0 font-mono text-[10px] text-[#8E8A80] hover:text-white"
            >
              Restablecer paleta ×
            </button>
          )}
        </div>
      )}

      {viewMode === "archive" ? (
        /* Vista de Tabla Técnica de Archivo Museístico */
        <div className="overflow-x-auto rounded border border-white/[0.08] bg-[#151618]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-[#0B0C0E]/90 text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E8A80]">
              <tr>
                <th className="py-3.5 px-4">Obra</th>
                <th className="py-3.5 px-4">Título</th>
                <th className="hidden md:table-cell py-3.5 px-4">Localización</th>
                <th className="hidden sm:table-cell py-3.5 px-4">Óptica & EXIF</th>
                <th className="py-3.5 px-4 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredPhotos.map((photo, index) => (
                <tr
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="cursor-pointer transition hover:bg-white/[0.04]"
                >
                  <td className="py-2.5 px-4 w-16">
                    <div className="relative h-10 w-14 overflow-hidden rounded bg-[#0B0C0E]">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-serif text-base text-[#EBE7DF]">
                    {photo.title}
                    {photo.prints && (
                      <span className="ml-2 rounded border border-white/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#8E8A80]">
                        Fine Art
                      </span>
                    )}
                  </td>
                  <td className="hidden md:table-cell py-2.5 px-4 text-[#8E8A80]">
                    {photo.location ?? "España / Archivo"}
                  </td>
                  <td className="hidden sm:table-cell py-2.5 px-4 text-[#8E8A80] font-mono text-[11px]">
                    {photo.focalLength} · {photo.aperture} · {photo.shutter} · ISO {photo.iso}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-[11px] uppercase tracking-wider text-[#EBE7DF] hover:underline hover:underline-offset-4"
                    >
                      Abrir →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Rendering by ViewMode:
           Respetamos la proporción original de cada fotografía:
           las verticales se muestran completas y las horizontales sin franjas vacías. */
        <div
          className={
            viewMode === "masonry"
              ? "columns-1 gap-8 sm:columns-2 lg:columns-3"
              : viewMode === "immersive"
              ? "mx-auto flex max-w-5xl flex-col items-center gap-24"
              : "columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5"
          }
        >
          {visiblePhotos.map((photo, index) => {
            return (
              <figure
                key={photo.id}
                className={`group overflow-hidden border border-white/[0.08] bg-[#151618] transition-all duration-500 hover:border-white/30 ${
                  viewMode === "masonry"
                    ? "mb-10 break-inside-avoid"
                    : viewMode === "grid"
                    ? "mb-4 break-inside-avoid"
                    : "w-fit max-w-full"
                }`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver ${photo.title} a pantalla completa`}
                  onClick={() => openLightbox(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(index);
                    }
                  }}
                  className="relative cursor-pointer overflow-hidden bg-[#0B0C0E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    placeholder="blur"
                    blurDataURL={DARK_BLUR_DATA_URL}
                    sizes={
                      viewMode === "immersive"
                        ? "(max-width: 1024px) 100vw, 1120px"
                        : viewMode === "grid"
                        ? "(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 260px"
                        : "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 420px"
                    }
                    loading="lazy"
                    className={`transition-transform duration-700 ease-out group-hover:scale-[1.02] brightness-[0.92] group-hover:brightness-100 ${
                      viewMode === "immersive"
                        ? "h-auto max-h-[85vh] w-auto max-w-full"
                        : "h-auto w-full"
                    }`}
                  />

                  {/* Subtle Hover Overlay with Action Pill */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/80 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#EBE7DF] shadow-lg backdrop-blur-md font-mono">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                      Ampliar Obra
                    </span>
                  </div>
                </div>

                {showMeta && viewMode !== "grid" && (
                  <figcaption className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-[#151618] px-5 py-3.5">
                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-base font-light text-[#EBE7DF] group-hover:text-white transition-colors">
                        <Link
                          href={`/portfolio/${photo.slug}`}
                          className="hover:underline underline-offset-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {photo.title}
                        </Link>
                      </h3>
                      <Link
                        href={`/portfolio/${photo.slug}`}
                        className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E8A80] hover:text-[#EBE7DF] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {photo.location ? `${photo.location.split(",")[0]} · ` : ""}{photo.focalLength} · Ficha →
                      </Link>
                    </div>

                    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                      <PrintCardAction photo={photo} />
                    </div>
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}

      {/* Paginación progresiva para carga instantánea en colecciones grandes */}
      {viewMode !== "archive" && filteredPhotos.length > visibleCount && (
        <div className="mt-14 flex flex-col items-center justify-center gap-3">
          <p className="font-mono text-xs text-[#8E8A80]">
            Mostrando {visiblePhotos.length} de {filteredPhotos.length} fotografías
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_BATCH)}
              className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3 text-xs uppercase font-mono tracking-[0.26em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              Cargar 24 obras más
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filteredPhotos.length)}
              className="border border-white/20 bg-white/[0.05] px-6 py-3 text-xs uppercase font-mono tracking-[0.24em] text-[#EBE7DF] transition-all duration-300 hover:border-white/40 hover:text-white"
            >
              Ver las {filteredPhotos.length} obras
            </button>
          </div>
        </div>
      )}

      <LightboxModal
        photos={filteredPhotos}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setSelectedIndex(newIndex)}
      />

      <ZenGalleryModal
        photos={filteredPhotos}
        initialIndex={selectedIndex}
        open={zenOpen}
        onClose={() => setZenOpen(false)}
      />
    </>
  );
}
