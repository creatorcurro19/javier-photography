"use client";

import React, { useMemo, useRef, useState } from "react";
import type { Photo, PhotoCategory, WildlifeCondition } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon, TrashIcon, UploadIcon } from "./AdminIcons";
import {
  CATEGORY_EDITOR_CONFIG,
  createBlankPhoto,
  dimensionsForAspect,
  getRelevantSeries,
  processImageFileClient,
  slugifyTitle,
  type AdminSeries,
} from "./categoryEditorConfig";

interface BatchQueueItem {
  tempId: string;
  title: string;
  description: string;
  dataUrl: string;
  width: number;
  height: number;
  exifPatch: Partial<Photo>;
}

interface BatchUploadModalProps {
  initialCategory: PhotoCategory;
  existingWorks: Photo[];
  allSeries: AdminSeries[];
  isSaving: boolean;
  onClose: () => void;
  onBatchSubmit: (
    items: { photo: Photo; imageBase64: string }[],
    seriesSlugs: string[]
  ) => Promise<void>;
}

const inputClass =
  "w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] placeholder-[#5E5A53] focus:border-[#C5A880] focus:outline-none";
const labelClass = "block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1";

export default function BatchUploadModal({
  initialCategory,
  existingWorks,
  allSeries,
  isSaving,
  onClose,
  onBatchSubmit,
}: BatchUploadModalProps) {
  const [category, setCategory] = useState<PhotoCategory>(initialCategory);
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("España");
  const [wildlifeCondition, setWildlifeCondition] = useState<WildlifeCondition>("libre");
  const [realLocation, setRealLocation] = useState("");
  const [estudioPrice, setEstudioPrice] = useState(95);
  const [galeriaPrice, setGaleriaPrice] = useState(175);
  const [coleccionPrice, setColeccionPrice] = useState(290);
  const [printsEnabled, setPrintsEnabled] = useState(initialCategory !== "coches-rally");
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [items, setItems] = useState<BatchQueueItem[]>([]);
  const [processingCount, setProcessingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const config = CATEGORY_EDITOR_CONFIG[category];
  const categorySeries = useMemo(
    () => getRelevantSeries(allSeries, category, ""),
    [allSeries, category]
  );

  const handleCategoryChange = (newCat: PhotoCategory) => {
    setCategory(newCat);
    if (newCat === "coches-rally") {
      setPrintsEnabled(false);
    }
    setSelectedSeries((prev) =>
      prev.filter((slug) =>
        getRelevantSeries(allSeries, newCat, "").some((s) => s.slug === slug)
      )
    );
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setProcessingCount(files.length);

    const added: BatchQueueItem[] = [];
    for (const file of files) {
      try {
        const res = await processImageFileClient(file);
        added.push({
          tempId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: res.suggestedTitle,
          description: "",
          dataUrl: res.dataUrl,
          width: res.width,
          height: res.height,
          exifPatch: res.exifPatch,
        });
      } catch {
        // omit invalid image
      }
    }

    setItems((prev) => [...prev, ...added]);
    setProcessingCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateItemField = (
    tempId: string,
    field: "title" | "description",
    value: string
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.tempId === tempId ? { ...it, [field]: value } : it))
    );
  };

  const removeItem = (tempId: string) => {
    setItems((prev) => prev.filter((it) => it.tempId !== tempId));
  };

  const toggleSeries = (slug: string) => {
    setSelectedSeries((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Selecciona al menos una fotografía para subir.");
      return;
    }

    const reservedIds = new Set<string>();
    const usedSlugs = new Set<string>(existingWorks.map((w) => w.slug));
    const payload: { photo: Photo; imageBase64: string }[] = [];

    for (const it of items) {
      const basePhoto = createBlankPhoto(category, existingWorks, reservedIds);
      reservedIds.add(basePhoto.id);

      const cleanTitle = it.title.trim() || `Obra ${basePhoto.id.toUpperCase()}`;
      let slugCandidate = slugifyTitle(cleanTitle) || basePhoto.id;
      if (usedSlugs.has(slugCandidate)) {
        slugCandidate = `${slugCandidate}-${basePhoto.id}`;
      }
      usedSlugs.add(slugCandidate);

      const dims = dimensionsForAspect(it.width, it.height);
      const photo: Photo = {
        ...basePhoto,
        ...it.exifPatch,
        title: cleanTitle,
        slug: slugCandidate,
        alt: cleanTitle,
        width: it.width,
        height: it.height,
        image: `/images/portfolio/${category}/${slugCandidate}.jpg`,
        location: location.trim() || undefined,
        country: country.trim() || undefined,
        description:
          it.description.trim() ||
          `${cleanTitle}${location.trim() ? ` (${location.trim()})` : ""}.`,
        prints: printsEnabled,
        pricing: {
          estudio: estudioPrice,
          galeria: galeriaPrice,
          coleccion: coleccionPrice,
          dimensions: dims,
          paper: "Hahnemühle Photo Rag 308g (100% Algodón)",
          editionTotal: 25,
          score: 85,
        },
        ...(config.showWildlife
          ? {
              wildlifeCondition,
              realLocation: realLocation.trim() || undefined,
            }
          : {}),
      };

      payload.push({ photo, imageBase64: it.dataUrl });
    }

    await onBatchSubmit(payload, selectedSeries);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#22242B] px-4 py-3.5 sm:px-6 bg-[#16171B]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Subida Múltiple con Lectura EXIF Automática
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-medium text-[#EBE7DF]">
              Subir varias fotografías en lote
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-5">
          {/* Selector múltiple de archivos */}
          <div className="rounded-xl border border-dashed border-[#C5A880]/50 bg-[#16171C] p-5 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
            <UploadIcon className="mx-auto h-8 w-8 text-[#C5A880]" />
            <p className="mt-2 text-sm font-medium text-[#EBE7DF]">
              Selecciona todas las fotos que quieras subir a la vez
            </p>
            <p className="mt-1 text-xs text-[#8E8A81]">
              Cada foto se optimiza a 2200 px, lee su cámara/objetivo/ISO automáticamente y recibe su código correlativo.
            </p>
            <button
              type="button"
              disabled={processingCount > 0}
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#C5A880] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] hover:opacity-90 transition cursor-pointer"
            >
              <UploadIcon className="h-4 w-4" />
              <span>
                {processingCount > 0
                  ? `Procesando ${processingCount} fotos…`
                  : items.length > 0
                  ? "Añadir más fotos al lote"
                  : "Seleccionar fotos del móvil u ordenador"}
              </span>
            </button>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </div>

          {/* Ajustes comunes del lote */}
          <div className="rounded-xl border border-[#24262E] bg-[#15161B] p-4 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
              Datos comunes para todo el lote
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Categoría *</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as PhotoCategory)}
                  className={inputClass}
                >
                  {PHOTO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_METADATA[cat]?.title || cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{config.locationLabel}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={config.locationPlaceholder}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>País</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="España"
                  className={inputClass}
                />
              </div>
            </div>

            {config.showWildlife && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className={labelClass}>Condición del animal</label>
                  <select
                    value={wildlifeCondition}
                    onChange={(e) => setWildlifeCondition(e.target.value as WildlifeCondition)}
                    className={inputClass}
                  >
                    <option value="libre">En libertad</option>
                    <option value="parque">Parque natural / reserva</option>
                    <option value="centro">Santuario o centro de conservación</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Lugar exacto (opcional)</label>
                  <input
                    type="text"
                    value={realLocation}
                    onChange={(e) => setRealLocation(e.target.value)}
                    placeholder="Ej. Santuario de fauna salvaje, Austria"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className={labelClass}>Estudio (€)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={estudioPrice}
                  onChange={(e) => setEstudioPrice(parseInt(e.target.value, 10) || 95)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Galería (€)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={galeriaPrice}
                  onChange={(e) => setGaleriaPrice(parseInt(e.target.value, 10) || 175)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Colección (€)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={coleccionPrice}
                  onChange={(e) => setColeccionPrice(parseInt(e.target.value, 10) || 290)}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex min-h-[42px] w-full items-center gap-2.5 rounded-lg border border-[#2D3036] bg-[#17181D] px-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printsEnabled}
                    onChange={(e) => setPrintsEnabled(e.target.checked)}
                    className="h-4 w-4 accent-[#C5A880]"
                  />
                  <span className="text-xs text-[#EBE7DF]">Venta activa</span>
                </label>
              </div>
            </div>

            {category === "coches-rally" && (
              <p className="rounded-lg border border-[#3A3D46] bg-[#17181D] px-3 py-2 text-[11px] text-[#A39E93] leading-relaxed">
                <strong className="text-[#C5A880]">Aviso Motorsport / Rally:</strong> Venta directa desmarcada por defecto. Las imágenes se publicarán en el portfolio como archivo documental con botón de contacto y solicitud privada para pilotos, escuderías y prensa acreditada.
              </p>
            )}

            {categorySeries.length > 0 && (
              <div>
                <span className={labelClass}>Incluir el lote en estas series (opcional)</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {categorySeries.map((s) => (
                    <label
                      key={s.slug}
                      className="flex min-h-[38px] items-center gap-2 rounded-lg border border-[#2A2C33] bg-[#1A1C21] px-3 text-xs text-[#EBE7DF] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSeries.includes(s.slug)}
                        onChange={() => toggleSeries(s.slug)}
                        className="h-4 w-4 accent-[#C5A880]"
                      />
                      <span>{s.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lista de fotos en cola */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#C5A880]">
                  Fotografías preparadas ({items.length})
                </span>
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="text-xs text-red-300 hover:text-red-200 cursor-pointer"
                >
                  Vaciar lista
                </button>
              </div>

              <div className="space-y-2.5">
                {items.map((it, idx) => (
                  <div
                    key={it.tempId}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-[#25272F] bg-[#16171C] p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-[#8E8A81] w-5">
                        {idx + 1}.
                      </span>
                      <div className="relative flex h-16 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#2D3038] bg-[#0B0C0E] p-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.dataUrl}
                          alt={it.title}
                          className="max-h-full max-w-full h-auto w-auto object-contain"
                        />
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={it.title}
                        onChange={(e) => updateItemField(it.tempId, "title", e.target.value)}
                        placeholder="Título de la fotografía"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => updateItemField(it.tempId, "description", e.target.value)}
                        placeholder="Descripción breve (opcional)"
                        className={inputClass}
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span className="font-mono text-[10px] text-[#8E8A81] whitespace-nowrap">
                        {it.exifPatch.focalLength || "35mm"} · ISO {it.exifPatch.iso || 400}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(it.tempId)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/25 bg-red-950/20 text-red-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        title="Quitar del lote"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barra inferior */}
          <div className="sticky bottom-0 -mx-4 -mb-5 sm:-mx-6 flex items-center justify-between gap-2 border-t border-[#25272F] bg-[#16171B]/95 p-4 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || processingCount > 0 || items.length === 0}
              className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 text-xs font-semibold tracking-wider text-[#0B0C0E] uppercase shadow-md transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0C0E] border-t-transparent" />
                  <span>Subiendo {items.length} fotos…</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 text-[#0B0C0E]" />
                  <span>Publicar {items.length || ""} fotografías</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
