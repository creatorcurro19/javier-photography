"use client";

import { useState } from "react";
import type { Photo } from "@/types/photo";
import AddToCartModal from "@/components/cart/AddToCartModal";

interface PrintCardActionProps {
  photo: Photo;
}

export default function PrintCardAction({ photo }: PrintCardActionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="border border-[#EBE7DF] bg-[#EBE7DF] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white"
      >
        Añadir a la Cesta
      </button>

      <AddToCartModal
        photo={photo}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
