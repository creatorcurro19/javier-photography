"use client";

import { useState } from "react";
import type { Photo } from "@/types/photo";
import AddToCartModal from "@/components/cart/AddToCartModal";
import { useLanguage } from "@/lib/i18n";

interface PrintCardActionProps {
  photo: Photo;
}

export default function PrintCardAction({ photo }: PrintCardActionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-[#C5A880] bg-[#C5A880] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white shadow"
      >
        <span>+ {t("Cesta", "Bag")}</span>
      </button>

      <AddToCartModal
        photo={photo}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
