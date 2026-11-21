"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon, SearchIcon } from "./AdminIcons";

interface SeriesPhotoPickerModalProps {
  isOpen: boolean;
  seriesTitle: string;
  currentPhotoIds: string[];
  works: Photo[];
  previewMap: Record<string, string>;
  onClose: () => void;
  onApply: (selectedIds: string[]) => void;
}

export default function SeriesPhotoPickerModal({
  isOpen,
  seriesTitle,
  currentPhotoIds,
  works,
  previewMap,
  onClose,
  onApply,
}: SeriesPhotoPickerModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(currentPhotoIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PhotoCategory | "all">("all");
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      if (categoryFilter !== "all" && w.category !== categoryFilter) return false;
      if (showOnlySelected && !selectedSet.has(w.id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = `${w.id} ${w.title} ${w.location || ""} ${w.country || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [works, categoryFilter, showOnlySelected, selectedSet, searchQuery]);

  if (!isOpen) return null;

  const togglePhoto = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredWorks.map((w) => w.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const deselectAllVisible = () => {
    const visibleSet = new Set(filteredWorks.map((w) => w.id));
    setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
  };

  const handleApply = () => {
    onApply(selectedIds);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#22242B] px-4 py-3 sm:px-6 bg-[#16171B]">
          <div className="min-w-0 pr-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Selector Visual de Obras para Colección
            </span>
            <h2 className="truncate font-serif text-lg sm:text-xl font-medium text-[#EBE7DF]">
              {seriesTitle || "Colección"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="border-b border-[#202227] bg-[#141519] p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
            {/* Buscador */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8A81]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar obra por título, ID o ubicación…"
                className="w-full rounded-xl border border-[#2A2C34] bg-[#18191F] py-2 pl-9 pr-8 font-mono text-xs text-[#EBE7DF] placeholder-[#66635C] focus:border-[#C5A880] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8A81] hover:text-[#EBE7DF] p-1"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Acciones de selección rápida */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={selectAllVisible}
                className="rounded-lg border border-[#2D3038] bg-[#191B21] px-2.5 py-1.5 font-mono text-[11px] text-[#A39E93] hover:text-[#EBE7DF] hover:border-[#C5A880] transition cursor-pointer"
              >
                + Marcar visibles ({filteredWorks.length})
              </button>
              <button
                type="button"
                onClick={deselectAllVisible}
                className="rounded-lg border border-[#2D3038] bg-[#191B21] px-2.5 py-1.5 font-mono text-[11px] text-[#A39E93] hover:text-red-400 hover:border-red-500/40 transition cursor-pointer"
              >
                ✕ Desmarcar
              </button>
              <button
                type="button"
                onClick={() => setShowOnlySelected(!showOnlySelected)}
                className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] transition cursor-pointer ${
                  showOnlySelected
                    ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                    : "border border-[#2D3038] bg-[#191B21] text-[#A39E93] hover:text-[#EBE7DF]"
                }`}
              >
                {showOnlySelected ? "Mostrando seleccionadas" : "Solo seleccionadas"} ({selectedSet.size})
              </button>
            </div>
          </div>

          {/* Pastillas de Categoría */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full px-3 py-1 font-mono text-[11px] whitespace-nowrap transition cursor-pointer ${
                categoryFilter === "all"
                  ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                  : "border border-[#282A31] bg-[#18191E] text-[#8E8A81] hover:text-[#EBE7DF]"
              }`}
            >
              Todas ({works.length})
            </button>
            {PHOTO_CATEGORIES.map((cat) => {
              const count = works.filter((w) => w.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] whitespace-nowrap transition cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                      : "border border-[#282A31] bg-[#18191E] text-[#8E8A81] hover:text-[#EBE7DF]"
                  }`}
                >
                  {CATEGORY_METADATA[cat]?.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Cuadrícula de Selección Visual */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {filteredWorks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-[#8E8A81]">
                No se encontraron fotografías con el criterio actual.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setShowOnlySelected(false);
                }}
                className="mt-3 rounded-lg border border-[#C5A880]/40 px-3.5 py-1.5 font-mono text-xs text-[#C5A880] hover:bg-[#C5A880]/15 transition cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredWorks.map((w) => {
                const isSelected = selectedSet.has(w.id);
                const thumbSrc = previewMap[w.id] || w.image;

                return (
                  <div
                    key={w.id}
                    onClick={() => togglePhoto(w.id)}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-2 transition cursor-pointer select-none ${
                      isSelected
                        ? "border-[#C5A880] bg-[#1A1A22] shadow-lg shadow-[#C5A880]/10 ring-1 ring-[#C5A880]"
                        : "border-[#24262E] bg-[#141519] hover:border-[#383B46] hover:bg-[#181920]"
                    }`}
                  >
                    {/* Miniatura */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#0B0C0E]">
                      {thumbSrc.startsWith("data:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbSrc}
                          alt={w.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={thumbSrc}
                          alt={w.title}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}

                      {/* Badge de Selección (Check) */}
                      <div
                        className={`absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full transition ${
                          isSelected
                            ? "bg-[#C5A880] text-[#0B0C0E] shadow-md"
                            : "border border-white/40 bg-black/60 text-transparent group-hover:border-[#C5A880]"
                        }`}
                      >
                        <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
                      </div>

                      {/* ID de la obra */}
                      <div className="absolute bottom-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[9px] text-[#C5A880]">
                        {w.id}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-2 min-w-0">
                      <p className="truncate font-serif text-xs font-medium text-[#EBE7DF]">
                        {w.title}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-[#8E8A81]">
                        {CATEGORY_METADATA[w.category]?.title} · {w.year}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pie de acción */}
        <div className="flex items-center justify-between border-t border-[#22242B] px-4 py-3 sm:px-6 bg-[#16171B]">
          <span className="font-mono text-xs text-[#A39E93]">
            <strong className="text-[#C5A880]">{selectedSet.size}</strong> fotografías asignadas a esta colección
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2D3038] bg-[#181920] px-4 py-2 font-mono text-xs text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-xl border border-[#C5A880]/60 bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] shadow-lg shadow-[#C5A880]/20 hover:opacity-95 transition cursor-pointer"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Guardar selección ({selectedSet.size})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
