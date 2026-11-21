"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory, MaxPrintFormatId, WildlifeCondition } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon, ExternalLinkIcon } from "./AdminIcons";
import {
  CATEGORY_EDITOR_CONFIG,
  getRelevantSeries,
  type AdminSeries,
} from "./categoryEditorConfig";

interface WorkEditorModalProps {
  photo: Photo;
  allSeries: AdminSeries[];
  onClose: () => void;
  onSave: (updated: Photo, seriesSlugs: string[]) => Promise<void>;
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
  allSeries,
  onClose,
  onSave,
  isSaving,
}: WorkEditorModalProps) {
  const [formData, setFormData] = useState<Photo>({ ...photo });
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [keywordsText, setKeywordsText] = useState(photo.keywords?.join(", ") || "");
  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    allSeries.filter((s) => s.photoIds.includes(photo.id)).map((s) => s.slug)
  );

  const config = CATEGORY_EDITOR_CONFIG[formData.category];
  const dims = formData.pricing?.dimensions ?? DEFAULT_DIMENSIONS;
  const categoryChanged = formData.category !== photo.category;

  const relevantSeries = useMemo(
    () => getRelevantSeries(allSeries, formData.category, photo.id),
    [allSeries, formData.category, photo.id]
  );

  const setField = <K extends keyof Photo>(field: K, value: Photo[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: PhotoCategory) => {
    setFormData((prev) => ({ ...prev, category }));
    // Quita las series que ya no encajan con la nueva categoría (salvo las de otra categoría a las que ya pertenecía)
    setSelectedSeries((prev) =>
      prev.filter((slug) =>
        getRelevantSeries(allSeries, category, photo.id).some((s) => s.slug === slug)
      )
    );
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
    const finalPhoto: Photo = {
      ...formData,
      keywords: keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    };
    // Los datos de fauna solo tienen sentido en fotos de fauna
    if (!CATEGORY_EDITOR_CONFIG[finalPhoto.category].showWildlife) {
      delete finalPhoto.wildlifeCondition;
      delete finalPhoto.realLocation;
    }
    const validSeries = selectedSeries.filter((slug) =>
      relevantSeries.some((s) => s.slug === slug)
    );
    await onSave(finalPhoto, validSeries);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "general", label: "General" },
    { id: "textos", label: "Textos" },
    { id: "precios", label: "Precios" },
    { id: "ubicacion", label: config.showWildlife ? "Lugar, fauna y EXIF" : "Lugar y EXIF" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#22242B] px-4 py-3 sm:px-6 sm:py-4 bg-[#16171B]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-[#30333C] bg-[#1B1D22]">
              <Image src={photo.image} alt={photo.alt || photo.title} fill sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#C5A880] uppercase tracking-wider bg-[#C5A880]/10 px-1.5 py-0.5 rounded">
                  {photo.id}
                </span>
                <span className="text-xs text-[#8E8A81]">
                  {CATEGORY_METADATA[formData.category]?.title}
                </span>
              </div>
              <h2 className="truncate font-serif text-lg font-medium text-[#EBE7DF] sm:text-xl">
                {formData.title || "Sin título"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/portfolio/${photo.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#2D3038] px-3 py-1.5 text-xs text-[#A39E93] hover:text-[#EBE7DF] hover:border-[#C5A880] transition"
            >
              <span>Ver en la web</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
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
              <div>
                <label className={labelClass}>Título *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setField("title", e.target.value)}
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
                      required
                      value={formData.slug}
                      onChange={(e) => setField("slug", e.target.value)}
                      className={`${inputClass} font-mono text-xs`}
                    />
                    <p className="mt-1 text-[11px] text-[#716C62]">
                      Cambiarlo rompe los enlaces ya compartidos.
                    </p>
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
                  required
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
          <div className="sticky bottom-0 -mx-4 -mb-5 sm:-mx-6 sm:-mb-6 flex items-center justify-between border-t border-[#25272F] bg-[#16171B]/95 p-4 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] hover:bg-[#1F2127] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 text-xs font-semibold tracking-wider text-[#0B0C0E] uppercase shadow-md transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0C0E] border-t-transparent" />
                  <span>Guardando…</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 text-[#0B0C0E]" />
                  <span>Guardar cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
