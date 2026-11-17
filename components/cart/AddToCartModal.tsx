"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import { PRINT_FORMATS, addToCart } from "@/lib/cart";
import type { PrintFormat } from "@/types/cart";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg border border-white/[0.1] bg-[#0B0C0E] p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8E8A80] hover:text-white transition p-1"
          aria-label="Cerrar configurador"
        >
          ✕
        </button>

        {/* Header Preview */}
        <div className="flex gap-4 border-b border-white/[0.08] pb-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#151618] border border-white/10">
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8E8A80]">
              Configurar Copia Fine Art
            </span>
            <h3 id="modal-title" className="font-serif text-xl font-light text-[#EBE7DF]">
              {photo.title}
            </h3>
            <p className="mt-1 font-mono text-[10px] text-[#8E8A80]">
              Papel 100% Algodón Hahnemühle Photo Rag® 308g · ISO 9706
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="mt-6 space-y-3">
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
            Seleccione Formato de Edición
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
                  className={`flex flex-col justify-between border p-3 text-left transition ${
                    isSelected
                      ? "border-[#EBE7DF] bg-[#151618] text-[#EBE7DF]"
                      : "border-white/[0.08] bg-transparent text-[#8E8A80] hover:border-white/30"
                  }`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-wider">
                    {fmt.name.split(" ")[1] || fmt.name}
                  </span>
                  <span className="mt-1 font-serif text-sm font-light text-[#EBE7DF]">
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
        <div className="mt-5 border border-white/[0.08] bg-[#151618]/50 p-3.5">
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
                Marco macizo de madera (negro mate o roble natural) con paspartú libre de ácido de 5 cm.
              </p>
            </div>
          </label>
        </div>

        {/* Quantity & Summary Footer */}
        <div className="mt-6 border-t border-white/[0.08] pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A80]">
                Cantidad:
              </span>
              <div className="flex items-center border border-white/10 bg-[#151618]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 font-mono text-xs text-[#8E8A80] hover:text-white"
                >
                  -
                </button>
                <span className="px-2 font-mono text-xs text-[#EBE7DF]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 font-mono text-xs text-[#8E8A80] hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E8A80] block">
                Total Selección
              </span>
              <span className="font-serif text-xl font-light text-[#EBE7DF]">
                {totalPrice} €
              </span>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className="flex-1 border border-[#EBE7DF] bg-[#EBE7DF] py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white disabled:opacity-50"
            >
              {added ? "✓ Añadido a la Cesta" : "Añadir a la Cesta →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
