"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory, MaxPrintFormatId, WildlifeCondition } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon, ExternalLinkIcon, TrashIcon, UploadIcon } from "./AdminIcons";
import {
  CATEGORY_EDITOR_CONFIG,
  dimensionsForAspect,
  generateNextPhotoId,
  getRelevantSeries,
  processImageFileClient,
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
    imageBase64?: string,
    seriesCoverSlugs?: string[]
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
  const [seriesCoverSlugs, setSeriesCoverSlugs] = useState<string[]>(
    allSeries.filter((s) => s.coverImage === photo.image && photo.image).map((s) => s.slug)
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

  // Qué fotos ocupan actualmente cada posición del Hero (1..5)
  const heroOccupants = useMemo(() => {
    const map: Record<number, string> = {};
    for (const w of existingWorks) {
      if (w.heroOrder && w.id !== formData.id) {
        map[w.heroOrder] = w.title;
      }
    }
    return map;
  }, [existingWorks, formData.id]);

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
      const processed = await processImageFileClient(file);
      setUploadedDataUrl(processed.dataUrl);

      const suggestedTitle = formData.title.trim() || processed.suggestedTitle;
      const suggestedSlug = formData.slug.trim() || slugifyTitle(suggestedTitle) || formData.id;
      const newDims = dimensionsForAspect(processed.width, processed.height);

      setFormData((prev) => ({
        ...prev,
        ...processed.exifPatch,
        title: suggestedTitle,
        slug: suggestedSlug,
        alt: prev.alt.trim() || suggestedTitle,
        width: processed.width,
        height: processed.height,
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
    setSelectedSeries((prev) => {
      const exists = prev.includes(slug);
      if (exists) {
        setSeriesCoverSlugs((covers) => covers.filter((c) => c !== slug));
        return prev.filter((s) => s !== slug);
      }
      return [...prev, slug];
    });
  };

  const toggleSeriesCover = (slug: string) => {
    if (!selectedSeries.includes(slug)) {
      setSelectedSeries((prev) => [...prev, slug]);
    }
    setSeriesCoverSlugs((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
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
    const validCovers = seriesCoverSlugs.filter((slug) => validSeries.includes(slug));
    await onSave(finalPhoto, validSeries, uploadedDataUrl ?? undefined, validCovers);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "general", label: "General y Portadas" },
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
          {/* GENERAL Y PORTADAS */}
          {activeTab === "general" && (
            <div className="space-y-4">
              {/* Selector de archivo de foto */}
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

              {/* Control de Portadas, Carrusel Hero y Orden de Destacadas (#3) */}
              <div className="rounded-xl border border-[#C5A880]/25 bg-[#16171C] p-4 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
                  Portadas, Carrusel Principal (Hero) y Visibilidad
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className={labelClass}>
                      Carrusel grande de entrada (Hero · 5 salas)
                    </label>
                    <select
                      value={formData.heroOrder || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setField("heroOrder", val >= 1 && val <= 5 ? val : undefined);
                      }}
                      className={inputClass}
                    >
                      <option value="">No mostrar en el carrusel Hero</option>
                      {[1, 2, 3, 4, 5].map((slot) => (
                        <option key={slot} value={slot}>
                          Sala {slot} del Hero{" "}
                          {heroOccupants[slot]
                            ? `(reemplaza a: ${heroOccupants[slot]})`
                            : "(actual)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Orden en «Obras Seleccionadas» (1º, 2º, 3º…)
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={99}
                      disabled={!formData.featured}
                      value={formData.featured ? formData.featuredOrder ?? "" : ""}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        setField("featuredOrder", Number.isFinite(n) && n >= 1 ? n : undefined);
                      }}
                      placeholder={
                        formData.featured
                          ? "Ej. 1 para que salga la primera"
                          : "Marca «Destacada en portada» para ordenar"
                      }
                      className={`${inputClass} font-mono disabled:opacity-40`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-[#25272F] bg-[#191B21] px-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setField("featured", e.target.checked)}
                      className="h-4 w-4 accent-[#C5A880]"
                    />
                    <span className="text-xs text-[#EBE7DF]">
                      Destacada en portada (Obras Seleccionadas)
                    </span>
                  </label>

                  <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-[#25272F] bg-[#191B21] px-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.categoryCover)}
                      onChange={(e) => setField("categoryCover", e.target.checked)}
                      className="h-4 w-4 accent-[#C5A880]"
                    />
                    <span className="text-xs text-[#EBE7DF]">
                      Usar como portada de «{CATEGORY_METADATA[formData.category]?.title}»
                    </span>
                  </label>

                  <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-[#25272F] bg-[#191B21] px-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prints}
                      onChange={(e) => setField("prints", e.target.checked)}
                      className="h-4 w-4 accent-[#C5A880]"
                    />
                    <span className="text-xs text-[#EBE7DF]">
                      A la venta como copia Fine Art
                    </span>
                  </label>

                  <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-[#25272F] bg-[#191B21] px-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.licensing)}
                      onChange={(e) => setField("licensing", e.target.checked)}
                      className="h-4 w-4 accent-[#C5A880]"
                    />
                    <span className="text-xs text-[#EBE7DF]">
                      Disponible para licencias
                    </span>
                  </label>
                </div>
              </div>

              {/* Series de la categoría + botón para usar como portada de serie */}
              <div className="rounded-xl border border-[#24262E] bg-[#16171C] p-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
                  Series en las que aparece (y portada de serie)
                </span>
                {relevantSeries.length === 0 ? (
                  <p className="mt-2 text-xs text-[#8E8A81]">
                    No hay series de {CATEGORY_METADATA[formData.category]?.title}.
                  </p>
                ) : (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {relevantSeries.map((s) => {
                      const isMember = selectedSeries.includes(s.slug);
                      const isSeriesCover = seriesCoverSlugs.includes(s.slug);
                      return (
                        <div
                          key={s.slug}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#2A2C33] bg-[#1A1C21] px-3 py-2"
                        >
                          <label className="flex min-h-[36px] items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isMember}
                              onChange={() => toggleSeries(s.slug)}
                              className="h-4 w-4 accent-[#C5A880]"
                            />
                            <span className="text-xs text-[#EBE7DF]">{s.title}</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => toggleSeriesCover(s.slug)}
                            className={`rounded-md px-2.5 py-1 font-mono text-[10px] transition cursor-pointer ${
                              isSeriesCover
                                ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                                : "border border-[#2E313A] bg-[#14151A] text-[#A39E93] hover:border-[#C5A880]"
                            }`}
                          >
                            {isSeriesCover ? "★ Portada de esta serie" : "Hacer portada de serie"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
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
