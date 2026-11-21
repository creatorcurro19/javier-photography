"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory, MaxPrintFormatId, WildlifeCondition } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon, ExternalLinkIcon } from "./AdminIcons";

interface WorkEditorModalProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Photo) => Promise<void>;
  isSaving: boolean;
}

export default function WorkEditorModal({
  photo,
  isOpen,
  onClose,
  onSave,
  isSaving,
}: WorkEditorModalProps) {
  const [formData, setFormData] = useState<Photo>({ ...photo });
  const [activeTab, setActiveTab] = useState<"general" | "narrativa" | "fineart" | "tecnico">("general");
  const [keywordsText, setKeywordsText] = useState(photo.keywords?.join(", ") || "");

  if (!isOpen) return null;

  const handleTextChange = (field: keyof Photo, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePricingChange = (key: "estudio" | "galeria" | "coleccion" | "paper" | "editionTotal", value: string | number) => {
    setFormData((prev) => {
      const currentPricing = prev.pricing || {
        estudio: 95,
        galeria: 175,
        coleccion: 290,
        dimensions: {
          estudio: "30 × 45 cm",
          galeria: "50 × 70 cm",
          coleccion: "70 × 100 cm",
        },
        paper: "Hahnemühle Photo Rag Baryta 315g",
        editionTotal: 25,
        score: 85,
      };

      return {
        ...prev,
        pricing: {
          ...currentPricing,
          [key]: value,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedKeywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const finalPhoto: Photo = {
      ...formData,
      keywords: updatedKeywords,
    };

    await onSave(finalPhoto);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#22242B] px-4 py-3 sm:px-6 sm:py-4 bg-[#16171B]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-[#30333C] bg-[#1B1D22]">
              <Image
                src={photo.image}
                alt={photo.alt || photo.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#C5A880] uppercase tracking-wider bg-[#C5A880]/10 px-1.5 py-0.5 rounded">
                  {photo.id}
                </span>
                <span className="text-xs text-[#8E8A81]">
                  {CATEGORY_METADATA[photo.category]?.title || photo.category}
                </span>
              </div>
              <h2 className="truncate font-serif text-lg font-medium text-[#EBE7DF] sm:text-xl">
                {formData.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/portfolio/${photo.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#2D3038] px-3 py-1.5 text-xs text-[#A39E93] hover:text-[#EBE7DF] hover:border-[#C5A880] transition"
              title="Abrir ficha pública en nueva pestaña"
            >
              <span>Ver pública</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
              aria-label="Cerrar modal"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#22242B] bg-[#151619] px-4 sm:px-6 overflow-x-auto no-scrollbar">
          {[
            { id: "general", label: "General & Título" },
            { id: "narrativa", label: "Historia & Textos" },
            { id: "fineart", label: "Precios Fine Art" },
            { id: "tecnico", label: "Ubicación & EXIF" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`whitespace-nowrap py-3 px-3 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-[#C5A880] text-[#C5A880]"
                  : "border-transparent text-[#8E8A81] hover:text-[#EBE7DF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-5">
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                  Título de la Obra *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTextChange("title", e.target.value)}
                  className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Slug / URL Permanente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => handleTextChange("slug", e.target.value)}
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleTextChange("category", e.target.value as PhotoCategory)}
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  >
                    {PHOTO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_METADATA[cat]?.title || cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Serie Monográfica
                  </label>
                  <input
                    type="text"
                    value={formData.series || ""}
                    onChange={(e) => handleTextChange("series", e.target.value)}
                    placeholder="Ej. Custodios, Entre la Bruma..."
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Año de Captura
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleTextChange("year", parseInt(e.target.value, 10) || 2026)}
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 font-mono text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Ruta de Imagen
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => handleTextChange("image", e.target.value)}
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 font-mono text-xs text-[#8E8A81] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              {/* Switches Rápidos */}
              <div className="rounded-xl border border-[#24262E] bg-[#16171C] p-4 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
                  Visibilidad en Web
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleTextChange("featured", e.target.checked)}
                      className="h-4 w-4 rounded border-[#3A3D46] bg-[#1E2026] text-[#C5A880] focus:ring-[#C5A880]"
                    />
                    <span className="text-xs text-[#EBE7DF]">Destacada en Portada</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prints}
                      onChange={(e) => handleTextChange("prints", e.target.checked)}
                      className="h-4 w-4 rounded border-[#3A3D46] bg-[#1E2026] text-[#C5A880] focus:ring-[#C5A880]"
                    />
                    <span className="text-xs text-[#EBE7DF]">Venta Fine Art Activa</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.licensing)}
                      onChange={(e) => handleTextChange("licensing", e.target.checked)}
                      className="h-4 w-4 rounded border-[#3A3D46] bg-[#1E2026] text-[#C5A880] focus:ring-[#C5A880]"
                    />
                    <span className="text-xs text-[#EBE7DF]">Licencias Comerciales</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NARRATIVA */}
          {activeTab === "narrativa" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                  Descripción Editorial (Ficha, Catálogo y SEO) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => handleTextChange("description", e.target.value)}
                  placeholder="Descripción concisa y visual de la fotografía..."
                  className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                  Historia de Campo / Anécdota del Autor
                </label>
                <textarea
                  rows={4}
                  value={formData.story || ""}
                  onChange={(e) => handleTextChange("story", e.target.value)}
                  placeholder="Relato personal: cómo se planeó el disparo, condiciones de luz, esperas, o detalles del momento..."
                  className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                  Texto Alternativo (Accesibilidad & Google Images)
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => handleTextChange("alt", e.target.value)}
                  className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                  Palabras Clave (separadas por comas)
                </label>
                <input
                  type="text"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder="fauna, tenerife, lince, 600mm, fine art..."
                  className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FINE ART & PRECIOS */}
          {activeTab === "fineart" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#C5A880]/20 bg-[#16171C] p-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880]">
                  Precios por Formato (Tubo protector desde Tenerife)
                </span>
                <p className="mt-1 text-xs text-[#8E8A81]">
                  Precios finales en euros para copia impresa en papel de algodón Baritado.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-[#2C2E36] bg-[#1A1C22] p-3.5">
                    <span className="block font-mono text-[10px] uppercase text-[#A39E93]">
                      Formato Estudio (30×45 cm)
                    </span>
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        value={formData.pricing?.estudio || 95}
                        onChange={(e) => handlePricingChange("estudio", parseInt(e.target.value, 10) || 95)}
                        className="w-24 rounded border border-[#3A3D46] bg-[#131418] px-2.5 py-1.5 font-mono text-base font-semibold text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                      />
                      <span className="font-mono text-sm text-[#C5A880]">€</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#2C2E36] bg-[#1A1C22] p-3.5">
                    <span className="block font-mono text-[10px] uppercase text-[#A39E93]">
                      Formato Galería (50×70 cm)
                    </span>
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="number"
                        min="80"
                        max="3000"
                        value={formData.pricing?.galeria || 175}
                        onChange={(e) => handlePricingChange("galeria", parseInt(e.target.value, 10) || 175)}
                        className="w-24 rounded border border-[#3A3D46] bg-[#131418] px-2.5 py-1.5 font-mono text-base font-semibold text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                      />
                      <span className="font-mono text-sm text-[#C5A880]">€</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#2C2E36] bg-[#1A1C22] p-3.5">
                    <span className="block font-mono text-[10px] uppercase text-[#A39E93]">
                      Gran Colección (70×100 cm)
                    </span>
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="number"
                        min="120"
                        max="5000"
                        value={formData.pricing?.coleccion || 290}
                        onChange={(e) => handlePricingChange("coleccion", parseInt(e.target.value, 10) || 290)}
                        className="w-24 rounded border border-[#3A3D46] bg-[#131418] px-2.5 py-1.5 font-mono text-base font-semibold text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                      />
                      <span className="font-mono text-sm text-[#C5A880]">€</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Formato Máximo Recomendado
                  </label>
                  <select
                    value={formData.maxRecommendedFormat || "coleccion"}
                    onChange={(e) => handleTextChange("maxRecommendedFormat", e.target.value as MaxPrintFormatId)}
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  >
                    <option value="estudio">Solo Estudio (hasta 30×45 cm)</option>
                    <option value="galeria">Hasta Galería (50×70 cm)</option>
                    <option value="coleccion">Gran Colección (70×100 cm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Tirada Total de la Edición
                  </label>
                  <input
                    type="number"
                    value={formData.pricing?.editionTotal || 25}
                    onChange={(e) => handlePricingChange("editionTotal", parseInt(e.target.value, 10) || 25)}
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 font-mono text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                  Aviso Técnico / Razón de Formato Máximo
                </label>
                <textarea
                  rows={2}
                  value={formData.maxFormatReason || ""}
                  onChange={(e) => handleTextChange("maxFormatReason", e.target.value)}
                  placeholder="Ej. Disparada con Canon EOS 750D (24.2 MP): formato máximo recomendado Galería (50×70 cm)..."
                  className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2 text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                  Papel Fine Art Recomendado
                </label>
                <input
                  type="text"
                  value={formData.pricing?.paper || "Hahnemühle Photo Rag Baryta 315g"}
                  onChange={(e) => handlePricingChange("paper", e.target.value)}
                  className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2 text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: TÉCNICO & UBICACIÓN */}
          {activeTab === "tecnico" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Ubicación Pública (Título / Ficha)
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => handleTextChange("location", e.target.value)}
                    placeholder="Austria, Tenerife, Sierra de Guadarrama..."
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Ubicación Real / Detalle Santuario
                  </label>
                  <input
                    type="text"
                    value={formData.realLocation || ""}
                    onChange={(e) => handleTextChange("realLocation", e.target.value)}
                    placeholder="Santuario de fauna salvaje, Austria"
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    Condición de Fauna Salvaje
                  </label>
                  <select
                    value={formData.wildlifeCondition || "libre"}
                    onChange={(e) => handleTextChange("wildlifeCondition", e.target.value as WildlifeCondition)}
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  >
                    <option value="libre">En libertad completa (Libre)</option>
                    <option value="centro">Santuario / Centro de recuperación</option>
                    <option value="parque">Parque natural / Espacio controlado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.country || ""}
                    onChange={(e) => handleTextChange("country", e.target.value)}
                    placeholder="España, Austria..."
                    className="w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              {/* Parámetros EXIF */}
              <div className="rounded-xl border border-[#22242B] bg-[#15161A] p-4 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A39E93]">
                  Metadatos EXIF de Disparo
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">Cámara</label>
                    <input
                      type="text"
                      value={formData.camera}
                      onChange={(e) => handleTextChange("camera", e.target.value)}
                      className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">Objetivo</label>
                    <input
                      type="text"
                      value={formData.lens}
                      onChange={(e) => handleTextChange("lens", e.target.value)}
                      className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">Focal</label>
                    <input
                      type="text"
                      value={formData.focalLength}
                      onChange={(e) => handleTextChange("focalLength", e.target.value)}
                      className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">Apertura</label>
                    <input
                      type="text"
                      value={formData.aperture}
                      onChange={(e) => handleTextChange("aperture", e.target.value)}
                      className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">Velocidad</label>
                    <input
                      type="text"
                      value={formData.shutter}
                      onChange={(e) => handleTextChange("shutter", e.target.value)}
                      className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8A81] uppercase mb-0.5">ISO</label>
                    <input
                      type="number"
                      value={formData.iso}
                      onChange={(e) => handleTextChange("iso", parseInt(e.target.value, 10) || 100)}
                      className="w-full rounded border border-[#2D3036] bg-[#191A20] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Actions Bar inside form */}
          <div className="sticky bottom-0 -mx-4 -mb-5 sm:-mx-6 sm:-mb-6 flex items-center justify-between border-t border-[#25272F] bg-[#16171B]/95 p-4 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#30333C] px-4 py-2.5 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] hover:bg-[#1F2127] transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#0B0C0E] uppercase shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0C0E] border-t-transparent" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 text-[#0B0C0E]" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
