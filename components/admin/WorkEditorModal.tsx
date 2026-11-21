"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory, MaxPrintFormatId, WildlifeCondition } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon, ExternalLinkIcon, TrashIcon, UploadIcon } from "./AdminIcons";
import {
  CATEGORY_EDITOR_CONFIG,
  generateNextPhotoId,
  getRelevantSeries,
  slugifyTitle,
  type AdminSeries,
} from "./categoryEditorConfig";

interface WorkEditorModalProps {
  photo: Photo;
  isNew?: boolean;
  existingWorks: Photo[];
  allSeries: AdminSeries[];
  onClose: () => void;
  onSave: (
    updated: Photo,
    seriesSlugs: string[],
    imageBase64?: string
  ) => Promise<void>;
  onDelete?: (photo: Photo) => void;
  isSaving: boolean;
}

type TabId = "general" | "textos" | "precios" | "ubicacion";

const DEFAULT_DIMENSIONS = {
  estudio: "30 × 45 cm",
  galeria: "50 × 70 cm",
  coleccion: "70 × 100 cm",
};

function dimensionsForAspect(width: number, height: number) {
  const ratio = Math.max(width, height) / Math.max(1, Math.min(width, height));
  if (ratio >= 1.68) {
    return {
      estudio: "30 × 53 cm",
      galeria: "45 × 80 cm",
      coleccion: "60 × 105 cm",
    };
  }
  if (ratio <= 1.32) {
    return {
      estudio: "32 × 40 cm",
      galeria: "50 × 62 cm",
      coleccion: "70 × 88 cm",
    };
  }
  return { ...DEFAULT_DIMENSIONS };
}

function titleFromFilename(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!base) return "";
  return base
    .split(" ")
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx > 0 && ["de", "del", "la", "el", "en", "y", "a", "al", "con", "por"].includes(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

const inputClass =
  "w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] placeholder-[#5E5A53] focus:border-[#C5A880] focus:outline-none";
const labelClass = "block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1";

export default function WorkEditorModal({
  photo,
  isNew = false,
  existingWorks,
  allSeries,
  onClose,
  onSave,
  onDelete,
  isSaving,
}: WorkEditorModalProps) {
  const [formData, setFormData] = useState<Photo>({ ...photo });
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [keywordsText, setKeywordsText] = useState(photo.keywords?.join(", ") || "");
  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    allSeries.filter((s) => s.photoIds.includes(photo.id)).map((s) => s.slug)
  );
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const config = CATEGORY_EDITOR_CONFIG[formData.category];
  const dims = formData.pricing?.dimensions ?? DEFAULT_DIMENSIONS;
  const categoryChanged = !isNew && formData.category !== photo.category;

  const relevantSeries = useMemo(
    () => getRelevantSeries(allSeries, formData.category, formData.id),
    [allSeries, formData.category, formData.id]
  );

  const setField = <K extends keyof Photo>(field: K, value: Photo[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => {
      const next: Photo = { ...prev, title: newTitle };
      if (isNew) {
        const autoSlug = slugifyTitle(newTitle);
        next.slug = autoSlug;
        next.image = autoSlug
          ? `/images/portfolio/${prev.category}/${autoSlug}.jpg`
          : "";
        if (!prev.alt || prev.alt === prev.title) {
          next.alt = newTitle;
        }
      }
      return next;
    });
  };

  const handleCategoryChange = (category: PhotoCategory) => {
    setFormData((prev) => {
      const nextId = isNew ? generateNextPhotoId(category, existingWorks) : prev.id;
      const nextSlug = prev.slug || slugifyTitle(prev.title);
      return {
        ...prev,
        id: nextId,
        category,
        image:
          isNew && nextSlug
            ? `/images/portfolio/${category}/${nextSlug}.jpg`
            : prev.image,
      };
    });
    setSelectedSeries((prev) =>
      prev.filter((slug) =>
        getRelevantSeries(allSeries, category, formData.id).some((s) => s.slug === slug)
      )
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    setProcessingImage(true);

    try {
      // 1. Intentar leer metadatos EXIF si la foto los trae
      const exifPatch: Partial<Photo> = {};
      try {
        const exifr = await import("exifr");
        const meta = await exifr.parse(file);
        if (meta) {
          if (meta.Model) {
            const m = String(meta.Model);
            exifPatch.camera = /R7/i.test(m)
              ? "Canon EOS R7"
              : /750D/i.test(m)
              ? "Canon EOS 750D"
              : m;
          }
          const focalNum = Number(meta.FocalLength);
          if (Number.isFinite(focalNum) && focalNum > 0) {
            exifPatch.focalLength = `${Math.round(focalNum)}mm`;
          }
          if (meta.LensModel || focalNum) {
            const l = String(meta.LensModel || "");
            if (/150-600/i.test(l) || focalNum > 150) {
              exifPatch.lens = "Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary";
            } else if (/10-18/i.test(l) || (focalNum && focalNum < 18)) {
              exifPatch.lens = "Canon EF-S 10-18mm f/4.5-5.6 IS STM";
            } else if (l) {
              exifPatch.lens = l;
            }
          }
          if (Number.isFinite(Number(meta.ISO))) {
            exifPatch.iso = Math.round(Number(meta.ISO));
          }
          if (Number.isFinite(Number(meta.FNumber)) && Number(meta.FNumber) > 0) {
            exifPatch.aperture = `f/${Math.round(Number(meta.FNumber) * 10) / 10}`;
          }
          const exp = Number(meta.ExposureTime);
          if (Number.isFinite(exp) && exp > 0) {
            exifPatch.shutter = exp >= 1 ? `${Math.round(exp * 10) / 10}s` : `1/${Math.round(1 / exp)}s`;
          }
          if (meta.DateTimeOriginal instanceof Date && !Number.isNaN(meta.DateTimeOriginal.getTime())) {
            exifPatch.year = meta.DateTimeOriginal.getFullYear();
          }
        }
      } catch {
        // Si la imagen no tiene EXIF continuamos con los valores por defecto
      }

      // 2. Redimensionar y comprimir en canvas (máx 2200px lado largo, JPEG 0.88)
      const objectUrl = URL.createObjectURL(file);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new window.Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("No se pudo leer el archivo de imagen."));
        el.src = objectUrl;
      });

      const maxEdge = 2200;
      const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
      const targetW = Math.max(1, Math.round(img.naturalWidth * scale));
      const targetH = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No se pudo procesar la imagen.");
      ctx.drawImage(img, 0, 0, targetW, targetH);
      URL.revokeObjectURL(objectUrl);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      setUploadedDataUrl(dataUrl);

      const suggestedTitle = formData.title.trim() || titleFromFilename(file.name);
      const suggestedSlug = formData.slug.trim() || slugifyTitle(suggestedTitle) || formData.id;
      const newDims = dimensionsForAspect(targetW, targetH);

      setFormData((prev) => ({
        ...prev,
        ...exifPatch,
        title: suggestedTitle,
        slug: suggestedSlug,
        alt: prev.alt.trim() || suggestedTitle,
        width: targetW,
        height: targetH,
        image: `/images/portfolio/${prev.category}/${suggestedSlug}.jpg`,
        pricing: {
          ...(prev.pricing ?? {
            estudio: 95,
            galeria: 175,
            coleccion: 290,
            paper: "Hahnemühle Photo Rag 308g (100% Algodón)",
            editionTotal: 25,
            score: 85,
          }),
          dimensions: newDims,
        },
      }));
    } catch (err: unknown) {
      setFileError(
        err instanceof Error ? err.message : "No se pudo procesar la imagen seleccionada."
      );
    } finally {
      setProcessingImage(false);
    }
  };

  const toggleSeries = (slug: string) => {
    setSelectedSeries((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handlePricingChange = (
    key: "estudio" | "galeria" | "coleccion" | "paper" | "editionTotal",
    value: string | number
  ) => {
    setFormData((prev) => {
      const current = prev.pricing ?? {
        estudio: 95,
        galeria: 175,
        coleccion: 290,
        dimensions: { ...DEFAULT_DIMENSIONS },
        paper: "Hahnemühle Photo Rag Baryta 315g",
        editionTotal: 25,
        score: 85,
      };
      return { ...prev, pricing: { ...current, [key]: value } };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew && !uploadedDataUrl && !formData.image.trim()) {
      setFileError("Selecciona primero la fotografía que quieres subir.");
      setActiveTab("general");
      return;
    }

    const cleanSlug =
      formData.slug.trim() || slugifyTitle(formData.title) || formData.id;
    const finalPhoto: Photo = {
      ...formData,
      slug: cleanSlug,
      alt: formData.alt.trim() || formData.title.trim(),
      description:
        formData.description.trim() ||
        `${formData.title.trim()}${formData.location ? ` (${formData.location})` : ""}.`,
      image:
        formData.image.trim() ||
        `/images/portfolio/${formData.category}/${cleanSlug}.jpg`,
      keywords: keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    };
    if (!CATEGORY_EDITOR_CONFIG[finalPhoto.category].showWildlife) {
      delete finalPhoto.wildlifeCondition;
      delete finalPhoto.realLocation;
    }
    const validSeries = selectedSeries.filter((slug) =>
      relevantSeries.some((s) => s.slug === slug)
    );
    await onSave(finalPhoto, validSeries, uploadedDataUrl ?? undefined);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "general", label: "General" },
    { id: "textos", label: "Textos" },
    { id: "precios", label: "Precios" },
    { id: "ubicacion", label: config.showWildlife ? "Lugar, fauna y EXIF" : "Lugar y EXIF" },
  ];

  const previewSrc = uploadedDataUrl || formData.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#22242B] px-4 py-3 sm:px-6 sm:py-4 bg-[#16171B]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-[#30333C] bg-[#1B1D22] flex items-center justify-center">
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewSrc}
                  alt={formData.alt || formData.title || "Vista previa"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UploadIcon className="h-5 w-5 text-[#C5A880]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#C5A880] uppercase tracking-wider bg-[#C5A880]/10 px-1.5 py-0.5 rounded">
                  {isNew ? `NUEVA · ${formData.id}` : formData.id}
                </span>
                <span className="text-xs text-[#8E8A81]">
                  {CATEGORY_METADATA[formData.category]?.title}
                </span>
              </div>
              <h2 className="truncate font-serif text-lg font-medium text-[#EBE7DF] sm:text-xl">
                {formData.title || (isNew ? "Añadir nueva fotografía" : "Sin título")}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isNew && (
              <a
                href={`/portfolio/${photo.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#2D3038] px-3 py-1.5 text-xs text-[#A39E93] hover:text-[#EBE7DF] hover:border-[#C5A880] transition"
              >
                <span>Ver en la web</span>
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
              aria-label="Cerrar"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-[#22242B] bg-[#151619] px-2 sm:px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] whitespace-nowrap px-3 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#C5A880] text-[#C5A880]"
                  : "border-transparent text-[#8E8A81] hover:text-[#EBE7DF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-5">
          {/* GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4">
              {/* Selector de archivo de foto (protagonista al crear, disponible también para reemplazar) */}
              <div className="rounded-xl border border-dashed border-[#C5A880]/40 bg-[#16171C] p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {uploadedDataUrl ? (
                      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#C5A880]/40 bg-[#0B0C0E]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadedDataUrl}
                          alt="Vista previa subida"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : !isNew && formData.image ? (
                      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#2D3038] bg-[#0B0C0E]">
                        <Image
                          src={formData.image}
                          alt={formData.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#C5A880]/15 text-[#C5A880]">
                        <UploadIcon className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="block text-sm font-medium text-[#EBE7DF]">
                        {uploadedDataUrl
                          ? `Foto lista (${formData.width} × ${formData.height} px)`
                          : isNew
                          ? "Selecciona la fotografía desde tu móvil u ordenador"
                          : "Cambiar archivo de imagen (opcional)"}
                      </span>
                      <span className="block text-xs text-[#8E8A81]">
                        {uploadedDataUrl
                          ? "Se optimizará y subirá automáticamente al guardar."
                          : "Lee automáticamente los datos EXIF de la cámara y ajusta las medidas."}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={processingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-[#C5A880] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] transition hover:opacity-90 cursor-pointer"
                  >
                    <UploadIcon className="h-4 w-4" />
                    <span>
                      {processingImage
                        ? "Procesando…"
                        : uploadedDataUrl
                        ? "Elegir otra foto"
                        : "Elegir foto"}
                    </span>
                  </button>
                </div>
                {fileError && (
                  <p className="mt-2.5 text-xs text-red-400">{fileError}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Título *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ej. Luz de Tarde en los Balcones"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Categoría *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value as PhotoCategory)}
                    className={inputClass}
                  >
                    {PHOTO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_METADATA[cat]?.title || cat}
                      </option>
                    ))}
                  </select>
                  {categoryChanged && (
                    <p className="mt-1.5 text-[11px] text-[#C5A880]">
                      Has cambiado la categoría: los campos y las series se han ajustado.
                      {photo.category === "fauna-naturaleza" &&
                        " Los datos de fauna se eliminarán al guardar."}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Año</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formData.year}
                    onChange={(e) => setField("year", parseInt(e.target.value, 10) || photo.year)}
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              {/* Series de la categoría */}
              <div className="rounded-xl border border-[#24262E] bg-[#16171C] p-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
                  Series en las que aparece
                </span>
                {relevantSeries.length === 0 ? (
                  <p className="mt-2 text-xs text-[#8E8A81]">
                    No hay series de {CATEGORY_METADATA[formData.category]?.title}.
                  </p>
                ) : (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {relevantSeries.map((s) => (
                      <label
                        key={s.slug}
                        className="flex min-h-[44px] items-center gap-3 rounded-lg border border-[#2A2C33] bg-[#1A1C21] px-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSeries.includes(s.slug)}
                          onChange={() => toggleSeries(s.slug)}
                          className="h-4 w-4 accent-[#C5A880]"
                        />
                        <span className="text-xs text-[#EBE7DF]">{s.title}</span>
                        {s.category !== formData.category && (
                          <span className="ml-auto text-[10px] text-[#8E8A81]">
                            {CATEGORY_METADATA[s.category]?.title}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#24262E] bg-[#16171C] p-4 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
                  Visibilidad en la web
                </span>
                {[
                  { field: "featured" as const, label: "Destacada en portada", checked: formData.featured },
                  { field: "prints" as const, label: "A la venta como copia Fine Art", checked: formData.prints },
                  { field: "licensing" as const, label: "Disponible para licencias", checked: Boolean(formData.licensing) },
                ].map((opt) => (
                  <label key={opt.field} className="flex min-h-[44px] items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      onChange={(e) => setField(opt.field, e.target.checked)}
                      className="h-4 w-4 accent-[#C5A880]"
                    />
                    <span className="text-sm text-[#EBE7DF]">{opt.label}</span>
                  </label>
                ))}
              </div>

              <details className="rounded-xl border border-[#22242B] bg-[#141519] p-4">
                <summary className="cursor-pointer text-xs font-mono uppercase tracking-wider text-[#8E8A81]">
                  Avanzado (URL e imagen)
                </summary>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Dirección web (slug)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setField("slug", e.target.value)}
                      placeholder="se-genera-del-titulo"
                      className={`${inputClass} font-mono text-xs`}
                    />
                    {!isNew && (
                      <p className="mt-1 text-[11px] text-[#716C62]">
                        Cambiarlo rompe los enlaces ya compartidos.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Archivo de imagen</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setField("image", e.target.value)}
                      className={`${inputClass} font-mono text-xs`}
                    />
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* TEXTOS */}
          {activeTab === "textos" && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Descripción *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder={config.descriptionPlaceholder}
                  className={`${inputClass} leading-relaxed`}
                />
              </div>
              <div>
                <label className={labelClass}>{config.storyLabel}</label>
                <textarea
                  rows={5}
                  value={formData.story || ""}
                  onChange={(e) => setField("story", e.target.value)}
                  placeholder={config.storyPlaceholder}
                  className={`${inputClass} leading-relaxed`}
                />
              </div>
              <div>
                <label className={labelClass}>Texto alternativo (accesibilidad y Google)</label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setField("alt", e.target.value)}
                  placeholder={config.altPlaceholder}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Palabras clave (separadas por comas)</label>
                <input
                  type="text"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder={config.keywordsPlaceholder}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* PRECIOS */}
          {activeTab === "precios" && (
            <div className="space-y-4">
              {!formData.prints && (
                <p className="rounded-lg border border-[#C5A880]/30 bg-[#C5A880]/10 px-3 py-2 text-xs text-[#E5D3B3]">
                  Esta foto no está a la venta. Actívala en «General → A la venta» para que los precios se muestren en la web.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(
                  [
                    { key: "estudio", label: "Estudio" },
                    { key: "galeria", label: "Galería" },
                    { key: "coleccion", label: "Colección" },
                  ] as const
                ).map((fmt) => {
                  const disabledBySize =
                    (formData.maxRecommendedFormat === "estudio" && fmt.key !== "estudio") ||
                    (formData.maxRecommendedFormat === "galeria" && fmt.key === "coleccion");
                  return (
                    <div
                      key={fmt.key}
                      className={`rounded-lg border border-[#2C2E36] bg-[#1A1C22] p-3.5 ${disabledBySize ? "opacity-50" : ""}`}
                    >
                      <span className="block font-mono text-[10px] uppercase text-[#A39E93]">
                        {fmt.label} · {dims[fmt.key]}
                      </span>
                      <div className="mt-2 flex items-center gap-1.5">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={formData.pricing?.[fmt.key] ?? ""}
                          onChange={(e) => handlePricingChange(fmt.key, parseInt(e.target.value, 10) || 0)}
                          className="w-28 rounded border border-[#3A3D46] bg-[#131418] px-2.5 py-2 font-mono text-base font-semibold text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                        />
                        <span className="font-mono text-sm text-[#C5A880]">€</span>
                      </div>
                      {disabledBySize && (
                        <p className="mt-1.5 text-[10px] text-[#8E8A81]">Supera el tamaño máximo recomendado</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tamaño máximo recomendado</label>
                  <select
                    value={formData.maxRecommendedFormat || "coleccion"}
                    onChange={(e) => setField("maxRecommendedFormat", e.target.value as MaxPrintFormatId)}
                    className={inputClass}
                  >
                    <option value="estudio">Hasta Estudio ({dims.estudio})</option>
                    <option value="galeria">Hasta Galería ({dims.galeria})</option>
                    <option value="coleccion">Hasta Colección ({dims.coleccion})</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Copias de la edición limitada</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={formData.pricing?.editionTotal ?? ""}
                    onChange={(e) => handlePricingChange("editionTotal", parseInt(e.target.value, 10) || 0)}
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Motivo del tamaño máximo (se muestra al comprar)</label>
                <textarea
                  rows={2}
                  value={formData.maxFormatReason || ""}
                  onChange={(e) => setField("maxFormatReason", e.target.value)}
                  placeholder="Ej. Recorte fuerte o ISO alto: no se recomienda ampliar más."
                  className={`${inputClass} text-xs`}
                />
              </div>

              <div>
                <label className={labelClass}>Papel</label>
                <input
                  type="text"
                  value={formData.pricing?.paper || ""}
                  onChange={(e) => handlePricingChange("paper", e.target.value)}
                  className={`${inputClass} text-xs`}
                />
              </div>
            </div>
          )}

          {/* LUGAR Y EXIF */}
          {activeTab === "ubicacion" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{config.locationLabel}</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder={config.locationPlaceholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>País</label>
                  <input
                    type="text"
                    value={formData.country || ""}
                    onChange={(e) => setField("country", e.target.value)}
                    placeholder="Ej. España"
                    className={inputClass}
                  />
                </div>
              </div>

              {config.showWildlife && (
                <div className="rounded-xl border border-[#C5A880]/20 bg-[#16171C] p-4 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
                    Datos del avistamiento
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Condición del animal</label>
                      <select
                        value={formData.wildlifeCondition || ""}
                        onChange={(e) =>
                          setField(
                            "wildlifeCondition",
                            (e.target.value || undefined) as WildlifeCondition | undefined
                          )
                        }
                        className={inputClass}
                      >
                        <option value="">Sin indicar</option>
                        <option value="libre">En libertad</option>
                        <option value="parque">Parque natural / reserva</option>
                        <option value="centro">Santuario o centro de conservación</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Lugar exacto</label>
                      <input
                        type="text"
                        value={formData.realLocation || ""}
                        onChange={(e) => setField("realLocation", e.target.value || undefined)}
                        placeholder="Ej. Santuario de fauna salvaje, Austria"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[#22242B] bg-[#15161A] p-4 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A39E93]">
                  Datos de la cámara (EXIF)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { field: "camera", label: "Cámara" },
                      { field: "lens", label: "Objetivo" },
                      { field: "focalLength", label: "Focal" },
                      { field: "aperture", label: "Apertura" },
                      { field: "shutter", label: "Velocidad" },
                    ] as const
                  ).map((f) => (
                    <div key={f.field}>
                      <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">{f.label}</label>
                      <input
                        type="text"
                        value={formData[f.field]}
                        onChange={(e) => setField(f.field, e.target.value)}
                        className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-2 font-mono text-xs text-[#EBE7DF]"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">ISO</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={formData.iso}
                      onChange={(e) => setField("iso", parseInt(e.target.value, 10) || photo.iso)}
                      className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-2 font-mono text-xs text-[#EBE7DF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Barra de acciones */}
          <div className="sticky bottom-0 -mx-4 -mb-5 sm:-mx-6 sm:-mb-6 flex items-center justify-between gap-2 border-t border-[#25272F] bg-[#16171B]/95 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] hover:bg-[#1F2127] transition cursor-pointer"
              >
                Cancelar
              </button>
              {!isNew && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(photo)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3.5 text-xs font-medium text-red-300 hover:bg-red-950/50 hover:border-red-500/50 transition cursor-pointer"
                  title="Eliminar fotografía del catálogo"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="hidden xs:inline">Eliminar</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving || processingImage}
              className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 text-xs font-semibold tracking-wider text-[#0B0C0E] uppercase shadow-md transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0C0E] border-t-transparent" />
                  <span>{isNew ? "Subiendo…" : "Guardando…"}</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 text-[#0B0C0E]" />
                  <span>{isNew ? "Publicar fotografía" : "Guardar cambios"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
