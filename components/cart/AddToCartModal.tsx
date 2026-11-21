"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import { getFormatsForPhoto, addToCart } from "@/lib/cart";
import type { PrintFormat } from "@/types/cart";
import { useLanguage } from "@/lib/i18n";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";

interface AddToCartModalProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToCartModal({
  photo,
  isOpen,
  onClose,
}: AddToCartModalProps) {
  const { t } = useLanguage();
  const [selectedFormatId, setSelectedFormatId] =
    useState<PrintFormat["id"]>("galeria");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const formats = getFormatsForPhoto(photo);
  const currentFormat = formats[selectedFormatId];
  const unitPrice = currentFormat.price;
  const totalPrice = unitPrice * quantity;
  const editionTotal = photo.pricing?.editionTotal ?? 25;
  const shortPaper = photo.pricing?.paper.includes("Baritado")
    ? "Papel Baritado 340g · ISO 9706"
    : "Papel 100% Algodón 308g · ISO 9706";

  const handleAdd = () => {
    addToCart({
      photoId: photo.id,
      slug: photo.slug,
      title: photo.title,
      image: photo.image,
      category: photo.category,
      format: currentFormat,
      framed: false,
      quantity,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  const handleBuyNow = () => {
    addToCart({
      photoId: photo.id,
      slug: photo.slug,
      title: photo.title,
      image: photo.image,
      category: photo.category,
      format: currentFormat,
      framed: false,
      quantity,
    });
    onClose();
    window.dispatchEvent(new Event("open-checkout-direct"));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#C5A880]/30 bg-[#0E1012] p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8E8A80] hover:text-white transition p-1"
          aria-label={t("Cerrar configurador", "Close configurator")}
        >
          ✕
        </button>

        {/* Header Preview */}
        <div className="flex gap-4 border-b border-white/[0.08] pb-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#151618] border border-white/10 shadow-md">
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A880]">
              <AndalusianStarMark className="h-2.5 w-2.5 text-[#C5A880]" />
              <span>
                {t(
                  `Edición Limitada (${editionTotal} ej.) · Envío en Tubo`,
                  `Limited Edition (${editionTotal} prints) · Tube Delivery`
                )}
              </span>
            </div>
            <h3 id="modal-title" className="mt-1 font-serif text-xl font-light text-[#EBE7DF] truncate">
              {photo.title}
            </h3>
            <p className="mt-1 font-mono text-[10px] text-[#8E8A80]">
              {shortPaper}
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="mt-5 space-y-2.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
            {t("Seleccione Formato de Impresión:", "Select Print Format:")}
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                  className={`flex flex-col justify-between rounded-lg border p-3 text-left transition ${
                    isDisabled
                      ? "cursor-not-allowed border-white/[0.04] bg-[#111214] opacity-45"
                      : isSelected
                      ? "border-[#C5A880] bg-[#C5A880]/15 text-[#EBE7DF] ring-1 ring-[#C5A880]"
                      : "border-white/[0.08] bg-[#151719] text-[#A39E93] hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#C5A880]">
                    {fmt.name.replace("Formato ", "")} {isDisabled ? "(No disp.)" : ""}
                  </span>
                  <span className="mt-1 font-serif text-lg font-light text-[#EBE7DF]">
                    {fmt.price} €
                  </span>
                  <span className="mt-0.5 font-mono text-[9px] text-[#A39E93]">
                    Papel: {fmt.dimensions}
                  </span>
                  <span className="mt-0.5 font-mono text-[8.5px] text-[#A39E93]">
                    {fmt.imageDimensions}
                  </span>
                </button>
              );
            })}
          </div>
          {formats.coleccion.disabled && (
            <p className="mt-2 rounded border border-[#C5A880]/30 bg-black/50 p-2.5 font-mono text-[10px] leading-relaxed text-[#E5D3B3]">
              {formats.coleccion.disabledReason}
            </p>
          )}
        </div>

        {/* Tube Delivery Guarantee (Unframed) */}
        <div className="mt-4 rounded-lg border border-white/[0.08] bg-[#151719] p-3.5 text-xs">
          <span className="font-medium text-[#EBE7DF]">
            {t(
              "Impresión Fine Art sin enmarcar · Envío en tubo rígido protector",
              "Unframed Fine Art print · Shipped in a high-density protective tube"
            )}
          </span>
          <p className="mt-0.5 text-[11px] text-[#8E8A80] font-light leading-relaxed">
            {t(
              "Envuelta en papel seda libre de ácido con margen blanco de conservación y Certificado de Autenticidad firmado y numerado.",
              "Wrapped in acid-free tissue paper with white archival border and signed, numbered Certificate of Authenticity."
            )}
          </p>
        </div>

        {/* Quantity & Summary Footer */}
        <div className="mt-5 border-t border-white/[0.08] pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A80]">
                {t("Cantidad:", "Quantity:")}
              </span>
              <div className="flex items-center rounded border border-white/10 bg-[#151719]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 font-mono text-xs text-[#8E8A80] hover:text-white"
                  aria-label={t("Reducir cantidad", "Decrease quantity")}
                >
                  -
                </button>
                <span className="px-2 font-mono text-xs text-[#EBE7DF]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 font-mono text-xs text-[#8E8A80] hover:text-white"
                  aria-label={t("Aumentar cantidad", "Increase quantity")}
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E8A80] block">
                {t("Total Selección", "Total Selection")}
              </span>
              <span className="font-serif text-2xl font-light text-[#EBE7DF]">
                {totalPrice} €
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full rounded-lg border border-[#EBE7DF] bg-[#EBE7DF] py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
              >
                {t("Tramitar Pedido →", "Proceed to Checkout →")}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={added}
                className="w-full rounded-lg border border-[#C5A880] bg-[#C5A880]/15 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] font-semibold transition hover:bg-[#C5A880] hover:text-[#0B0C0E] disabled:opacity-50"
              >
                {added
                  ? t("✓ En la Cesta", "✓ In Bag")
                  : t("+ Añadir a Cesta", "+ Add to Bag")}
              </button>
            </div>
            <Link
              href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}&formato=${encodeURIComponent(`${currentFormat.name} (${currentFormat.dimensions} · ${unitPrice} €)`)}`}
              onClick={onClose}
              className="w-full rounded-lg border border-white/15 bg-[#151719] py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
            >
              {t("Solicitar esta copia por formulario →", "Request this print via form →")}
            </Link>
            <p className="text-center font-mono text-[9px] text-[#A39E93]">
              {t(
                "Venta directa del estudio · Certificado firmado ISO 9706 y envío en tubo rígido",
                "Direct studio acquisition · Signed ISO 9706 Certificate & rigid tube shipping"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
