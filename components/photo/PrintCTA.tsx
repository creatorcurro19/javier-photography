"use client";

import { useState } from "react";
import Link from "next/link";
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

  if (!photo.prints) {
    const isMotorsport = photo.category === "coches-rally";
    return (
      <section
        id="adquirir-copia"
        aria-labelledby="archive-heading"
        className="relative border border-white/[0.12] bg-[#151618]/95 p-8 sm:p-10 transition-colors scroll-mt-24"
      >
        <AndalusianCornerOrnaments className="text-[#C5A880]/40" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#C5A880]">
            {isMotorsport ? "Archivo Motorsport · Solicitud para Equipos y Prensa" : "Archivo Documental · Consulta Directa"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#A39E93] border border-white/15 px-2 py-0.5">
            {isMotorsport ? "Uso Editorial / Equipos" : "Edición no disponible online"}
          </span>
        </div>

        <h2
          id="archive-heading"
          className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]"
        >
          {isMotorsport ? "Prensa, Pilotos y Escuderías" : "Consulta y Copia Privada de Autor"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light">
          {isMotorsport
            ? "Para respetar los derechos de imagen de escuderías, patrocinadores y participantes, las imágenes de competición no se comercializan a través de venta abierta al público. Si eres piloto, copiloto, miembro del equipo, organizador o medio acreditado, puedes solicitar archivos máster en alta resolución (TIFF 16-bit / 32,5 MP) o copias de autor para tu escudería o patrocinadores."
            : "Esta fotografía forma parte del archivo documental y no cuenta con venta automatizada en cesta. Si deseas adquirir una copia Fine Art firmada o tramitar una cesión particular, contacta directamente con el autor."}
        </p>

        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93] block">
              Modalidad de Cesión
            </span>
            <span className="font-serif text-xl text-[#EBE7DF]">
              {isMotorsport ? "Cesión directa a pilotos y prensa" : "Consulta personalizada"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/contact?motivo=${isMotorsport ? "rally" : "print"}&obra=${encodeURIComponent(photo.title)}`}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#C5A880] bg-[#C5A880] px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white shadow"
            >
              <span>{isMotorsport ? "Solicitar como Piloto / Prensa →" : "Contactar con Javier →"}</span>
            </Link>
            <Link
              href="/servicios"
              className="inline-flex min-h-[44px] items-center justify-center border border-white/20 bg-[#0B0C0E] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
            >
              Encargos y Coberturas
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="adquirir-copia"
      aria-labelledby="print-heading"
      className="relative rounded-xl border border-white/[0.1] bg-[#151618] p-6 sm:p-8 transition-colors scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="print-heading"
          className="font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]"
        >
          Comprar esta lámina
        </h2>
        <span className="font-mono text-xs text-[#C5A880]">
          Envío en tubo rígido · Gratis en Canarias
        </span>
      </div>

      {/* Selector Interactivo de Formatos con Precios Individuales de esta Obra */}
      <div className="mt-6 space-y-3">
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-[#A39E93]">
          Elige el tamaño:
        </label>

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
                className={`flex flex-col justify-between rounded-lg border p-4 text-left transition ${
                  isDisabled
                    ? "cursor-not-allowed border-white/[0.04] bg-[#0B0C0E]/30 opacity-45"
                    : isSelected
                    ? "border-[#C5A880] bg-[#0B0C0E] text-[#EBE7DF] shadow-md"
                    : "border-white/[0.08] bg-[#0B0C0E]/50 text-[#A39E93] hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#A39E93]">
                    {fmt.name}
                  </span>
                  <span className="font-mono text-xs text-[#C5A880]">
                    {fmt.dimensions}
                  </span>
                </div>
                <span className="mt-2 whitespace-nowrap font-serif text-2xl font-light text-[#EBE7DF]">
                  {fmt.price}&nbsp;€
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Total & Acciones de Compra Directa / Solicitud */}
      <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#A39E93] block">
            Total ({currentFormat.dimensions})
          </span>
          <span className="whitespace-nowrap font-serif text-3xl font-light text-[#EBE7DF]">
            {unitPrice}&nbsp;€
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleBuyDirectly}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#C5A880] bg-[#C5A880] px-7 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white"
          >
            <span>Comprar ahora</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-white/20 bg-[#0B0C0E] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] font-medium transition hover:border-white/40 hover:text-white"
          >
            <span>{added ? "✓ En la Cesta" : "+ Añadir a la Cesta"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
