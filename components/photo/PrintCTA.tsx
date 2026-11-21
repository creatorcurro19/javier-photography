"use client";

import { useState } from "react";
import CertificateOfAuthenticityModal from "@/components/prints/CertificateOfAuthenticityModal";
import { AndalusianCornerOrnaments } from "@/components/ui/AndalusianMotif";
import type { Photo } from "@/types/photo";
import { PRINT_FORMATS, addToCart } from "@/lib/cart";
import type { PrintFormat } from "@/types/cart";

type PrintCTAProps = {
  photo: Photo;
};

export default function PrintCTA({ photo }: PrintCTAProps) {
  const [selectedFormatId, setSelectedFormatId] =
    useState<PrintFormat["id"]>("galeria");
  const [framed, setFramed] = useState(false);
  const [added, setAdded] = useState(false);

  const currentFormat = PRINT_FORMATS[selectedFormatId];
  const unitPrice =
    currentFormat.price + (framed ? currentFormat.framePrice : 0);

  const handleAddToCart = () => {
    addToCart({
      photoId: photo.id,
      slug: photo.slug,
      title: photo.title,
      image: photo.image,
      category: photo.category,
      format: currentFormat,
      framed,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyDirectly = () => {
    addToCart({
      photoId: photo.id,
      slug: photo.slug,
      title: photo.title,
      image: photo.image,
      category: photo.category,
      format: currentFormat,
      framed,
      quantity: 1,
    });
    window.dispatchEvent(new Event("open-checkout-direct"));
  };

  return (
    <section
      id="adquirir-copia"
      aria-labelledby="print-heading"
      className="relative border border-[#C5A880]/25 bg-[#151618]/95 p-8 sm:p-10 transition-colors scroll-mt-24"
    >
      <AndalusianCornerOrnaments className="text-[#C5A880]/50" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#C5A880]">
          Adquisición Directa en el Estudio · Sin Intermediarios
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#EBE7DF] border border-white/20 px-2 py-0.5">
          {photo.prints ? "Edición Principal Numerada" : "Edición Bajo Demanda"}
        </span>
      </div>

      <h2
        id="print-heading"
        className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]"
      >
        Adquirir Copia Fine Art
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light">
        Impresión giclée de conservación sobre papel 100% algodón Hahnemühle Photo Rag® 308 g/m² bajo norma ISO 9706.
        Cada obra incluye certificado de autenticidad firmado y numerado de puño y letra por Javier Espinosa Martínez.
      </p>

      {/* Selector Interactivo de Formatos */}
      <div className="mt-8 space-y-3">
        <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
          1. Seleccione Formato de Obra
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            Object.keys(PRINT_FORMATS) as Array<PrintFormat["id"]>
          ).map((fmtKey) => {
            const fmt = PRINT_FORMATS[fmtKey];
            const isSelected = selectedFormatId === fmtKey;
            return (
              <button
                key={fmtKey}
                type="button"
                onClick={() => setSelectedFormatId(fmtKey)}
                className={`flex flex-col justify-between border p-4 text-left transition ${
                  isSelected
                    ? "border-[#EBE7DF] bg-[#0B0C0E] text-[#EBE7DF] shadow-md"
                    : "border-white/[0.08] bg-[#0B0C0E]/50 text-[#8E8A80] hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A80]">
                    {fmt.name.split("(")[0].trim()}
                  </span>
                  <span className="font-mono text-[9px] text-[#8E8A80]/70">
                    Ed. {fmt.editionLimit}
                  </span>
                </div>
                <span className="mt-2 font-serif text-lg font-light text-[#EBE7DF]">
                  {fmt.price} €
                </span>
                <span className="mt-1 font-mono text-[10px] text-[#8E8A80]">
                  {fmt.dimensions}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opción de Enmarcado Museo */}
      <div className="mt-5 border border-white/[0.08] bg-[#0B0C0E]/60 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={framed}
            onChange={(e) => setFramed(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#EBE7DF]"
          />
          <div className="text-xs">
            <span className="font-medium text-[#EBE7DF]">
              Añadir Enmarcado Museo con Cristal UV 99% (+{currentFormat.framePrice} €)
            </span>
            <p className="mt-0.5 text-[11px] text-[#8E8A80] font-light leading-relaxed">
              Moldura maciza de madera con paspartú de conservación libre de ácido de 5 cm. Listo para colgar.
            </p>
          </div>
        </label>
      </div>

      {/* Total & Añadir a la Cesta */}
      <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] block">
            Importe de la Selección
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-light text-[#EBE7DF]">
              {unitPrice} €
            </span>
            <span className="font-mono text-[11px] text-[#8E8A80]">
              {framed ? "(Con Marco Museo)" : "(Lámina suelta)"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleBuyDirectly}
            className="inline-flex items-center justify-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
          >
            <span>Comprar Ahora</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-2 border border-[#C5A880] bg-[#C5A880]/15 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#EBE7DF] font-medium transition hover:bg-[#C5A880] hover:text-[#0B0C0E]"
          >
            <span>{added ? "✓ En la Cesta" : "+ Añadir a la Cesta"}</span>
          </button>

          <CertificateOfAuthenticityModal photo={photo} />
        </div>
      </div>

      {/* Sello de Conservación Directa */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#8E8A80]">
        <span>✓ Compra 100% directa al autor · Certificado numerado, holograma y envío asegurado</span>
        <span className="text-[#C5A880]">Hahnemühle Photo Rag® 308g · ISO 9706</span>
      </div>
    </section>
  );
}
