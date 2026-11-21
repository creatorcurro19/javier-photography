"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Photo, Project } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon } from "./AdminIcons";

interface PhotoSeriesAssignModalProps {
  photo: Photo | null;
  series: Project[];
  previewSrc?: string;
  isSaving: boolean;
  onClose: () => void;
  onSave: (photoId: string, seriesSlugs: string[]) => Promise<void>;
}

export default function PhotoSeriesAssignModal({
  photo,
  series,
  previewSrc,
  isSaving,
  onClose,
  onSave,
}: PhotoSeriesAssignModalProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    if (!photo) return [];
    return series
      .filter((s) => s.photoIds.includes(photo.id))
      .map((s) => s.slug);
  });

  if (!photo) return null;

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(photo.id, selectedSlugs);
    onClose();
  };

  const imgSrc = previewSrc || photo.image;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md"
    >
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#22242B] px-5 py-3.5 bg-[#16171B]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Asignación Rápida a Colecciones
            </span>
            <h2 className="truncate font-serif text-lg font-medium text-[#EBE7DF]">
              {photo.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Info de la obra */}
        <div className="flex items-center gap-3.5 border-b border-[#202227] bg-[#141519] p-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#2B2D36] bg-black">
            {imgSrc.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgSrc} alt={photo.title} className="h-full w-full object-cover" />
            ) : (
              <Image src={imgSrc} alt={photo.title} fill sizes="56px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] text-[#C5A880] bg-[#C5A880]/15 px-1.5 py-0.5 rounded">
              {photo.id}
            </span>
            <p className="mt-1 font-mono text-xs text-[#8E8A81]">
              Categoría: {CATEGORY_METADATA[photo.category]?.title} · {photo.year}
            </p>
          </div>
        </div>

        {/* Lista de Colecciones con Checkboxes */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="font-mono text-xs text-[#A39E93] mb-3">
            Marca las colecciones o series a las que debe pertenecer esta fotografía:
          </p>

          {series.map((s) => {
            const isChecked = selectedSlugs.includes(s.slug);
            const isSameCat = s.category === photo.category;

            return (
              <label
                key={s.slug}
                className={`flex items-center justify-between rounded-xl border p-3 transition cursor-pointer ${
                  isChecked
                    ? "border-[#C5A880] bg-[#C5A880]/10 text-[#EBE7DF]"
                    : "border-[#22242C] bg-[#15161C] text-[#A39E93] hover:border-[#2F323D] hover:bg-[#181920]"
                }`}
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-medium text-[#EBE7DF]">
                      {s.title}
                    </span>
                    {isSameCat && (
                      <span className="rounded bg-[#C5A880]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#C5A880]">
                        Misma categoría
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-[#716C62]">
                    {s.photoIds.length} obras · {CATEGORY_METADATA[s.category]?.title}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSlug(s.slug)}
                  className="h-4 w-4 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880] focus:ring-0 cursor-pointer"
                />
              </label>
            );
          })}

          <div className="pt-3 border-t border-[#202227] flex items-center justify-between gap-2 mt-4">
            <span className="font-mono text-xs text-[#8E8A81]">
              Asignada a {selectedSlugs.length} colección(es)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#2D3038] bg-[#181920] px-3 py-1.5 font-mono text-xs text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg border border-[#C5A880]/60 bg-[#C5A880] px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
              >
                <CheckIcon className="h-3.5 w-3.5" />
                <span>{isSaving ? "Guardando…" : "Guardar"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
