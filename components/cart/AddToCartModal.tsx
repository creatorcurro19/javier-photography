"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import { PRINT_FORMATS, addToCart } from "@/lib/cart";
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
  const [framed, setFramed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const currentFormat = PRINT_FORMATS[selectedFormatId];
  const unitPrice = currentFormat.price + (framed ? currentFormat.framePrice : 0);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart({
      photoId: photo.id,
      slug: photo.slug,
      title: photo.title,
      image: photo.image,
      category: photo.category,
      format: currentFormat,
      framed,
      quantity,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
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
              <span>{t("Configurar Copia de Autor", "Configure Certified Print")}</span>
            </div>
            <h3 id="modal-title" className="mt-1 font-serif text-xl font-light text-[#EBE7DF] truncate">
              {photo.title}
            </h3>
            <p className="mt-1 font-mono text-[10px] text-[#8E8A80]">
              {t(
                "Papel 100% Algodón Hahnemühle 308g · Norma ISO 9706",
                "100% Cotton Hahnemühle 308g · ISO 9706 Standard"
              )}
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="mt-5 space-y-2.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
            {t("1. Seleccione Formato de Edición:", "1. Select Edition Format:")}
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                  className={`flex flex-col justify-between rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? "border-[#C5A880] bg-[#C5A880]/15 text-[#EBE7DF] ring-1 ring-[#C5A880]"
                      : "border-white/[0.08] bg-[#151719] text-[#8E8A80] hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#C5A880]">
                    {fmt.name.split(" ")[1] || fmt.name}
                  </span>
                  <span className="mt-1 font-serif text-base font-light text-[#EBE7DF]">
                    {fmt.price} €
                  </span>
                  <span className="mt-0.5 font-mono text-[9px] text-[#8E8A80]">
                    {fmt.dimensions}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Framing Option */}
        <div className="mt-4 rounded-lg border border-white/[0.08] bg-[#151719] p-3.5">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={framed}
              onChange={(e) => setFramed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-[#C5A880]"
            />
            <div className="text-xs">
              <span className="font-medium text-[#EBE7DF]">
                {t(
                  `Añadir Enmarcado Museo con Cristal UV 99% (+${currentFormat.framePrice} €)`,
                  `Add Museum Framing with 99% UV Glass (+${currentFormat.framePrice} €)`
                )}
              </span>
              <p className="mt-0.5 text-[11px] text-[#8E8A80] font-light leading-relaxed">
                {t(
                  "Madera maciza lacada en negro mate o roble natural, con paspartú libre de ácido de 5 cm.",
                  "Solid wood frame in matte black or natural oak, with 5 cm acid-free cotton mat."
                )}
              </p>
            </div>
          </label>
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
            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className="w-full rounded-lg border border-[#C5A880] bg-[#C5A880] py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white disabled:opacity-50"
            >
              {added
                ? t("✓ Añadido a la Cesta", "✓ Added to Bag")
                : t("Añadir a la Cesta →", "Add to Bag →")}
            </button>
            <p className="text-center font-mono text-[9px] text-[#8E8A80]">
              {t(
                "Incluye Certificado de Autenticidad con holograma y envío asegurado",
                "Includes signed Certificate of Authenticity with hologram & insured shipping"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
