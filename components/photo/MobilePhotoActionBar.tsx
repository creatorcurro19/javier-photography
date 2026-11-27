"use client";

import { useState } from "react";
import type { Photo } from "@/types/photo";
import { BASE_PRINT_FORMATS } from "@/data/formatos";
import { PAGOS_ACTIVOS } from "@/data/site-config";
import { getSavedWorks } from "@/components/photo/FavoriteButton";
import AddToCartModal from "@/components/cart/AddToCartModal";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

const STORAGE_KEY = "javier_selected_works";

export default function MobilePhotoActionBar({ photo: rawPhoto }: { photo: Photo }) {
  const { lang, t } = useLanguage();
  const photo = getLocalizedPhoto(rawPhoto, lang);
  const [saved, setSaved] = useState(() => getSavedWorks().includes(rawPhoto.title));
  const [copied, setCopied] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const toggleFavorite = () => {
    const current = getSavedWorks();
    const updated = current.includes(rawPhoto.title)
      ? current.filter((tItem) => tItem !== rawPhoto.title)
      : [...current, rawPhoto.title];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(updated.includes(rawPhoto.title));
    window.dispatchEvent(new Event("javier-selection-updated"));
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${photo.title} — ${t("Javier Espinosa Fotografía", "Javier Espinosa Photography")}`;
    const text = t(
      `Fotografía de autor por Javier Espinosa: «${photo.title}» (${photo.focalLength} · ${photo.camera})`,
      `Fine Art photograph by Javier Espinosa: "${photo.title}" (${photo.focalLength} · ${photo.camera})`
    );

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore
    }
  };

  return (
    <aside
      aria-label={t("Acciones móviles para esta obra", "Mobile actions for this photograph")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#202226] bg-[#0B0C0E]/95 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* Favorite Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={
            saved
              ? t("Quitar de favoritos", "Remove from favorites")
              : t("Guardar en favoritos", "Save to favorites")
          }
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition ${
            saved
              ? "border-[#8E8A80] bg-[#8E8A80] text-[#0B0C0E]"
              : "border-[#202226] bg-[#151618] text-[#EBE7DF] hover:border-[#8E8A80]"
          }`}
        >
          <span className="text-base">{saved ? "♥" : "♡"}</span>
        </button>

        {/* Native Share Button */}
        <button
          type="button"
          onClick={handleShare}
          aria-label={t("Compartir fotografía", "Share photograph")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#202226] bg-[#151618] text-[#EBE7DF] transition hover:border-[#8E8A80]"
        >
          {copied ? (
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
              ✓
            </span>
          ) : (
            <svg
              className="h-4 w-4 text-[#8E8A80]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          )}
        </button>

        {/* Primary Action: Direct In-Page Print Purchase Modal or Archive Request */}
        {photo.prints ? (
          <button
            type="button"
            onClick={() => setBuyModalOpen(true)}
            className="flex h-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-[#C5A880] bg-[#C5A880] px-2.5 sm:px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.18em] text-[#0B0C0E] transition hover:bg-white hover:border-white shadow"
          >
            <span className="whitespace-nowrap">
              {PAGOS_ACTIVOS
                ? t("Copia Fine Art", "Fine Art Print")
                : t("Solicitar copia", "Request print")}{" "}
              · {t("Desde", "From")} {photo.pricing?.estudio ?? BASE_PRINT_FORMATS.estudio.defaultPrice}&nbsp;€ →
            </span>
          </button>
        ) : (
          <a
            href="#adquirir-copia"
            className="flex h-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-[#C5A880] bg-[#C5A880] px-2.5 sm:px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.18em] text-[#0B0C0E] transition hover:bg-white hover:border-white shadow"
          >
            <span>
              {photo.category === "coches-rally"
                ? t("Solicitud Pilotos & Prensa →", "Drivers & Press Request →")
                : t("Consultar Archivo →", "Inquire Archive →")}
            </span>
          </a>
        )}
      </div>

      {photo.prints && (
        <AddToCartModal
          photo={rawPhoto}
          isOpen={buyModalOpen}
          onClose={() => setBuyModalOpen(false)}
        />
      )}
    </aside>
  );
}
