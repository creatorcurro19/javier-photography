"use client";

import { useState } from "react";
import CertificateOfAuthenticityModal from "@/components/prints/CertificateOfAuthenticityModal";
import { AndalusianCornerOrnaments } from "@/components/ui/AndalusianMotif";
import type { Photo } from "@/types/photo";
import { getFormatsForPhoto, addToCart } from "@/lib/cart";
import type { PrintFormat } from "@/types/cart";

type PrintCTAProps = {
  photo: Photo;
};

export default function PrintCTA({ photo }: PrintCTAProps) {
  const [selectedFormatId, setSelectedFormatId] =
    useState<PrintFormat["id"]>("galeria");
  const [added, setAdded] = useState(false);

  const formats = getFormatsForPhoto(photo);
  const currentFormat = formats[selectedFormatId];
  const unitPrice = currentFormat.price;
  const recommendedPaper =
    photo.pricing?.paper ??
    "Hahnemühle Photo Rag® 308g / Canson Rag Photographique 310g (100% Algodón Mate)";
  const editionTotal = photo.pricing?.editionTotal ?? 25;

  const handleAddToCart = () => {
    addToCart({
      photoId: photo.id,
      slug: photo.slug,
      title: photo.title,
      image: photo.image,
      category: photo.category,
      format: currentFormat,
      framed: false,
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
      framed: false,
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
          Adquisición Directa · Impresión Fine Art en Tubo Rígido
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#EBE7DF] border border-white/20 px-2 py-0.5">
          Edición Limitada ({editionTotal} ej.)
        </span>
      </div>

      <h2
        id="print-heading"
        className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]"
      >
        Adquirir Copia Fine Art
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light">
        Impresión Giclée de 12 tintas pigmentadas bajo norma ISO 9706 sobre soporte asignado a esta obra:{" "}
        <strong className="text-[#EBE7DF] font-normal">{recommendedPaper}</strong>. Se entrega como lámina sin enmarcar, con margen blanco de conservación, envuelta en papel seda libre de ácido dentro de un tubo rígido de alta densidad junto a su Certificado de Autenticidad firmado y numerado.
      </p>

      {/* Selector Interactivo de Formatos con Precios Individuales de esta Obra */}
      <div className="mt-8 space-y-3">
        <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
          1. Seleccione Formato de Impresión (Precios individuales de esta obra)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            Object.keys(formats) as Array<PrintFormat["id"]>
          ).map((fmtKey) => {
            const fmt = formats[fmtKey];
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
                    {fmt.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#C5A880]">
                    Ed. {editionTotal}
                  </span>
                </div>
                <span className="mt-2 font-serif text-xl font-light text-[#EBE7DF]">
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

      {/* Especificación de Entrega en Tubo Rígido (Sin Marco) */}
      <div className="mt-5 border border-white/[0.08] bg-[#0B0C0E]/60 p-4">
        <div className="flex items-start gap-3 text-xs">
          <span className="mt-0.5 text-[#C5A880] font-mono">✓</span>
          <div>
            <span className="font-medium text-[#EBE7DF]">
              Lámina Fine Art sin enmarcar · Envío en tubo rígido de alta densidad incluido
            </span>
            <p className="mt-0.5 text-[11px] text-[#8E8A80] font-light leading-relaxed">
              Incluye margen perimetral blanco para facilitar el enmarcado en tu destino, papel seda pH neutro, Certificado de Autenticidad manuscrito y doble holograma numerado.
            </p>
          </div>
        </div>
      </div>

      {/* Total & Acciones de Compra Directa */}
      <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] block">
            Precio de la Copia ({currentFormat.dimensions})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-light text-[#EBE7DF]">
              {unitPrice} €
            </span>
            <span className="font-mono text-[11px] text-[#8E8A80]">
              (Impresión + Tubo Rígido + Certificado)
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
