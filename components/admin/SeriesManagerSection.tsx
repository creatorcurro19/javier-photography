"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory, Project } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon, EditIcon, ExternalLinkIcon, PlusIcon, TrashIcon } from "./AdminIcons";
import { slugifyTitle } from "./categoryEditorConfig";

interface SeriesManagerSectionProps {
  series: Project[];
  works: Photo[];
  previewMap: Record<string, string>;
  isSaving: boolean;
  onSaveSeries: (updated: Project) => Promise<void>;
  onDeleteSeries: (slug: string) => Promise<void>;
}

const DISCIPLINE_BY_CATEGORY: Record<PhotoCategory, string> = {
  "fauna-naturaleza": "FAUNA",
  "paisajes-documental": "PAISAJE",
  "coches-rally": "AUTOMOVILISMO",
  "arquitectura-urbana": "ARQUITECTURA",
  "viajes-cultura": "DOCUMENTAL",
};

const inputClass =
  "w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] placeholder-[#5E5A53] focus:border-[#C5A880] focus:outline-none";
const labelClass = "block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1";

export default function SeriesManagerSection({
  series,
  works,
  previewMap,
  isSaving,
  onSaveSeries,
  onDeleteSeries,
}: SeriesManagerSectionProps) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNewSeries, setIsNewSeries] = useState(false);
  const [statementText, setStatementText] = useState("");
  const [deletingSeries, setDeletingSeries] = useState<Project | null>(null);

  const openEditor = (s: Project) => {
    setIsNewSeries(false);
    setEditing({
      ...s,
      statement: [...s.statement],
      photoIds: [...s.photoIds],
    });
    setStatementText(s.statement.join("\n\n"));
  };

  const openCreateNewSeries = () => {
    const defaultCat: PhotoCategory = "paisajes-documental";
    const firstCatPhoto = works.find((w) => w.category === defaultCat) ?? works[0];
    setIsNewSeries(true);
    setEditing({
      id: "",
      slug: "",
      title: "",
      subtitle: "",
      discipline: DISCIPLINE_BY_CATEGORY[defaultCat],
      category: defaultCat,
      year: String(new Date().getFullYear()),
      location: "España",
      description: "",
      statement: [],
      coverImage: firstCatPhoto?.image ?? "/images/portfolio/hero/hero.jpg",
      photoIds: firstCatPhoto ? [firstCatPhoto.id] : [],
    });
    setStatementText("");
  };

  const setField = <K extends keyof Project>(field: K, value: Project[K]) => {
    setEditing((prev) => {
      if (!prev) return null;
      const next = { ...prev, [field]: value };
      if (isNewSeries && field === "title" && typeof value === "string") {
        const autoSlug = slugifyTitle(value);
        next.slug = autoSlug;
        next.id = autoSlug;
      }
      if (field === "category" && typeof value === "string") {
        const cat = value as PhotoCategory;
        if (isNewSeries) {
          next.discipline = DISCIPLINE_BY_CATEGORY[cat] || prev.discipline;
        }
      }
      return next;
    });
  };

  const movePhotoInSeries = (index: number, direction: -1 | 1) => {
    if (!editing) return;
    const target = index + direction;
    if (target < 0 || target >= editing.photoIds.length) return;
    const nextIds = [...editing.photoIds];
    const [moved] = nextIds.splice(index, 1);
    nextIds.splice(target, 0, moved);
    setEditing({ ...editing, photoIds: nextIds });
  };

  const removePhotoFromSeries = (photoId: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      photoIds: editing.photoIds.filter((id) => id !== photoId),
    });
  };

  const addPhotoToSeries = (photoId: string) => {
    if (!editing) return;
    if (editing.photoIds.includes(photoId)) return;
    const w = works.find((item) => item.id === photoId);
    setEditing({
      ...editing,
      photoIds: [...editing.photoIds, photoId],
      coverImage:
        editing.photoIds.length === 0 && w ? w.image : editing.coverImage,
    });
  };

  const candidatePhotosToAdd = useMemo(() => {
    if (!editing) return [];
    const currentSet = new Set(editing.photoIds);
    // Mostrar primero las de la categoría de la serie y luego el resto del catálogo
    const sameCat = works.filter(
      (w) => w.category === editing.category && !currentSet.has(w.id)
    );
    const otherCat = works.filter(
      (w) => w.category !== editing.category && !currentSet.has(w.id)
    );
    return [...sameCat, ...otherCat];
  }, [editing, works]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const cleanSlug =
      editing.slug.trim() || slugifyTitle(editing.title) || `serie-${Date.now()}`;
    const paragraphs = statementText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    await onSaveSeries({
      ...editing,
      id: editing.id.trim() || cleanSlug,
      slug: cleanSlug,
      statement: paragraphs.length > 0 ? paragraphs : [editing.description],
    });
    setEditing(null);
    setIsNewSeries(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSeries) return;
    await onDeleteSeries(deletingSeries.slug);
    if (editing?.slug === deletingSeries.slug) {
      setEditing(null);
    }
    setDeletingSeries(null);
  };

  return (
    <div className="space-y-5">
      {/* Botón grande para crear una nueva serie (#1) */}
      <button
        type="button"
        onClick={openCreateNewSeries}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#C5A880]/50 bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0B0C0E] shadow-xl shadow-[#C5A880]/10 transition hover:opacity-95 cursor-pointer"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Crear nueva serie monográfica</span>
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {series.map((s) => {
          const resolvedPhotos = s.photoIds
            .map((id) => works.find((w) => w.id === id))
            .filter((w): w is Photo => Boolean(w));
          const coverPhoto =
            works.find((w) => w.image === s.coverImage) ?? resolvedPhotos[0];
          const coverSrc =
            (coverPhoto && previewMap[coverPhoto.id]) || s.coverImage;

          return (
            <div
              key={s.slug}
              className="flex flex-col justify-between rounded-xl border border-[#202228] bg-[#131418] p-4 transition hover:border-[#C5A880]/40"
            >
              <div>
                <div className="flex gap-4">
                  <div className="relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-[#262830] bg-[#1A1C22]">
                    {coverSrc && coverSrc.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverSrc}
                        alt={s.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={coverSrc}
                        alt={s.title}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded bg-[#C5A880]/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                        {s.discipline}
                      </span>
                      <span className="font-mono text-[10px] text-[#8E8A81]">
                        {CATEGORY_METADATA[s.category]?.title} · {resolvedPhotos.length} fotos
                      </span>
                    </div>
                    <h3 className="mt-1 font-serif text-lg font-medium text-[#EBE7DF]">
                      {s.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#A39E93] line-clamp-2">
                      {s.subtitle}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#8E8A81] line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#1E2026] pt-3 gap-2">
                <a
                  href={`/projects/${s.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#A39E93] hover:text-[#EBE7DF] transition"
                >
                  <span>Ver serie</span>
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditor(s)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#C5A880]/30 bg-[#1A1C22] px-3.5 py-1.5 text-xs font-medium text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                    <span>Editar serie</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingSeries(s)}
                    className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-red-500/25 bg-red-950/20 px-2.5 py-1.5 text-red-300 hover:bg-red-600 hover:border-red-500 hover:text-white transition cursor-pointer"
                    title={`Eliminar serie "${s.title}"`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Editor / Creador de Serie */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#22242B] px-4 py-3.5 sm:px-6 bg-[#16171B]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                  {isNewSeries ? "Nueva Serie Monográfica" : `Editar Serie · ${editing.slug}`}
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-medium text-[#EBE7DF]">
                  {editing.title || "Crear nueva serie"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Título de la serie *</label>
                  <input
                    type="text"
                    required
                    value={editing.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Ej. Niebla y Basalto: Cumbres del Norte"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Subtítulo *</label>
                  <input
                    type="text"
                    required
                    value={editing.subtitle}
                    onChange={(e) => setField("subtitle", e.target.value)}
                    placeholder="Ej. Recorrido por los riscos y bosques húmedos"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setField("category", e.target.value as PhotoCategory)}
                    className={inputClass}
                  >
                    {PHOTO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_METADATA[cat]?.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Etiqueta / Disciplina</label>
                  <input
                    type="text"
                    value={editing.discipline}
                    onChange={(e) => setField("discipline", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Años</label>
                  <input
                    type="text"
                    value={editing.year}
                    onChange={(e) => setField("year", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ubicación</label>
                  <input
                    type="text"
                    value={editing.location || ""}
                    onChange={(e) => setField("location", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Descripción corta (tarjetas y SEO) *</label>
                <textarea
                  rows={2}
                  required
                  value={editing.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Resumen breve de lo que reúne esta serie…"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Texto curatorial / Declaración de la serie (separa párrafos con una línea en blanco)
                </label>
                <textarea
                  rows={5}
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="Explicación de la serie, contexto y notas técnicas…"
                  className={`${inputClass} leading-relaxed`}
                />
              </div>

              {/* Fotografías de la serie: orden y elección de portada */}
              <div className="rounded-xl border border-[#24262E] bg-[#15161B] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#C5A880]">
                    Fotografías en esta serie ({editing.photoIds.length}) · Orden y Portada
                  </span>

                  {candidatePhotosToAdd.length > 0 && (
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) addPhotoToSeries(e.target.value);
                      }}
                      className="rounded-lg border border-[#2D3036] bg-[#1A1C22] px-3 py-1.5 text-xs text-[#EBE7DF]"
                    >
                      <option value="">+ Añadir fotografía a esta serie…</option>
                      {candidatePhotosToAdd.map((w) => (
                        <option key={w.id} value={w.id}>
                          [{w.id}] {w.title} ({CATEGORY_METADATA[w.category]?.title})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {editing.photoIds.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#8E8A81]">
                    Usa el desplegable de arriba para añadir fotografías a esta serie.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {editing.photoIds.map((id, idx) => {
                      const w = works.find((item) => item.id === id);
                      if (!w) return null;
                      const isCover = editing.coverImage === w.image;
                      const thumbSrc = previewMap[w.id] || w.image;

                      return (
                        <div
                          key={w.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-[#25272F] bg-[#191B21] p-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-xs text-[#8E8A81] w-5">
                              {idx + 1}.
                            </span>
                            <div className="relative h-12 w-14 flex-shrink-0 overflow-hidden rounded border border-[#2D3038] bg-[#0B0C0E]">
                              {thumbSrc.startsWith("data:") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={thumbSrc}
                                  alt={w.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Image
                                  src={thumbSrc}
                                  alt={w.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-mono text-[10px] text-[#C5A880]">
                                {w.id}
                              </span>
                              <p className="truncate text-xs font-medium text-[#EBE7DF]">
                                {w.title}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setField("coverImage", w.image)}
                              className={`rounded-md px-2.5 py-1 font-mono text-[10px] transition cursor-pointer ${
                                isCover
                                  ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                                  : "border border-[#2E313A] bg-[#131419] text-[#A39E93] hover:border-[#C5A880]"
                              }`}
                            >
                              {isCover ? "★ Portada" : "Hacer portada"}
                            </button>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => movePhotoInSeries(idx, -1)}
                              className="h-8 w-8 rounded border border-[#2E313A] bg-[#131419] font-mono text-xs text-[#EBE7DF] disabled:opacity-30 cursor-pointer"
                              title="Subir posición"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === editing.photoIds.length - 1}
                              onClick={() => movePhotoInSeries(idx, 1)}
                              className="h-8 w-8 rounded border border-[#2E313A] bg-[#131419] font-mono text-xs text-[#EBE7DF] disabled:opacity-30 cursor-pointer"
                              title="Bajar posición"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removePhotoFromSeries(w.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded border border-red-500/25 bg-red-950/20 text-red-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
                              title="Quitar de esta serie"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 -mx-4 -mb-5 sm:-mx-6 flex items-center justify-between gap-2 border-t border-[#25272F] bg-[#16171B]/95 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  {!isNewSeries && (
                    <button
                      type="button"
                      onClick={() => setDeletingSeries(editing)}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3.5 text-xs font-medium text-red-300 hover:bg-red-950/50 transition cursor-pointer"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Eliminar serie</span>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
                >
                  <CheckIcon className="h-4 w-4 text-[#0B0C0E]" />
                  <span>
                    {isSaving
                      ? "Guardando…"
                      : isNewSeries
                      ? "Crear y publicar serie"
                      : "Guardar serie"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación de Serie */}
      {deletingSeries && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#121316] p-6 text-[#EBE7DF] shadow-2xl">
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">
              Eliminar Serie Monográfica
            </span>
            <h3 className="mt-1 font-serif text-lg font-medium text-[#EBE7DF]">
              {deletingSeries.title}
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#A39E93]">
              ¿Seguro que quieres eliminar esta serie? Todas las fotografías que contiene seguirán intactas en el catálogo general, solo se eliminará la agrupación de la serie.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingSeries(null)}
                className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleConfirmDelete}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-50 transition cursor-pointer"
              >
                <TrashIcon className="h-4 w-4" />
                <span>{isSaving ? "Eliminando…" : "Sí, eliminar serie"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
