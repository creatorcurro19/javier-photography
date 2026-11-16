"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import LightboxModal from "@/components/ui/LightboxModal";
import ZenGalleryModal from "@/components/portfolio/ZenGalleryModal";

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
        <p className="font-serif text-xl text-neutral-400">
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
      <div className="mb-10 flex flex-col gap-4 border-b border-[#1D2021] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider">
          <span className="mr-2 font-mono text-xs text-[#95836B]">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? "fotografía" : "fotografías"}
          </span>
          {photos.length > 4 && (
            <>
              <span className="text-neutral-700">|</span>
              {(
                [
                  { id: "all", label: "Todas" },
                  { id: "vertical", label: "Vertical" },
                  { id: "horizontal", label: "Horizontal" },
                  { id: "telephoto", label: "Teleobjetivo ≥150mm" },
                  { id: "prints", label: "Edición Fine Art" },
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
                  className={`rounded-full px-3 py-1 transition ${
                    filterMode === item.id
                      ? "bg-[#D8D5CD] text-[#101112] font-medium"
                      : "border border-[#1D2021] bg-[#1D2021]/40 text-neutral-400 hover:border-[#95836B]/60 hover:text-[#D8D5CD]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400 shrink-0">
          <span className="hidden sm:inline mr-2 text-neutral-500">Presentación:</span>
          <button
            type="button"
            onClick={() => setViewMode("masonry")}
            className={`rounded px-2.5 py-1 transition ${
              viewMode === "masonry"
                ? "bg-[#1D2021] text-[#D8D5CD] font-medium"
                : "hover:text-[#D8D5CD]"
            }`}
          >
            Editorial
          </button>
          <span className="text-neutral-700">·</span>
          <button
            type="button"
            onClick={() => setViewMode("immersive")}
            className={`rounded px-2.5 py-1 transition ${
              viewMode === "immersive"
                ? "bg-[#1D2021] text-[#D8D5CD] font-medium"
                : "hover:text-[#D8D5CD]"
            }`}
          >
            Inmersiva
          </button>
          <span className="text-neutral-700">·</span>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded px-2.5 py-1 transition ${
              viewMode === "grid"
                ? "bg-[#1D2021] text-[#D8D5CD] font-medium"
                : "hover:text-[#D8D5CD]"
            }`}
          >
            Índice
          </button>
          <span className="text-neutral-700">·</span>
          <button
            type="button"
            onClick={() => setViewMode("archive")}
            className={`rounded px-2.5 py-1 transition ${
              viewMode === "archive"
                ? "bg-[#1D2021] text-[#D8D5CD] font-medium"
                : "hover:text-[#D8D5CD]"
            }`}
          >
            Archivo
          </button>
          <span className="text-neutral-700">|</span>
          <button
            type="button"
            onClick={() => setZenOpen(true)}
            className="flex items-center gap-1.5 rounded border border-[#95836B]/60 bg-[#95836B]/15 px-2.5 py-1 text-[#D8D5CD] transition hover:border-[#95836B] hover:bg-[#95836B]/30"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#95836B]" />
            <span>Pase Zen</span>
          </button>
        </div>
      </div>

      {/* Selector de Armonía Cromática para Interiorismo */}
      {photos.length > 6 && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-[#1D2021] bg-[#141617]/50 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
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
                  className={`flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                    active
                      ? "border-[#95836B] bg-[#95836B]/20 text-[#D8D5CD]"
                      : "border-transparent text-neutral-400 hover:border-[#1D2021] hover:text-[#D8D5CD]"
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
              className="font-mono text-[10px] text-[#95836B] hover:text-white"
            >
              Restablecer paleta ×
            </button>
          )}
        </div>
      )}

      {viewMode === "archive" ? (
        /* Vista de Tabla Técnica de Archivo Museístico */
        <div className="overflow-x-auto rounded-lg border border-[#1D2021] bg-[#1D2021]/20">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#1D2021] bg-[#101112]/80 text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
              <tr>
                <th className="py-3.5 px-4">Obra</th>
                <th className="py-3.5 px-4">Título</th>
                <th className="hidden md:table-cell py-3.5 px-4">Localización</th>
                <th className="hidden sm:table-cell py-3.5 px-4">Óptica & EXIF</th>
                <th className="py-3.5 px-4 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2021]/60">
              {filteredPhotos.map((photo, index) => (
                <tr
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="cursor-pointer transition hover:bg-[#1D2021]/60"
                >
                  <td className="py-2.5 px-4 w-16">
                    <div className="relative h-10 w-14 overflow-hidden rounded bg-[#1D2021]">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-serif text-base text-[#D8D5CD]">
                    {photo.title}
                    {photo.prints && (
                      <span className="ml-2 rounded border border-[#95836B]/40 px-1.5 py-0.5 font-sans text-[9px] uppercase tracking-wider text-[#95836B]">
                        Fine Art
                      </span>
                    )}
                  </td>
                  <td className="hidden md:table-cell py-2.5 px-4 text-neutral-400">
                    {photo.location ?? "España / Archivo"}
                  </td>
                  <td className="hidden sm:table-cell py-2.5 px-4 text-[#95836B]">
                    {photo.focalLength} · {photo.aperture} · {photo.shutter} · ISO {photo.iso}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] uppercase tracking-wider text-[#D8D5CD] underline underline-offset-4 hover:text-white"
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
        /* Grid Rendering by ViewMode.
           Todas las vistas respetan la proporción original de cada fotografía:
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
              className={`group overflow-hidden rounded-lg border border-[#1D2021] bg-[#1D2021]/40 transition duration-500 hover:border-[#95836B]/60 hover:bg-[#1D2021]/70 ${
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
                className="relative cursor-pointer overflow-hidden bg-[#1D2021] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={
                    viewMode === "immersive"
                      ? "(max-width: 1024px) 100vw, 1024px"
                      : viewMode === "grid"
                      ? "(max-width: 640px) 50vw, 20vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  className={`transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
                    viewMode === "immersive"
                      ? "h-auto max-h-[85vh] w-auto max-w-full"
                      : "h-auto w-full"
                  }`}
                />

                {/* Subtle Hover Overlay with Action Pill */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#D8D5CD] shadow-lg backdrop-blur-md font-mono">
                    <svg
                      className="h-3.5 w-3.5"
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
                    Ampliar
                  </span>
                </div>
              </div>

              {showMeta && viewMode !== "grid" && (
                <figcaption className="flex items-baseline justify-between gap-3 border-t border-[#1D2021]/60 bg-[#101112]/70 px-5 py-3.5">
                  <h3 className="font-serif text-lg font-light text-[#D8D5CD] group-hover:text-white transition-colors">
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
                    className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-[#95836B] group-hover:text-[#D8D5CD] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {photo.focalLength} →
                  </Link>
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
          <p className="text-xs text-[#95836B]">
            Mostrando {visiblePhotos.length} de {filteredPhotos.length} fotografías
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_BATCH)}
              className="border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3 text-xs uppercase tracking-[0.28em] text-[#101112] font-medium transition hover:bg-transparent hover:text-white"
            >
              Cargar 24 obras más
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filteredPhotos.length)}
              className="border border-[#1D2021] bg-[#1D2021]/60 px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
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
