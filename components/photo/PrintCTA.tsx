"use client";

import { useState } from "react";
import Link from "next/link";
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
        {photo.camera === "Canon EOS 750D" && (
          <div className="mb-4 border-l-2 border-[#C5A880] bg-[#15171A] p-3 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block">
              Nota técnica de adquisición:
            </span>
            <p className="mt-1 font-light text-[#EBE7DF] leading-relaxed">
              Obra original capturada con cuerpo <strong className="text-white">Canon EOS 750D</strong> (sensor APS-C 24,2 MP). Formato máximo recomendado de copia: <strong className="text-white">Formato Galería (50 × 70 cm)</strong> para garantizar la máxima nitidez y densidad óptica de grano.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            Object.keys(formats) as Array<PrintFormat["id"]>
          ).map((fmtKey) => {
            const fmt = formats[fmtKey];
            const isSelected = selectedFormatId === fmtKey;
            const isDisabled = Boolean(fmt.disabled);
            return (
              <button
                key={fmtKey}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && setSelectedFormatId(fmtKey)}
                className={`flex flex-col justify-between border p-4 text-left transition ${
                  isDisabled
                    ? "cursor-not-allowed border-white/[0.04] bg-[#0B0C0E]/30 opacity-45"
                    : isSelected
                    ? "border-[#EBE7DF] bg-[#0B0C0E] text-[#EBE7DF] shadow-md"
                    : "border-white/[0.08] bg-[#0B0C0E]/50 text-[#A39E93] hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#A39E93]">
                    {fmt.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#C5A880]">
                    {isDisabled ? "No disp." : `Ed. ${editionTotal}`}
                  </span>
                </div>
                <span className="mt-2 font-serif text-xl font-light text-[#EBE7DF]">
                  {fmt.price} €
                </span>
                <span className="mt-1 font-mono text-[10px] text-[#A39E93]">
                  Papel: {fmt.dimensions}
                </span>
                <span className="mt-0.5 font-mono text-[9px] text-[#A39E93]">
                  {fmt.imageDimensions}
                </span>
              </button>
            );
          })}
        </div>

        {formats.coleccion.disabled && (
          <p className="mt-2 border border-[#C5A880]/35 bg-[#0B0C0E]/80 px-3.5 py-2.5 font-mono text-[11px] leading-relaxed text-[#E5D3B3]">
            Aviso de formato máximo recomendado: {formats.coleccion.disabledReason}
          </p>
        )}
      </div>

      {/* Especificación de Entrega en Tubo Rígido (Sin Marco), Impuestos y Envío por Zona */}
      <div className="mt-5 border border-white/[0.08] bg-[#0B0C0E]/60 p-4">
        <div className="flex items-start gap-3 text-xs">
          <span className="mt-0.5 text-[#C5A880] font-mono">✓</span>
          <div>
            <span className="font-medium text-[#EBE7DF]">
              Lámina Fine Art sin enmarcar · Envío en tubo rígido (plazo: 5–7 días laborables)
            </span>
            <p className="mt-0.5 text-[11px] text-[#A39E93] font-light leading-relaxed">
              Papel total {currentFormat.dimensions} ({currentFormat.imageDimensions}). Envío en tubo rígido por zona: Canarias 0 € · Península y Baleares 15 € · Internacional 28 €. Precios finales de venta de autor sin recargo de IGIC.
            </p>
          </div>
        </div>
      </div>

      {/* Total & Acciones de Compra Directa / Solicitud */}
      <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93] block">
            Precio de la Copia ({currentFormat.dimensions})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-light text-[#EBE7DF]">
              {unitPrice} €
            </span>
            <span className="font-mono text-[11px] text-[#A39E93]">
              (Lámina + Tubo Rígido + Certificado)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleBuyDirectly}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
          >
            <span>Tramitar Pedido</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#C5A880] bg-[#C5A880]/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] font-medium transition hover:bg-[#C5A880] hover:text-[#0B0C0E]"
          >
            <span>{added ? "✓ En la Cesta" : "+ Añadir a la Cesta"}</span>
          </button>

          <Link
            href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}&formato=${encodeURIComponent(`${currentFormat.name} (${currentFormat.dimensions} · ${unitPrice} €)`)}`}
            className="inline-flex min-h-[44px] items-center justify-center border border-white/20 bg-[#0B0C0E] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
          >
            Solicitar esta copia
          </Link>

          <CertificateOfAuthenticityModal photo={photo} />
        </div>
      </div>

      {/* Sello de Conservación Directa */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#A39E93]">
        <span>✓ Compra 100% directa al autor · Certificado firmado y numerado · Envío en tubo rígido</span>
        <span className="text-[#C5A880]">Hahnemühle Photo Rag® 308g · ISO 9706</span>
      </div>
    </section>
  );
}
